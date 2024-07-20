import React from "react";

const UserContext = React.createContext({
  user: {},
  recommendedCompanies: [],
  followedCompanies: [],
  posts: [],
  setUser: () => {},
  setRecommendedCompanies: () => {},
  setFollowedCompanies: () => {},
  setPosts: () => {},
});

export default UserContext;