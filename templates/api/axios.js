import axios from "axios";
const apiInstance = axios.create({
<<<<<<< HEAD
  baseURL: "http://localhost:8888",
=======
  baseURL: "http://localhost:8000/api/v1",
  timeout: 5000, // Timeout sau 5 giây
  headers: {
    "Content-Type": "application/json",
  },
>>>>>>> feat/post
});

export default apiInstance;
