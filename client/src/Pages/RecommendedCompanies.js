import React from 'react';
import { Card, Button } from 'react-bootstrap';


function RecommendedCompanies({ companies,onFollow, onChat }) {
  return (
    <div className="recommended-companies">
    {companies.length === 0 ? (
      <p>No recommended companies available.</p>
    ) : (
      companies.map((company) => (
        <Card key={company.id} className="mb-3" style={{ width: '100%' }}>
          <Card.Body>
            <Card.Title>{company.businessName}</Card.Title>
            <Card.Text>{company.businessType}</Card.Text>
            <Button variant="primary" onClick={() => onFollow(company.id)}>Follow</Button>
            <Button variant="secondary" className="ml-2" onClick={() => onChat(company.id)}>Chat</Button>
          </Card.Body>
        </Card>
      ))
    )}
  </div>
);
}

export default RecommendedCompanies;