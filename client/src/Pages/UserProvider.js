import React, { useState, useEffect } from "react";
import UserContext from "./UserContext";

function UserProvider({ children }) {
  const [user, setUser] = useState({});
  const [recommendedCompanies, setRecommendedCompanies] = useState([]);
  const [followedCompanies, setFollowedCompanies] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // fetch user data
    const result = {};
    setUser(result);
//! fetch example for user 
    //! const fetchUserData = async () => {
    //!   const result = await fetch('/api/user');
    //!   const userData = await result.json();
    //!   setUser(userData);
    //! };
    // fetch recommended companies
    const recommendedCompanies = [];
    setRecommendedCompanies(recommendedCompanies);
    // fetch followed companies
    const followedCompanies = [];
    setFollowedCompanies(followedCompanies);
    // forEach followedCompanies, fetch their posts. Sort by date (newest to oldest)
    const companiesPosts = [];
    setPosts(companiesPosts);

    //! fetchUserData();

  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        recommendedCompanies,
        followedCompanies,
        posts,
        setUser,
        setRecommendedCompanies,
        setFollowedCompanies,
        setPosts,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;