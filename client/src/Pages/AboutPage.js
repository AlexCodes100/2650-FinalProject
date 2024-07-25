import React from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';

function AboutPage() {
  return (
    <Container className="my-4">
      <Card style={{ backgroundColor: 'rgba(255, 228, 225, 0.5)', border: 'none', padding: '20px' }}>
        <section className="text-center my-5">
          <h1>About</h1>
        </section>
      </Card>

      <Row className="my-4">
        <Col md={12} className="mb-4">
          <Card style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
            <Card.Title as="h3" className="text-center">What This Website is For</Card.Title>
            <Card.Body>
              <p>
              This website will be particularly for immigrant that would like to immigrate to Vancouver without any headache,  the website will make your process easier.
              We have created a safe place for people to talk about what newcomer in Vancouver want to know and what they need. 
              We will have companies that are here to help you to make your life easier, those companies will be well selected. They are passionate by the project because they either want to help or they themselves immigrant and knows how difficult immigrate to a new country it is. 
              Those companies will be selected to help you and not for us to make profit, those companies will be like accountant because we know that doing taxes in another country can be challenging , immigration consultant that might be able to help you in your native language , also real estate company to help you to find a place without being scam and many more that will help your to start your new life in Vancouver. 

              </p>
            </Card.Body>
          </Card>
        </Col>
        </Row>
        <Row className="my-4 d-flex justify-content-center"> {/* Centering row */}
        <Col md={12} lg={4} className="mb-4 d-flex justify-content-center">
          <Card style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
            <Card.Title as="h3" className="text-center">Who We Are</Card.Title>
            <Card.Body>
              <p>We are three friends that came to Canada to get more opportunities and challenge ourselves. After going through a heavy administration process and divers information that cost a lot of money and stress all that in a different language . We came to this idea that we would like to help new immigrant to enjoy the beauty of this city without all the trouble. Because we know what you are going through.</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12} lg={4} className="mb-4 d-flex justify-content-center">
          <Card style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
            <Card.Title as="h3" className="text-center">Why You Should Choose Us</Card.Title>
            <Card.Body>
              <p>Simply because we know what you are going through. We know that people can find a lot of information online it is not always reliable, and it takes a lot of time to find the right one. 
                 We have put it everything in one place for you, to make your life easier. We select companies that really want to help, and we select them because we know that they will make your life easier because we have been there. 
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutPage;