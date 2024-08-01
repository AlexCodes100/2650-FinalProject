import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import './SignupPage.css';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import NavBar from "../Components/NavBar";

function SignupPage() {
  const navigate = useNavigate();
  const [registrationError, setRegistrationError] = useState("");

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      preferredLanguage: "",
      purpose: "",
      organization: "",
      familySize: 0,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string()
        .min(5, "Password must be at least 5 characters long")
        .matches(/[0-9]/, "Password must contain at least 1 numerical character")
        .matches(/^[!@#$%^&*\-_=+]/, "Password must contain at least 1 symbolic character")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], "Passwords must match")
        .required("Confirm Password is required"),
      preferredLanguage: Yup.string().required("Preferred Language is required"),
      purpose: Yup.string().required("Purpose is required"),
      organization: Yup.string(),
      familySize: Yup.number().min(1, "Family Size must be at least 1").required("Family Size is required"),
    }),
    onSubmit: async (values) => {
      try {
        setRegistrationError(""); // Clear previous errors
        await axios.post("http://localhost:3000/register", values);
        alert("Registration successful");
        navigate("/loginSelection"); // Redirect to login page
      } catch (error) {
        setRegistrationError(error.response ? error.response.data.message : "Registration failed: Unable to connect to the server.");
      }
    },
  });

  return (
    <>
      <NavBar />
      <div className="signup-container">
      <h1>Client Signup</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            aria-required="true"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
          />
          {formik.touched.firstName && formik.errors.firstName ? <div className="error-message">{formik.errors.firstName}</div> : null}
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            aria-required="true"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
          />
          {formik.touched.lastName && formik.errors.lastName ? <div className="error-message">{formik.errors.lastName}</div> : null}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            aria-required="true"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? <div className="error-message">{formik.errors.email}</div> : null}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            aria-required="true"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? <div className="error-message">{formik.errors.password}</div> : null}
          <ul className="password-requirements">
            <li className={formik.values.password.length >= 5 ? 'valid' : 'invalid'}>Password must be at least 5 characters long.</li>
            <li className={/[0-9]/.test(formik.values.password) ? 'valid' : 'invalid'}>Password must contain at least 1 numerical character.</li>
            <li className={/^[!@#$%^&*\-_=+]/.test(formik.values.password) ? 'valid' : 'invalid'}>Password must contain at least 1 symbolic character.</li>
          </ul>
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            aria-required="true"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className="error-message">{formik.errors.confirmPassword}</div> : null}
        </div>
        <div className="form-group">
          <label htmlFor="preferredLanguage">Preferred Language:</label>
          <select
            id="preferredLanguage"
            name="preferredLanguage"
            aria-required="true"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.preferredLanguage}
          >
            <option value="">Select a language</option>
            <option value="English">English</option>
            <option value="french">French</option>
            <option value="Spanish">Spanish</option>
            <option value="Chinese Traditional">Chinese Traditional</option>
            <option value="Japanese">Japanese</option>
            <option value="Punjabi">Punjabi</option>
            <option value="Tagalog">Tagalog</option>
            <option value="Korean">Korean</option>
            <option value="Vietnamese">Vietnamese</option>
            <option value="Chinese Simplified">Chinese Simplified</option>
          </select>
          {formik.touched.preferredLanguage && formik.errors.preferredLanguage ? <div className="error-message">{formik.errors.preferredLanguage}</div> : null}
        </div>
        <div className="form-group">
          <fieldset>
            <legend>What is your purpose coming to Vancouver?</legend>
            <div>
              <input
                type="radio"
                id="work"
                name="purpose"
                value="work"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.purpose === "work"}
              />
              <label htmlFor="work">Work</label>
            </div>
            <div>
              <input
                type="radio"
                id="study"
                name="purpose"
                value="study"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.purpose === "study"}
              />
              <label htmlFor="study">Study</label>
            </div>
          </fieldset>
          {formik.touched.purpose && formik.errors.purpose ? <div className="error-message">{formik.errors.purpose}</div> : null}
        </div>
        <div className="form-group">
          <label htmlFor="organization">Organization:</label>
          <input
            type="text"
            id="organization"
            name="organization"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.organization}
          />
        </div>
        <div className="form-group">
          <label htmlFor="familySize">Family Size:</label>
          <input
            type="number"
            id="familySize"
            name="familySize"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.familySize}
            min="1"
            required
          />
          {formik.touched.familySize && formik.errors.familySize ? <div className="error-message">{formik.errors.familySize}</div> : null}
        </div>
        {registrationError && <div className="error-message">{registrationError}</div>}
        <button type="submit">Submit</button>
      </form>
    </div>

    </>
    
  );
}

export default SignupPage;
