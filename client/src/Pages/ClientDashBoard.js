import React, {useContext} from "react";
import UserContext from "./UserContext";
import UserProfile from "./UserProfile";
import RecommendedCompanies from "./RecommendedCompanies";
import FollowedCompanies from "./FollowedCompanies";
import Posts from "./Posts";


  function ClientDashboard() {
    const { user, recommendedCompanies, followedCompanies, posts } = useContext(UserContext);
 

  return (

    <div className="client-dashboard">
      <UserProfile user={user} />
      <RecommendedCompanies companies={recommendedCompanies} />
      <FollowedCompanies companies={followedCompanies} />
      <Posts posts={posts} />
    </div>
  );
}

export default ClientDashboard;