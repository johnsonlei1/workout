import { Link } from "react-router-dom";
import "../App.css";

const Navbar = () => {

  return (
    <header>
        <div className="header">
           <header className="title">Workout Logger</header>
            <Link to="/Community" className="link">To Community</Link>
            <Link to="/Dashboard" className="link">To Dashboard</Link>
        </div>
    </header>
  );
};

export default Navbar;
