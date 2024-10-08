import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default client;
