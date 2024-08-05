import { useState } from "react"
import axios from "axios";

function LoginPage () {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [error, setError] = useState("");
  const apiUrl = "http://localhost:3000";

  const businessRoleChangeHandler = () => {
    setRole("business");
  }

  const clientRoleChangeHandler = () => {
    setRole("business");
  }

  const clientLoginHandler = (e) => {
    e.preventDefault();
    try {
      const response = axios.post("", {
        email: userName,
        password: password
      })
      if (response.data[0].result === "Login Successful") {
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

  const businessLoginHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/businessdashboard`, {
        email: userName,
        password: password
      })
      if (response.data.result === "Login Successful") {
        localStorage.setItem("ImmivanRole", JSON.stringify(response.data));
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

  const clientLoginUI = (
    <form id="loginForm" method="POST" action="/login" onSubmit={clientLoginHandler}>
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
    </form>);

  const businessLoginUI = (
    <form id="loginForm" method="POST" action="/businesslogin" onSubmit={businessLoginHandler}>
      <div>
        <label htmlFor="email">Business Email Address:</label>
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
    </form>);

  return (
    <>
      <h1>User Login</h1>
      <button onClick={clientRoleChangeHandler}>Client Login</button>
      <button onClick={businessRoleChangeHandler}>Business Login</button>
      {role === "client"? clientLoginUI:businessLoginUI}
    </>
  )
}

export default LoginPage