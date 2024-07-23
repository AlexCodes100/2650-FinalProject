import React from 'react';
import { Card, Button } from 'react-bootstrap';


function FollowedCompanies({ companies }) {
  return (
    <div className="followed-companies">
    {companies.length === 0 ? (
      <p>No followed companies yet.</p>
    ) : (
      companies.map((companyId) => (
        <Card key={companyId} className="mb-3">
          <Card.Body>
            <Card.Title>Company ID: {companyId}</Card.Title>
          </Card.Body>
        </Card>
      ))
    )}
  </div>
);
}

export default FollowedCompanies;