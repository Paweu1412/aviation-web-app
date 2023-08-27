import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

export const Spinner = (query) => {
  return (
    <div>
      <Backdrop
        sx={{ 
            color: 'white', 
            zIndex: 1000
        }}
        open={query.open}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Backdrop>
    </div>
  );
}
