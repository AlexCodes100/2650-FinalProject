import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';

function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ImmivanRole'));
    if (userData && (userData.role === "client" || userData.role === "business")) {
      setLoggedIn(true);
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
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
                <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
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
