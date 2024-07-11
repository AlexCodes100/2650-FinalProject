import axios from "axios";
import GoogleButton from "react-google-button"
import { Link } from "react-router-dom";

function LoginSelectionPage () {
  return (
    <>
      <Link to=""><GoogleButton type="light" 
      onClick={() => { console.log('Google button clicked') }}
      label="Login with Google" /></Link>
      <Link to="/login" ><button>Login with your email</button></Link>
    </>
  )
}

export default LoginSelectionPage;