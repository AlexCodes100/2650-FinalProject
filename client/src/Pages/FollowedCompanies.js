import {useEffect, useState} from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';

function FollowedCompanies(props) {
  const [companies, setCompanies] = useState(props.companies[0]);

  useEffect(() => {
    // console.log('companies:', props.companies[0]);
  }, [companies]);
  return (
    <Card>
      <ListGroup variant="flush">
      {companies.map((company) => {
        // console.log(company)
        return (
          <ListGroup.Item key={company.businessId}>
            {company.businessName}
            <Button 
              variant="danger" 
              onClick={() => props.onUnfollow(company.businessId)} 
              style={{ float: 'right' }}
            >
              Unfollow
            </Button>
            <Button 
              variant="primary" 
              chatid={company.chatId}
              businessid={company.businessId}
              chatbusinessname={company.businessName}
              onClick={() => props.onChat({chatId: company.chatId, businessId: company.businessId, businessName: company.businessName})}
              style={{ float: 'right' }}
            > Chat </Button>
            {/* <Button 
              variant="primary" 
              onClick={() => props.onFollow(company.businessId)} 
              style={{ float: 'right' }}
            >
              Follow
            </Button> */}
          </ListGroup.Item>
        )})}
      </ListGroup>
    </Card>
  );
}

export default FollowedCompanies;