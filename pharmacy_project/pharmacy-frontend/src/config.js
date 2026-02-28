const DEFAULT_API_BASE = "https://pharmacy-backend-jhju.onrender.com";

export const API_BASE = (process.env.REACT_APP_API_URL || DEFAULT_API_BASE).replace(/\/+$/, "");
