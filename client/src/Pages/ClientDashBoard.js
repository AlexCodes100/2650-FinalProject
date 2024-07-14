import { useState, useEffect } from "react";

function ClientDashboard () {
  const [user, setUser] = useState({});
  const [defaultFetch, setDefaultFetch] = useState([{}]);
  const [interestedCompanies, setInterestedCompanies] = useState([{}]);
  const [posts, setPosts] = useState([{}])

  useEffect(() => {
    // fetch user data
    const result = {};
    setUser(result);
    // fetch recommanded companies
    const recommandedCompany = [{}];
    setDefaultFetch(recommandedCompany);
    // fetch followed companies
    const followedCompanies = [{}];
    setInterestedCompanies(followedCompanies);
    // forEach interestedCompanies, fetch their posts. Sort by date (newest to oldest)
    const companiesPosts = [{}];
    setPosts(companiesPosts)
  }, []);

  return (
    <>
      <h1>Hi {user.displayname}</h1>
      <section className="posts">
        {posts}
      </section>
      <section className="recommandedCompanies">
        {defaultFetch}
        {/* business name, logo, business type, brief description, link to business page */}
      </section>
      <section className="interestedCompanies">
        {interestedCompanies}
        {/* business name, logo */}
      </section>
    </>
  )
}

export default ClientDashboard;