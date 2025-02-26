import React, { createContext, useState, useEffect } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem("theme") || "light"
  );

  // Define MUI themes for light and dark modes
  const lightTheme = createTheme({
    palette: {
      mode: "light",
      background: {
        default: "#f6f8fa", // GitHub light background
        paper: "#fff",
      },
      text: {
        primary: "#24292e", // GitHub light text
        secondary: "#6a737d",
      },
      primary: {
        main: "#0366d6", // GitHub blue
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#0d1117", // GitHub dark background
        paper: "#161b22",
      },
      text: {
        primary: "#c9d1d9", // GitHub dark text
        secondary: "#8b949e",
      },
      primary: {
        main: "#0366d6",
      },
    },
  });

  const muiTheme = themeMode === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    localStorage.setItem("theme", themeMode);
    // Optional: Still toggle the 'dark' class for non-MUI components if needed
    document.documentElement.classList.toggle("dark", themeMode === "dark");
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme: themeMode, toggleTheme }}>
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
