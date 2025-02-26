import React, { useState, useEffect, useContext } from "react";
import { getRepos } from "../services/api";
import { ThemeContext } from "../context/ThemeContext";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Menu, Close } from "@mui/icons-material";

const Sidebar = ({ onSelectRepo, selectedRepo }) => {
  const [repos, setRepos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    getRepos()
      .then((res) => setRepos(res.data))
      .catch((err) => console.error("Error fetching repos:", err));
  }, []);

  const handleRepoSelect = (repo) => {
    onSelectRepo(repo);
    setIsOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={() => setIsOpen(true)}
        sx={{
          display: { md: "none" },
          position: "fixed",
          top: 10,
          left: 10,
          zIndex: 1200,
          color: theme === "dark" ? "#c9d1d9" : "#24292e", // Match text color
        }}
      >
        <Menu />
      </IconButton>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: 256,
            bgcolor: theme === "dark" ? "#0d1117" : "#f6f8fa",
            color: theme === "dark" ? "#c9d1d9" : "#24292e",
            borderRight: `1px solid ${
              theme === "dark" ? "#30363d" : "#e1e4e8"
            }`,
            overflowX: "hidden", // Prevent horizontal overflow
          },
        }}
      >
        <SidebarContent
          repos={repos}
          selectedRepo={selectedRepo}
          handleRepoSelect={handleRepoSelect}
          theme={theme}
        />
      </Drawer>

      <Drawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 256,
            bgcolor: theme === "dark" ? "#0d1117" : "#f6f8fa",
            color: theme === "dark" ? "#c9d1d9" : "#24292e",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={() => setIsOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <SidebarContent
          repos={repos}
          selectedRepo={selectedRepo}
          handleRepoSelect={handleRepoSelect}
          theme={theme}
        />
      </Drawer>
    </>
  );
};

const SidebarContent = ({ repos, selectedRepo, handleRepoSelect, theme }) => (
  <Box sx={{ p: 2 }}>
    <Typography
      variant="h6"
      fontWeight="bold"
      sx={{
        mb: 2,
        pb: 1,
        borderBottom: `1px solid ${theme === "dark" ? "#30363d" : "#e1e4e8"}`,
      }}
    >
      Repositories
    </Typography>
    {repos.length === 0 ? (
      <Typography sx={{ color: theme === "dark" ? "#8b949e" : "#6a737d" }}>
        Loading...
      </Typography>
    ) : (
      <List>
        {repos.map((repo) => (
          <ListItem key={repo.id} disablePadding>
            <ListItemButton
              selected={selectedRepo?.id === repo.id}
              onClick={() => handleRepoSelect(repo)}
              sx={{
                borderRadius: "4px", // Add rounded corners
                py: 1.2, // Adjust padding for better spacing
                "&.Mui-selected": {
                  bgcolor: "#0366d6",
                  color: "#fff",
                  "&:hover": {
                    // Hover effect when selected
                    bgcolor: "#0350a6",
                  },
                },
                "&:hover": {
                  bgcolor: theme === "dark" ? "#21262d" : "#eaecef",
                },
                transition: "background-color 0.2s ease-in-out", // Add smooth transition
              }}
            >
              <ListItemText
                primary={repo.name}
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    )}
  </Box>
);

export default Sidebar;
