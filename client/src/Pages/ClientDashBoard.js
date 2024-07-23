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
    lastName: "Paudanaud",
    followedCompanies: [1, 4, 6],
  });
  const followedCompanies = user.followedCompanies;
  // const { user, followedCompanies } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [recommendedBusinesses, setRecommendedBusinesses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      //fetch recommended companies
      try {
        // check the followed companies and find 3 that is not followed
        let result = await axios.post(
          `http://localhost:4000/clientdashboard/`,
          {
            followedCompanies: followedCompanies,
          }
        );
        if (result.data[0].result === "successful") {
          console.log(result.data[0].message);
          setRecommendedBusinesses(result.data);
        } else {
          console.log(result.data[0].message);
        }
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
      }
      // fetch followed companies' posts
      try {
        const response = await axios.get(
          `http://localhost:4000/clientdashboard/${user.id}`
        );
        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching followed posts:", err);
        setPosts("Failed to fetch posts. Please try again later.");
      }
    };
    fetchData();
  }, []);

  return (
    <Container className="client-dashboard mt-4">
    <Row>
      <Col md={8}>
        <Posts posts={posts} />
      </Col>
      <Col md={4}>
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Followed Companies</Card.Title>
            <FollowedCompanies companies={followedCompanies} />
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Recommended Companies</Card.Title>
            <RecommendedCompanies companies={recommendedBusinesses} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
  );
}

export default ClientDashboard;
