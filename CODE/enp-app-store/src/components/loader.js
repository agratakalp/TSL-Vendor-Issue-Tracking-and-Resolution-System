import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function Loader() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999, // Optional: put it in front of other elements
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: make the background semi-transparent
      }}
    >
      <CircularProgress style={{ color: "white", fontSize: "12px" }} />
      <p style={{ color: "white", fontSize: "12px", marginLeft: "10px" }}>
        Loading...
      </p>
    </Box>
  );
}

export default Loader;
