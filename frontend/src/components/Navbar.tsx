import { Link } from "react-router-dom";
import "../App.css";
import {logout} from "./auth.tsx"
import {Client, Account} from "appwrite"

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67e9d1c10001b5c3836e");

const account = new Account(client);

const Navbar = () => {
  return (
    <header>
      <div className="header">
        <div className="title-with-links">
          <header className="title">Workout Logger</header>
          <div className="nav-links">
            <Link to="/Community" className="link">
              Community
            </Link>
            <Link to="/Dashboard" className="link">
              Dashboard
            </Link>
            <Link to="/Login" className="link" onClick={logout}> 
            Logout
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
