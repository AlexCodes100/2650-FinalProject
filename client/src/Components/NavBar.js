import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';

function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('ImmivanRole');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('ImmivanRole');
    setLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}>
      <div className="container-fluid">
        <img src="photos/logo.png" alt="Logo" style={{ height: '70px' }} />
        <div className="collapse navbar-collapse justify-content-end">
          <div className="navbar-nav">
            <Link to="/" className="nav-link btn btn-light mx-2">Home</Link>
            <Link to="/about" className="nav-link btn btn-light mx-2">About</Link>
            {loggedIn ? (
              <DropdownButton id="dropdown-basic-button" title={`Hi, ${user.firstName}`} variant="light">
                <Dropdown.Item as={Link} to={`/${user.role}Dashboard`}>Dashboard</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Log out</Dropdown.Item>
              </DropdownButton>
            ) : (
              <>
                <Link to="/signup" className="nav-link btn btn-light mx-2">Sign Up</Link>
                <Link to="/loginSelection" className="nav-link btn btn-light mx-2">Log in</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
