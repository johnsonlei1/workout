//import { useEffect, useState } from "react";
import "./App.css";
import { Client } from "appwrite";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login"; // Import Login Component
import Signup from "./pages/Signup"; // Import Signup Component
import Dashboard from "./pages/Dashboard"; // Import Dashboard Component
import Navbar from "./components/Navbar";
import Community from "./pages/Community";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject("67e9d1c10001b5c3836e"); // Use your actual Appwrite project ID

function App() {
  /*const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data")
      .then((response) => response.json())
      .then((data) => setData(data.message));
  }, []);*/

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>

          {/* Route to Login Page */}
          <Route path="/login" element={<Login />} />

          {/* Route to Signup Page */}
          <Route path="/signup" element={<Signup />} />

          {/* Route to Dashboard Page */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Route to Community Page */}
          <Route path="/community" element={<Community />}/>

          {/* Default route - redirects to login */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
