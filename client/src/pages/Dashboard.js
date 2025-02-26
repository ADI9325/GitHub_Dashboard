import React, { useState, useEffect, useContext } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getRepoMetrics } from "../services/api";
import {
  processPRData,
  processMergeTimeData,
  processBranchActivityData,
} from "../utils/metrics";
import { ThemeContext } from "../context/ThemeContext";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Fade,
} from "@mui/material";
import {
  Visibility,
  People,
  HourglassEmpty,
  Brightness7,
  Brightness4,
} from "@mui/icons-material"; // Added Brightness icons

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ selectedRepos, isFetching, setIsFetching }) => {
  const [metrics, setMetrics] = useState({});
  const [timeRange, setTimeRange] = useState("3 months");
  const [selectedContributor, setSelectedContributor] = useState(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (selectedRepos.length > 0) {
      const fetchMetrics = async () => {
        const repoMetrics = {};
        try {
          for (const repo of selectedRepos) {
            const res = await getRepoMetrics(repo.owner.login, repo.name);
            repoMetrics[repo.full_name] = res.data;
          }
          setMetrics(repoMetrics);
        } catch (error) {
          console.error("Error fetching repo metrics:", error.message);
        } finally {
          setIsFetching(false);
        }
      };
      fetchMetrics();
    } else {
      setMetrics({});
      setIsFetching(false);
    }
  }, [selectedRepos, setIsFetching]);

  const getPRChartData = (repoData) => {
    if (!repoData) return { labels: [], datasets: [] };
    const { labels, teamData, contributors } = processPRData(
      repoData.prs,
      timeRange
    );
    const datasets = [
      {
        label: "Team Merged PRs",
        data: teamData,
        borderColor: "#0366d6",
        fill: false,
        tension: 0.3,
      },
    ];
    if (selectedContributor) {
      const contributorPRs = repoData.prs.filter(
        (pr) => pr.user === selectedContributor
      );
      const { teamData: contributorData } = processPRData(
        contributorPRs,
        timeRange
      );
      datasets.push({
        label: `${selectedContributor}'s Merged PRs`,
        data: contributorData,
        borderColor: "#d73a49",
        fill: false,
        tension: 0.3,
      });
    }
    return { labels, datasets };
  };

  const getMergeTimeChartData = (repoData) => {
    if (!repoData) return { labels: [], datasets: [] };
    const { labels, avgMergeTimes } = processMergeTimeData(
      repoData.prs,
      timeRange
    );
    return {
      labels,
      datasets: [
        {
          label: "Avg PR Merge Time (hours)",
          data: avgMergeTimes,
          borderColor: "#28a745",
          fill: false,
          tension: 0.3,
        },
      ],
    };
  };

  const getBranchActivityChartData = (repoData) => {
    if (!repoData || !repoData.branches) return { labels: [], datasets: [] };
    const { labels, branchCreations } = processBranchActivityData(
      repoData.branches,
      timeRange
    );
    return {
      labels,
      datasets: [
        {
          label: "Branch Creations",
          data: branchCreations,
          borderColor: "#6f42c1",
          fill: false,
          tension: 0.3,
        },
      ],
    };
  };

  const toggleContributor = (contributor) => {
    setSelectedContributor(
      selectedContributor === contributor ? null : contributor
    );
  };

  return (
    <Box sx={{ flex: 1, p: 3, position: "relative" }}>
      {/* Full-screen Loading Overlay with Customizations */}
      {isFetching && (
        <Fade in={isFetching} timeout={{ enter: 300, exit: 300 }}>
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1300,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <HourglassEmpty
                sx={{
                  fontSize: 60,
                  color: theme === "dark" ? "#c9d1d9" : "#0366d6",
                  animation: "spin 1s linear infinite",
                }}
              />
              <Typography
                variant="h6"
                sx={{ color: theme === "dark" ? "#c9d1d9" : "#24292e" }}
              >
                Loading...
              </Typography>
            </Box>
          </Box>
        </Fade>
      )}

      <Box
        sx={{
          mb: 4,
          pb: 2,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {selectedRepos.length > 0
            ? `${selectedRepos[0].owner.login}/${selectedRepos[0].name}`
            : "Select a Repository"}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl size="small">
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="3 months">3 Months</MenuItem>
              <MenuItem value="6 months">6 Months</MenuItem>
            </Select>
          </FormControl>
          <ThemeToggle />
        </Box>
      </Box>

      {selectedRepos.length === 0 ? (
        <Typography sx={{ textAlign: "center", py: 8 }} color="text.secondary">
          Select a repository to view metrics.
        </Typography>
      ) : (
        selectedRepos.map((repo) => {
          const prChartData = getPRChartData(metrics[repo.full_name]);
          const mergeTimeChartData = getMergeTimeChartData(
            metrics[repo.full_name]
          );
          const branchActivityChartData = getBranchActivityChartData(
            metrics[repo.full_name]
          );
          const contributors = metrics[repo.full_name]
            ? Object.keys(
                processPRData(metrics[repo.full_name].prs, timeRange)
                  .contributors
              )
            : [];

          return (
            <Box key={repo.id} sx={{ mb: 6 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 2fr" },
                  gap: 3,
                }}
              >
                {/* Metrics */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {[
                    {
                      label: "Avg Merge Time",
                      value: `${
                        metrics[repo.full_name]?.avgMergeTime || 0
                      } hours`,
                      color: "#0366d6",
                    },
                    {
                      label: "Total Branches",
                      value: metrics[repo.full_name]?.totalBranchActivity || 0,
                      color: "#28a745",
                    },
                    {
                      label: "Total Merged PRs",
                      value: metrics[repo.full_name]?.prs?.length || 0,
                      color: "#d73a49",
                    },
                  ].map((metric, idx) => (
                    <Card key={idx} sx={{ boxShadow: "none" }}>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          {metric.label}
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ color: metric.color }}
                        >
                          {metric.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                  {/* Contributors Card */}
                  <Card sx={{ boxShadow: "none" }}>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <People sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Contributors ({contributors.length})
                        </Typography>
                      </Box>
                      {contributors.length > 0 ? (
                        <List dense sx={{ maxHeight: 200, overflow: "auto" }}>
                          {contributors.map((contributor) => (
                            <ListItem key={contributor} disablePadding>
                              <IconButton
                                onClick={() => toggleContributor(contributor)}
                                size="small"
                                sx={{
                                  mr: 1,
                                  color:
                                    selectedContributor === contributor
                                      ? "#0366d6"
                                      : "inherit",
                                }}
                              >
                                <Visibility />
                              </IconButton>
                              <ListItemText
                                primary={contributor}
                                primaryTypographyProps={{ variant: "body2" }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No contributors found.
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Box>

                {/* Charts */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {[
                    { title: "Merged PRs Over Time", data: prChartData },
                    { title: "Avg PR Merge Time", data: mergeTimeChartData },
                    { title: "Branch Activity", data: branchActivityChartData },
                  ].map((chart, idx) => (
                    <Card key={idx} sx={{ boxShadow: "none" }}>
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          fontWeight="medium"
                          sx={{ mb: 2 }}
                        >
                          {chart.title}
                        </Typography>
                        <Box sx={{ height: 250 }}>
                          <Line
                            data={chart.data}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { position: "top" },
                                title: { display: false },
                              },
                              scales: {
                                x: {
                                  ticks: {
                                    color:
                                      theme === "dark" ? "#c9d1d9" : "#24292e",
                                  },
                                },
                                y: {
                                  beginAtZero: true,
                                  ticks: {
                                    color:
                                      theme === "dark" ? "#c9d1d9" : "#24292e",
                                  },
                                },
                              },
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Box>
          );
        })
      )}
    </Box>
  );
};

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <Button
      onClick={toggleTheme}
      variant="contained"
      color="primary"
      size="small"
      startIcon={theme === "dark" ? <Brightness7 /> : <Brightness4 />}
      sx={{ textTransform: "none" }}
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </Button>
  );
};

export default Dashboard;
