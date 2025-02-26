import React from "react";
import { Button } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

const LoginButton = () => {
  const handleLogin = () => {
    const baseURL =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    window.location.href = `${baseURL}/auth/github`;
  };

  return (
    <Button
      onClick={handleLogin}
      variant="contained"
      startIcon={<GitHubIcon />}
      sx={{
        textTransform: "none",
        backgroundColor: "#24292f",
        color: "#fff",
        "&:hover": {
          backgroundColor: "#2f343a",
        },
      }}
    >
      Sign in with GitHub
    </Button>
  );
};

export default LoginButton;
