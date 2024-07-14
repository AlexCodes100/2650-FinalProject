import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard () {
  const navigate = useNavigate();

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem('ImmivanRole'));
    if (role) {
      switch (role) {
        case "client":
          navigate("/clientDashboard");
          break;
        case "business":
          navigate("/businessDashboard");
          break;
        default:
          navigate("/errorPage");
          break;
      }
    } else {
      navigate("/errorPage");
    }
}, [])

return (
  <>
  </>
)
}

export default Dashboard;