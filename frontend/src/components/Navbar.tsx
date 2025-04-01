import { Link } from "react-router-dom";
import "../App.css";

const Navbar = () => {
  return (
    <header>
      <div className="header">
        <div className="title-with-links">
          <header className="title">Workout Logger</header>
          <div className="nav-links">
            <Link to="/Community" className="link">To Community</Link>
            <Link to="/Dashboard" className="link">To Dashboard</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;