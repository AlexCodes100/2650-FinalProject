import React, { useContext, useEffect, useState } from "react";
// import UserContext from "./UserContext";
import UserProfile from "./UserProfile";
import RecommendedCompanies from "./RecommendedCompanies";
import FollowedCompanies from "./FollowedCompanies";
import Posts from "./Posts";
import axios from "axios";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function ClientDashboard() {
  const [user, setUser] = useState({
    id: 1,
    firstName: "Xavier",
    lastName: "P",
    followedCompanies: [1, 4, 6],
  });
  const followedCompanies = user.followedCompanies;
  // const { user, followedCompanies } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [recommendedBusinesses, setRecommendedBusinesses] = useState([]);

  // Fake posts data
  const fakePosts = [
    {
      id: 1,
      title: "New Product Launch",
      business_name: "TechCorp",
      content: "We're excited to announce our latest innovation! Stay tuned for more details.",
      created_at: "2024-07-15T10:00:00Z"
    },
    {
      id: 2,
      title: "Summer Sale",
      business_name: "FashionHub",
      content: "Get up to 50% off on all summer collections. Limited time offer!",
      created_at: "2024-07-16T14:30:00Z"
    },
    {
      id: 3,
      title: "Job Openings",
      business_name: "GlobalSolutions",
      content: "We're hiring! Check out our careers page for exciting opportunities.",
      created_at: "2024-07-17T09:15:00Z"
    },
    {
      id: 4,
      title: "Community Event",
      business_name: "LocalCafe",
      content: "Join us this weekend for our annual charity bake sale. All proceeds go to local charities.",
      created_at: "2024-07-18T11:45:00Z"
    },
    {
      id: 5,
      title: "Tech Workshop",
      business_name: "CodeAcademy",
      content: "Free coding workshop this Saturday. Learn the basics of web development!",
      created_at: "2024-07-19T13:00:00Z"
    }
  ];

  // useEffect(() => {
  //   const fetchData = async () => {
  //     //fetch recommended companies
  //     try {
  //       // check the followed companies and find 3 that is not followed
  //       let result = await axios.post(
  //         `http://localhost:4000/clientdashboard/`,
  //         {
  //           followedCompanies: followedCompanies,
  //         }
  //       );
  //       if (result.data[0].result === "successful") {
  //         console.log(result.data[0].message);
  //         setRecommendedBusinesses(result.data);
  //       } else {
  //         console.log(result.data[0].message);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch businesses:", error);
  //     }
      useEffect(() => {
        // Simulating API calls
        setRecommendedBusinesses([
          { id: 7, businessName: "TechStart", businessType: "Technology" },
          { id: 8, businessName: "GreenEnergy", businessType: "Renewable Energy" },
          { id: 9, businessName: "HealthPlus", businessType: "Healthcare" },
        ]);
        setPosts(fakePosts);
  }, []);
      //! this part as been commented to test the fake post 
      // fetch followed companies' posts
      // try {
      //   const response = await axios.get(
      //     `http://localhost:4000/clientdashboard/${user.id}`
      //   );
      //   setPosts(response.data);
      // } catch (err) {
      //   console.error("Error fetching followed posts:", err);
      //   setPosts("Failed to fetch posts. Please try again later.");
      // }
  //     setPosts(fakePosts);
  //   };
  //   fetchData();
  // }, []);

  const handleFollow = (companyId) => {
    console.log("Follow company with ID:", companyId);
    // Add logic to handle follow action
  };

  const handleChat = (companyId) => {
    console.log("Chat with company with ID:", companyId);
    // Add logic to handle chat action
  };

  const handleUnfollow = (companyId) => {
    console.log("Unfollow company with ID:", companyId);
    // Add logic to handle unfollow action, such as updating state
    setUser((prevUser) => ({
      ...prevUser,
      followedCompanies: prevUser.followedCompanies.filter(id => id !== companyId),
    }));
  };
  return (
    <Container className="client-dashboard mt-4">

<Card style={{ fontWeight: 'bold',backgroundColor: 'rgba(255, 228, 225, 0.5)', border: 'none', padding: '20px' }}>
        {/* <Card style={{ fontWeight: 'bold',backgroundColor: '#FFE4C4', border: 'none', padding: '20px' }}> */}
          <section className="text-center my-5">
          <Card.Title> <h1>Hello {user.firstName}</h1></Card.Title>
          </section>
        </Card>
    <Row>
      <Col md={8}>
        <Posts posts={posts} />
      </Col>
      <Col md={4}>
        <Card className="mb-4 mt-5">
          <Card.Body>
            <Card.Title>Followed Companies</Card.Title>
            <FollowedCompanies companies={followedCompanies} onUnfollow={handleUnfollow}/>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Recommended Companies</Card.Title>
            <RecommendedCompanies 
              companies={recommendedBusinesses}
              onFollow={handleFollow}
              onChat={handleChat} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
  );
}

export default ClientDashboard;
