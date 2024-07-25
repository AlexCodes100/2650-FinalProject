import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function LandingPage() {
  return (
    
      <Container>
        
        <Card style={{ fontWeight: 'bold',backgroundColor: 'rgba(255, 228, 225, 0.5)', border: 'none', padding: '20px' }}>
        {/* <Card style={{ fontWeight: 'bold',backgroundColor: '#FFE4C4', border: 'none', padding: '20px' }}> */}
          <section className="text-center my-5">
            <h3>Our Purpose</h3>
            <ul className="list-unstyled">
              <li>Create a platform and community aiming to help new arrivals in Vancouver</li>
              <li>Provide information and starter kit for new arrivals at the airport</li>
              <li>Connect local business with the uprising immigrant community</li>
            </ul>
          </section>
        </Card>


        <section className="my-5">
        <h3 style={{ fontWeight: 'bold', color: '#ccc' }}>Immi Surviving Kit</h3>
        <Row className="mx-0">
            <Col md={8}>
              <Row className="my-4">
                <Col md={12}>
                <Card className="mb-4" style={{ backgroundColor: '#ffe4e1' }}>
                <Card.Body>
                      <Card.Title>Premium Surviving Kit:</Card.Title>
                      <Card.Text>For who:</Card.Text>
                      <ul>
                        <li>for $50 you will get all the tolls to succeed in Vancouver in one box. </li>
                        <li>It is like coming to Vancouver with a native Vancouverite, this box will avoid you all the headache.  </li> 
                      </ul>
                      <Button variant="secondary"  className="mt-3 mx-auto d-block"> More Details</Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={12}>
                  <Card className="mb-4" style={{ backgroundColor: '#ffe4e1' }}>
                    <Card.Body>
                      <Card.Title>Basic Surviving Kit:</Card.Title>
                      <Card.Text>for who:</Card.Text>
                      <ul>
                        <li>for $25 you will get all the tolls to start in Vancouver in one box. </li>
                        <li>It is like having a friend helping you to start in Vancouver, this box will help you to start easily.  </li> 
                      </ul>
                      <Button variant="secondary"  className="mt-3 mx-auto d-block"> More Details</Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col md={4}>
              <Card style={{ width: '100%', height: '100%' }}>
                <Card.Img variant="top" src="photos/landing-about.jpg"/>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="text-center">About</Card.Title>
                    <Card.Text>
                     We are three friends that came to Canada to get more opportunities and challenge ourself.
                     After going through an heavy administration process and divers information that cost a lot of money and stress all that in a different language . 
                     We came to this idea that we would like to help new immigrant to enjoy the beauty of this city without all the trouble. 
                     Because we know what you are going through. 
                    </Card.Text>
                  </div>
                  <Link to="/about" style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" className="mt-3 mx-auto d-block">More details</Button>
                </Link>               
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      </Container>
   
  );
}

export default LandingPage;




