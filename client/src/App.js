import './App.css';
import { useState } from 'react';
import {createBrowserRouter, Outlet, RouterProvider, Route, createRoutesFromElements} from "react-router-dom";
import LandingPage from './Pages/LandingPage.js';
import AboutPage from './Pages/AboutPage.js';
import SignupSelectionPage from './Pages/SignUpSelectionPage.js';
import SignupPage from './Pages/SignupPage.js'
import LoginSelectionPage from "./Pages/LoginSelectionPage.js"
import LoginPage from './Pages/LoginPage.js';
import ErrorPage from "./Pages/ErrorPage";
import NavBar from './Components/NavBar.js';
import Footer from './Components/Footer.js';

const router = createBrowserRouter(
  createRoutesFromElements (
    <>
    {/* Page without NavBar*/}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/loginSelection" element={<LoginSelectionPage />} />
      <Route path="/signupSelection" element={<SignupSelectionPage />} />
      <Route element={
        <div>
          <NavBar />
          <Outlet />
          <Footer />
        </div>
        }>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/errorPage" element={<ErrorPage />} />
      </Route>
      </>
  )
)
function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
