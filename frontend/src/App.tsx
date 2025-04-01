import "./App.css";
import { Client } from "appwrite";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Community from "./pages/Community";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67e9d1c10001b5c3836e");

// Create a layout component that conditionally renders the Navbar
function AppLayout() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/login" && location.pathname !== "/signup";
  
  return (
    <div>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/community" element={<Community />}/>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;