import React, { useState, useEffect } from "react";
import { getUser } from "./services/api";
import LoginButton from "./components/LoginButton";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "./context/ThemeContext";
import { Box, CssBaseline, Typography } from "@mui/material";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initial app loading
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isFetching, setIsFetching] = useState(false); // Fetching repo data

  useEffect(() => {
    getUser()
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelectRepo = (repo) => {
    setIsFetching(true); // Start loading
    setSelectedRepo(repo);
    // Simulate fetch completion (actual timing depends on Dashboard's useEffect)
    setTimeout(() => setIsFetching(false), 1000); // Remove this if Dashboard handles it
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          bgcolor: "#f6f8fa",
        }}
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {user ? (
          <>
            <Sidebar
              onSelectRepo={handleSelectRepo}
              selectedRepo={selectedRepo}
            />
            <Box
              component="main"
              sx={{ flex: 1, ml: { md: "256px" }, position: "relative" }}
            >
              <Dashboard
                selectedRepos={selectedRepo ? [selectedRepo] : []}
                isFetching={isFetching}
                setIsFetching={setIsFetching}
              />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LoginButton />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
