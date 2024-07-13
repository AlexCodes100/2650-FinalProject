import { SocialIcon } from 'react-social-icons';
import { Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <Row className='justify-content-center pb-2'>
      <Col xs='auto'>
          <SocialIcon url="https://react-social-icons.com" network="discord" />
          <SocialIcon url="https://linkedin.com/in/couetilc" />
          <SocialIcon url="https://react-social-icons.com" network="x" />
          <SocialIcon url="https://react-social-icons.com" network="wechat" />
          <SocialIcon url="https://react-social-icons.com" network="tiktok" />
          <SocialIcon url="https://react-social-icons.com" network="facebook" />

      </Col>
    </Row>
  );
}

export default Footer;