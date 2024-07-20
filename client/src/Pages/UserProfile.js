import React from "react";
import { Card, Container, Row, Col } from 'react-bootstrap';

function UserProfile({ user }) {
  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>{user.displayName}</Card.Title>
              <Card.Text>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UserProfile;