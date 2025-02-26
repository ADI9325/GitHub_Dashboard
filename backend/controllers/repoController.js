const axios = require("axios");

const getUserRepos = async (req, res) => {
  try {
    const { accessToken } = req.user;
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: { Authorization: `token ${accessToken}` },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRepoMetrics = async (req, res) => {
  const { owner, repo } = req.params;
  const { accessToken } = req.user;

  console.log(`Handling /metrics for: ${owner}/${repo}`);

  try {
    const [prsResponse, branchesResponse] = await Promise.all([
      axios.get(
        `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=100`,
        {
          headers: { Authorization: `token ${accessToken}` },
        }
      ),
      axios.get(
        `https://api.github.com/repos/${owner}/${repo}/branches?per_page=100`,
        {
          headers: { Authorization: `token ${accessToken}` },
        }
      ),
    ]);

    const prs = prsResponse.data;
    const branches = branchesResponse.data;

    // Fetch commit history for each branch
    const branchCommitsPromises = branches.map((branch) =>
      axios.get(
        `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch.name}&per_page=100`,
        {
          headers: { Authorization: `token ${accessToken}` },
        }
      )
    );
    const branchCommitsResponses = await Promise.all(branchCommitsPromises);
    const branchCommits = branchCommitsResponses.map(
      (response) => response.data
    );

    // Process PR data
    const prMetrics = prs.map((pr) => ({
      number: pr.number,
      title: pr.title,
      created_at: pr.created_at,
      merged_at: pr.merged_at,
      user: pr.user.login,
      merge_time: pr.merged_at
        ? (new Date(pr.merged_at) - new Date(pr.created_at)) / (1000 * 60 * 60)
        : null,
    }));

    const mergedPRs = prMetrics.filter((pr) => pr.merge_time !== null);
    const avgMergeTime =
      mergedPRs.length > 0
        ? mergedPRs.reduce((sum, pr) => sum + pr.merge_time, 0) /
          mergedPRs.length
        : 0;

    // Process branch activity
    const branchActivity = branches.map((branch, index) => {
      const commits = branchCommits[index];
      const commitDates = commits.map(
        (commit) => new Date(commit.commit.author.date)
      );
      const earliestCommit =
        commitDates.length > 0 ? Math.min(...commitDates) : null;
      const latestCommit =
        commitDates.length > 0 ? Math.max(...commitDates) : null;

      return {
        name: branch.name,
        commitCount: commits.length,
        earliestCommit: earliestCommit
          ? new Date(earliestCommit).toISOString()
          : null,
        latestCommit: latestCommit
          ? new Date(latestCommit).toISOString()
          : null,
      };
    });

    const metrics = {
      prs: prMetrics,
      branches: branchActivity,
      avgMergeTime: Number(avgMergeTime.toFixed(2)),
      totalBranchActivity: branchActivity.length,
    };

    res.json(metrics);
  } catch (error) {
    console.error(
      "Error fetching metrics:",
      error.response?.status,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUserRepos, getRepoMetrics };
