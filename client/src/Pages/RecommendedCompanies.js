import React from 'react';
import { Card, Button } from 'react-bootstrap';


function RecommendedCompanies({ companies }) {
  return (
    <div className="recommended-companies">
    {companies.length === 0 ? (
      <p>No recommended companies available.</p>
    ) : (
      companies.map((company) => (
        <Card key={company.id} className="mb-3">
          <Card.Body>
            <Card.Title>{company.businessName}</Card.Title>
            <Card.Text>{company.businessType}</Card.Text>
            <Button variant="primary" className="me-2">Follow</Button>
            <Button variant="secondary">Chat</Button>
          </Card.Body>
        </Card>
      ))
    )}
  </div>
);
}

export default RecommendedCompanies;