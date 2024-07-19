import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard () {
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('ImmivanRole'));
    if (data.role) {
      switch (data.role) {
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