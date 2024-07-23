import { useState, useEffect } from "react";
// import AboutPage from "../Pages/AboutPage";
// import SignupPage from "../Pages/SignupPage";
// import LoginPage from "../Pages/LoginPage";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function NavBar () {
  const [LoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem('ImmivanRole'));
    if (role === "client" || role === "business") {
      setLoggedIn(true)
    }
  }, [])

  
    return (
      
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}>
          <div className="container-fluid">
          
          <img src="photos/logo.png" alt="Logo" style={{ height: '70px' }} />

        
            <div className="collapse navbar-collapse justify-content-end">
              <div className="navbar-nav">
              <Link to="/" className="nav-link btn btn-light mx-2">home</Link>
                <Link to="/about" className="nav-link btn btn-light mx-2">About</Link>
                {LoggedIn ? (
                  <Link to="/logout" className="nav-link btn btn-light mx-2">Log out</Link>
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
  )
}

export default NavBar;