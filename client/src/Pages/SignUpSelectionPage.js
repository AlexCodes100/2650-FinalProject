import axios from "axios";
import GoogleButton from "react-google-button"
import { Link } from "react-router-dom";

function SignupSelectionPage () {
  return (
    <>
      <Link to=""><GoogleButton type="light" 
      onClick={() => { console.log('Google button clicked') }}
      label="Signup with Google" /></Link>
      <Link to="/signup" ><button>Signup with your email</button></Link>
    </>
  )
}

export default SignupSelectionPage;