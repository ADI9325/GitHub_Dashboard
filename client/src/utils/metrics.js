const processPRData = (prs, timeRange) => {
  const now = new Date();
  const rangeStart = new Date();
  rangeStart.setMonth(now.getMonth() - (timeRange === "3 months" ? 3 : 6));

  const filteredPRs = prs.filter((pr) => new Date(pr.created_at) >= rangeStart);
  const weeks = {};
  const contributors = {};

  filteredPRs.forEach((pr) => {
    if (pr.merged_at) {
      const week = new Date(pr.merged_at).toLocaleString("en-US", {
        week: "short",
        year: "numeric",
      });
      weeks[week] = (weeks[week] || 0) + 1;
      contributors[pr.user] = (contributors[pr.user] || 0) + 1;
    }
  });

  const labels = Object.keys(weeks).sort();
  const teamData = labels.map((week) => weeks[week] || 0);

  return { labels, teamData, contributors };
};

const processMergeTimeData = (prs, timeRange) => {
  const now = new Date();
  const rangeStart = new Date();
  rangeStart.setMonth(now.getMonth() - (timeRange === "3 months" ? 3 : 6));

  const filteredPRs = prs.filter(
    (pr) => new Date(pr.created_at) >= rangeStart && pr.merged_at
  );
  const weeks = {};

  filteredPRs.forEach((pr) => {
    const week = new Date(pr.merged_at).toLocaleString("en-US", {
      week: "short",
      year: "numeric",
    });
    weeks[week] = weeks[week] || [];
    weeks[week].push(pr.merge_time);
  });

  const labels = Object.keys(weeks).sort();
  const avgMergeTimes = labels.map((week) =>
    weeks[week].length > 0
      ? weeks[week].reduce((sum, time) => sum + time, 0) / weeks[week].length
      : 0
  );

  return { labels, avgMergeTimes };
};

const processBranchActivityData = (branches, timeRange) => {
  const now = new Date();
  const rangeStart = new Date();
  rangeStart.setMonth(now.getMonth() - (timeRange === "3 months" ? 3 : 6));

  const filteredBranches = branches.filter(
    (branch) =>
      branch.earliestCommit && new Date(branch.earliestCommit) >= rangeStart
  );
  const weeks = {};

  filteredBranches.forEach((branch) => {
    const week = new Date(branch.earliestCommit).toLocaleString("en-US", {
      week: "short",
      year: "numeric",
    });
    weeks[week] = (weeks[week] || 0) + 1;
  });

  const labels = Object.keys(weeks).sort();
  const branchCreations = labels.map((week) => weeks[week] || 0);

  return { labels, branchCreations };
};

export { processPRData, processMergeTimeData, processBranchActivityData };
