import { useState, useEffect } from "react";
// import AboutPage from "../Pages/AboutPage";
// import SignupPage from "../Pages/SignupPage";
// import LoginPage from "../Pages/LoginPage";
import { Link } from "react-router-dom";

function NavBar () {
  const [LoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem('ImmivanRole'));
    if (role === "client" || role === "business") {
      setLoggedIn(true)
    }
  }, [])

  return (
    <>
    {LoggedIn? <>
    Navbar
      <Link to="/about">About</Link>
      <Link to="/logout">Log out</Link>
    </>: 
    <>
      Navbar
      <Link to="/about">About</Link>
      <Link to="/signupSelection">Sign Up</Link>
      <Link to="/loginSelection">Log in</Link></>}
    </>
  )
}

export default NavBar;