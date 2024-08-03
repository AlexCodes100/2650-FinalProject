import './App.css';
import {createBrowserRouter, Outlet, RouterProvider, Route, createRoutesFromElements} from "react-router-dom";
import LandingPage from './Pages/LandingPage.js';
import AboutPage from './Pages/AboutPage.js';
import SignupSelectionPage from './Pages/SignUpSelectionPage.js';
import SignupPage from './Pages/SignupPage.js'
import LoginSelectionPage from "./Pages/LoginSelectionPage.js"
import LoginPage from './Pages/LoginPage.js';
import Dashboard from './Pages/Dashboard.js';
import ClientDashboard from './Pages/ClientDashBoard.js';
import BusinessDashboard from './Pages/BusinessDashBoard.js';
import ErrorPage from "./Pages/ErrorPage";
import NavBar from './Components/NavBar.js';
import Footer from './Components/Footer.js';
import GoogleLoginSuccess from './Pages/GoogleLoginSuccess.js';



const router = createBrowserRouter(
  createRoutesFromElements (
    <>
    {/* Page without NavBar*/}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/loginSelection" element={<LoginSelectionPage />} />
      <Route path="/signupSelection" element={<SignupSelectionPage />} />
      <Route path="/googleLoginSuccess" element={<GoogleLoginSuccess />} />
      <Route path="/dashboard" element={<Dashboard />} />
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
        <Route path="/clientDashboard" element={<ClientDashboard />} />
        <Route path="/businessDashboard" element={<BusinessDashboard />} />
      </Route>
      </>
  )
)
function App() {
  return (
    <div style={{ backgroundImage: `url('photos/landing-background.jpg')`, backgroundSize: 'cover', minHeight: '100vh' }}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
