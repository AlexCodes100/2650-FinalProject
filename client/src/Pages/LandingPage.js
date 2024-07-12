// import { useState, useEffect } from "react";

function LandingPage () {
  return(
    <>
      <section>
        <h3>
          Our purpose
        </h3>
        <ul>
          <li>Create a platform and community aiming to help new arrivals in Vancouver</li>
          <li>Provide information and starter kit for new arrivals at the airport</li>
          <li>Connect local business with the up rising immigrate community</li>
        </ul>
      </section>
      <section>
        <h3>Immi Surviving Kit</h3>
        <div className="Premium Surviving Kit">
          <div className="Premium Surviving Kit Description">
            <h5>Premium</h5>
            <p>Includes:</p>
            <ul>
              <li>Compress Card</li>
              <li>5 Free Subscription in ImmiVan</li>
              {/* Add more items */}
            </ul>
          </div>
          <div className="Premium Surviving Kit Image"></div>
        </div>
        <div className="Basic Surviving Kit">
          <div className="Basic Surviving Kit Description">
            <h5>Basic</h5>
            <ul>
              <li>Compress Card</li>
              {/* Add more items */}
            </ul>
          </div>
          <div className="Basic Surviving Kit Image"></div>
        </div>
      </section>
    </>
  )
}

export default LandingPage;