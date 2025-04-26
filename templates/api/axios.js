import axios from "axios";
const apiInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  timeout: 5000, // Timeout sau 5 giây
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiInstance;
