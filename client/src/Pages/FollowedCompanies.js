import React from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';

function FollowedCompanies({ companies, onUnfollow, onFollow }) {
  return (
    <Card>
      <ListGroup variant="flush">
        {companies.map((company) => (
          <ListGroup.Item key={company.id}>
            {company.name}
            <Button 
              variant="danger" 
              onClick={() => onUnfollow(company.id)} 
              style={{ float: 'right' }}
            >
              Unfollow
            </Button>
            <Button 
              variant="primary" 
              onClick={() => onFollow(company.id)} 
              style={{ float: 'right' }}
            >
              Follow
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}

export default FollowedCompanies;