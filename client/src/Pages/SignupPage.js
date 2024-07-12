import { useState, useEffect } from "react"

function SignupPage () {
  // Hooks
  const [user, setUser] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordLengthCheck, setPasswordLengthCheck] = useState(false);
  const [passwordNumberCheck, setPasswordNumberCheck] = useState(false);
  const [passwordSymbolCheck, setPasswordSymbolCheck] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [role, setRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [familySize, setFamilySize] = useState(-1);

  // Form input handlers
  const firstNameInputHandler = (e) => {
    e.preventDefault();
    setFirstName(e.target.value);
  }
  const lastNameInputHandler = (e) => {
    e.preventDefault();
    setLastName(e.target.value);
  }
  const emailInputHandler = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  }
  const passwordInputHandler = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
    validateLengthPassword(e.target.value);
    validateNumberPassword(e.target.value);
    validateSymbolPassword(e.target.value);
  }
  const confirmPasswordInputHandler = (e) => {
    e.preventDefault();
    setConfirmPassword(e.target.value);
    if (password !== e.target.value) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  }
  const preferredLanguageInputHandler = (e) => {
    e.preventDefault();
    setPreferredLanguage(e.target.value);
  }
  const organizationInputHandler = (e) => {
    e.preventDefault();
    setOrganization(e.target.value);
  }
  const familySizeInputHandler = (e) => {
    e.preventDefault();
    setFamilySize(e.target.value);
  }
  const validateLengthPassword = (password) => {
    const passwordRegex = /^(?=.{12,})/;
    const result = passwordRegex.test(password);
    setPasswordLengthCheck(result);
  };
  const validateNumberPassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])/;
    const result = passwordRegex.test(password);
    setPasswordNumberCheck(result);
  };
  const validateSymbolPassword = (password) => {
    const passwordRegex = /^(?=.*[!@#$%^&*-_=+])/;
    const result = passwordRegex.test(password);
    setPasswordSymbolCheck(result);
  };

  // Button Handler
  const pickStudyHandler = () => {
    setRole("study");
  }
  const pickWorkHandler = () => {
    setRole("business");
  }

  // Components
  const passwordLengthRequirement = passwordLengthCheck? (<li style={{color:"Green"}}>Password must be at least 12 characters long.</li>): (<li style={{color:"Red"}}>Password must be at least 12 characters long.</li>);
  const passwordNumberRequirement = passwordNumberCheck? (<li style={{color:"Green"}}>Password must contain at least 1 numerical character 0-9.</li>):(<li style={{color:"Red"}}>Password must contain at least 1 numerical character 0-9.</li>);
  const passwordSymbolRequirement = passwordSymbolCheck? (<li style={{color:"Green"}}>Password must contain at least 1 symbolic character ~!@#$%^&*-_+=.</li>):(<li style={{color:"Red"}}>Password must contain at least 1 symbolic character ~!@#$%^&*-_+=.</li>);
  
  useEffect(()=> {
  }, [confirmPassword,passwordMatch])
  //Page content
  // const pickRole = (
  //   <>
  //     pick role
  //     <button onClick={pickClientHandler}>Client</button>
  //     {/* <button onClick={pickBusinessHandler}>Business</button> */}
  //   </>
  // );
  // let client = {
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   password: "",
  //   preferredLanguage: "",
  //   purpose: "",
  //   organization: "",
  //   familySize: 0
  // }
  const client = (
    <>
      <h1>Client Signup</h1>
      <form>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input type="text" id="firstName" name="firstName" aria-required="true" onChange={firstNameInputHandler} required/>
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input type="text" id="lastName" name="lastName" aria-required="true" onChange={lastNameInputHandler} required/>
        </div>
        <div>
          <label htmlFor="email">Email Address:</label>
          <input type="email" id="email" name="email" aria-required="true" onChange={emailInputHandler} required/>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" aria-required="true" onChange={passwordInputHandler} required/>
          <p>Password Requirements:</p>
          <ul>
            {passwordLengthRequirement}
            {passwordNumberRequirement}
            {passwordSymbolRequirement}
          </ul>
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" name="confirmPassword" aria-required="true" onChange={confirmPasswordInputHandler} required/>
          {!passwordMatch && <p style={{ color: "red" }}>Passwords do not match.</p>}
        </div>
        <div>
          <label htmlFor="preferredLanguage">Preferred Language:</label>
          <select id="preferredLanguage" name="preferredLanguage" aria-required="true" onChange={preferredLanguageInputHandler} required>
            <option value="">Select a language</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="Chinese Traditional">Chinese Traditional</option>
            <option value="Japanese">Japanese</option>
            <option value="Punjabi">Punjabi</option>
            <option value="Tagalog">Tagalog</option>
            <option value="Korean">Korean</option>
            <option value="Vietnamese">Vietnamese</option>
            <option value="Chinese Simplified">Chinese Simplified</option>
          </select>
        </div>
        <div>
          <fieldset>
            <legend>What is your purpose coming to Vancouver?</legend>
            <div>
              <input type="radio" id="work" name="purpose" value="work" onSelect={pickWorkHandler}/>
              <label htmlFor="work">Work</label>
            </div>
            <div>
              <input type="radio" id="study" name="purpose" value="study" onSelect={pickStudyHandler}/>
              <label htmlFor="study">Study</label>
            </div>
          </fieldset>
        </div>
        {role ==="stduy"? 
          <div>
            <label htmlFor="institution">institution:</label>
            <input type="text" id="institution" name="institution" onChange={organizationInputHandler}/>
          </div>: 
          <div>
            <label htmlFor="organization">Organization:</label>
            <input type="text" id="organization" name="organization" onChange={organizationInputHandler} />
          </div>
        }
        <div>
          <label htmlFor="familySize">Family Size:</label>
          <input type="number" id="familySize" name="familySize" onChange={familySizeInputHandler} min="1" required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
  // let business = {
  //   name: "",
  //   business: "",
  //   businessInformation: "",
  //   promotions: [],
  //   location: "",
  //   contactPerson: "",
  //   telephoneNumber: ""
  // }
  // legal consultant
  // accountant
  // real estate
//   const business = (
//     <>
//   <h1>Business Signup</h1>
//   <form>
//     <div>
//       <label htmlFor="name">Business Name:</label>
//       <input type="text" id="name" name="name" aria-required="true" />
//     </div>
//     <div>
//       <label htmlFor="business">Type of Business:</label>
//       <input type="text" id="business" name="business" aria-required="true" />
//     </div>
//     <div>
//       <label htmlFor="businessInformation">Business Information:</label>
//       <textarea id="businessInformation" name="businessInformation" aria-required="true"></textarea>
//     </div>
//     <div>
//       <label htmlFor="promotions">Promotions:</label>
//       <select id="promotions" name="promotions" multiple aria-required="true">
//         <option value="discount">Discount</option>
//         <option value="coupon">Coupon</option>
//         <option value="sale">Sale</option>
//         {/* <!-- Add more options as needed --> */}
//       </select>
//     </div>
//     <div>
//       <label htmlFor="location">Location:</label>
//       <input type="text" id="location" name="location" aria-required="true" />
//     </div>
//     <div>
//       <label htmlFor="contactPerson">Contact Person:</label>
//       <input type="text" id="contactPerson" name="contactPerson" aria-required="true" />
//     </div>
//     <div>
//       <label htmlFor="telephoneNumber">Telephone Number:</label>
//       <input type="tel" id="telephoneNumber" name="telephoneNumber" aria-required="true" />
//     </div>
//     <button type="submit">Submit</button>
//   </form>
// </>

//   );

  // const display = () => {
  //   if (role == "") {
  //     return (
  //       <>
  //         pick role
  //         <button>Client</button>
  //         <button>Business</button>
  //         <button>Submit</button>
  //       </>
  //     )
  //   } else if (role == "client") {
  //     return (
  //       <>
  //         Client Signup
  //       </>
  //     )
  //   } else if (role == "business") {
  //     return (
  //       <>
  //         Business Signup
  //       </>
  //     )
  //   }
  // }
  return (
    <>
      {client}
    </>
  )
}

export default SignupPage;