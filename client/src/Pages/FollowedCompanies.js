import React from 'react';
import { Card, Button } from 'react-bootstrap';


function FollowedCompanies({ companies, onUnfollow }) {
  return (
    <div className="followed-companies">
    {companies.length === 0 ? (
      <p>No followed companies yet.</p>
    ) : (
      companies.map((companyId) => (
        <Card key={companyId} className="mb-3">
          <Card.Body>
            <Card.Title>Company ID: {companyId}</Card.Title>
            <Button variant="danger" onClick={() => onUnfollow(companyId)}>Unfollow</Button>
          </Card.Body>
        </Card>
      ))
    )}
  </div>
);
}

export default FollowedCompanies;