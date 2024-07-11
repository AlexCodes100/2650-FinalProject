import { useState } from "react"
import axios from "axios";

function LoginPage () {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginHandler = (e) => {
    e.preventDefault();
    try {
      const response = axios.post("", {
        email: userName,
        password: password
      })
      if (response.data.result === "Login Successful") {
        localStorage.setItem("ImmivanRole", JSON.stringify(response.data.role));
        // redirect to dashboard
        window.location.href = "/dashboard"
      } else {
        // console.log("Invalid email or password")
        setError("Invalid email or password")
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred. Please try again.');
    }
  }

  const usernameInputHandler = (e) => {
    e.preventDefault();
    setUserName(e.target.value);
  }

  const passwordInputHandler = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  }

  return (
    <>
      <h1>User Login</h1>
      <form id="loginForm" method="POST" action="/login">
        <div>
          <label htmlFor="email">Email Address:</label>
          <input type="email" id="email" name="email" aria-required="true" onChange={usernameInputHandler}required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" aria-required="true" onChange={passwordInputHandler} required />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </>
  )
}

export default LoginPage