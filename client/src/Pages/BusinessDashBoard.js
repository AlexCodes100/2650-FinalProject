import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import Posts from "./Posts";
// import io from 'socket.io-client';
import Chat from "../Components/Chat";
// import "dotenv/config.js";

function BusinessDashBoard () {
  // Business info
  const [business, setBusiness] = useState({
    id: '1',
    businessName: 'canada Immigration',
    businessType: 'immigration',
    businessLocation: 'Vancouver',
    information: 'we help with student visa and PR',
    contactPerson: 'Mr Jean',
    telephoneNumber: '234-443-4543',
    email: 'Immigration@gmail'
  });
  const [updatedBusiness, setUpdatedBusiness] = useState({});
  // Chat feature
  const [chatrequests, setChatRequests] = useState([{}]);
  const [chatMessages, setChatMessages] = useState([{ // Fake chat messages
    id: 1,
    clientId: 1,
    customerName: 'John Doe',
    message: ['I need help with my visa application.', 'Can you assist me with that?']
  }]);
  const [showChatModal, setShowChatModal] = useState(false)
  const [chatRoomId, setChatRoomId] = useState(-1);
  // Posts
  const [posts, setPosts] = useState([{}]);
  // creating new post
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [creatingNewPost, setCreatingNewPost] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // Error handling
  const [error, setError] = useState(false);

  

  useEffect(() => {
    // fetch business data
    const data = JSON.parse(localStorage.getItem('ImmivanRole'));
    if (data) {
      setBusiness(data);
      setUpdatedBusiness(data);
    } else {
      setUpdatedBusiness(business)
    }

    // fetch chat
    let chats = [{}];
    (async () => {
      chats = await axios.post(`http://localhost:4000/chats/:id`, {role: business.role});
      setChatRequests(chats);
    })();
    
    // business post
    let companiesPosts = [{}];
    (async () => {
      try {
        companiesPosts = await axios.get(`http://localhost:3000/posts/${business.id}`);
        setPosts(companiesPosts.data);
      } catch (err) {
        setError('An error occurred while fetching posts');
        console.error('Error fetching posts:', err);
      }
    })();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      const response = await axios.post('http://localhost:3000/posts/', {
        businessId: business.id,
        title: newPostTitle,
        content: newPostContent
      });
      setNewPostTitle('');
      setNewPostContent('');
      setCreatingNewPost(false);
      window.location.reload()
    } catch (error) {
      console.error('Error creating post:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setUpdatedBusiness((prevData) =>({
      ...prevData,
      [name]: value
    }));
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const submitUpdatedBusinessInfoHandler = async (e) => {
    e.preventDefault();
    // Handle the update business info logic here (e.g., send a request to the server)
    let updatedInfo = {};
    updatedInfo.businessName = updatedBusiness.businessName;
    updatedInfo.businessType = updatedBusiness.businessType;
    updatedInfo.businessLocation = updatedBusiness.businessLocation;
    updatedInfo.information = updatedBusiness.information;
    updatedInfo.contactPerson = updatedBusiness.contactPerson;
    updatedInfo.telephoneNumber = updatedBusiness.telephoneNumber;
    updatedInfo.email = updatedBusiness.email;

    try {
      console.log(business.id)
      let result = await axios.put(`http://localhost:3000/businessdashboard/${business.id}`, {updatedInfo});
      console.log(result)
      if (result.data[0].result === "successful") {
        console.log(result.data[0].message)
        setShowModal(false)
      } else {
        setError(true);
        console.log(result.data[0].message)
      }
      
    } catch (err) {
      console.log("Error occured during updating business info: ", err)
    }
    
  };

  // Chats
  const handleOpenChatModal = (e) => {
    setChatRoomId(e.target.getAttribute('chatId'));
    setShowChatModal(true)
  };
  const handleCloseChatModal = () => setShowChatModal(false);


  return (
    <Container className="business-dashboard mt-4">
      <div>
      <Button variant="primary" onClick={handleOpenModal}>
        Update Profile
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="businessName">
              <Form.Label>Business Name</Form.Label>
              <Form.Control
                type="text"
                name="businessName"
                value={updatedBusiness.businessName}
                onChange={inputChangeHandler}
              />
            </Form.Group>
            <Form.Group controlId="businessType">
              <Form.Label>Business Type</Form.Label>
              <Form.Control
                type="text"
                name="businessType"
                value={updatedBusiness.businessType}
                onChange={inputChangeHandler}
              />
            </Form.Group>
            <Form.Group controlId="businessLocation">
              <Form.Label>Business Location</Form.Label>
              <Form.Control
                type="text"
                name="businessLocation"
                value={updatedBusiness.businessLocation}
                onChange={inputChangeHandler}
              />
            </Form.Group>
            <Form.Group controlId="information">
              <Form.Label>Information</Form.Label>
              <Form.Control
                type="text"
                name="information"
                value={updatedBusiness.information}
                onChange={inputChangeHandler}
              />
            </Form.Group>
            <Form.Group controlId="contactPerson">
              <Form.Label>Contact Person</Form.Label>
              <Form.Control
                type="text"
                name="contactPerson"
                value={updatedBusiness.contactPerson}
                onChange={inputChangeHandler}
              />
            </Form.Group>
            <Form.Group controlId="telephoneNumber">
              <Form.Label>Telephone Number</Form.Label>
              <Form.Control
                type="text"
                name="telephoneNumber"
                value={updatedBusiness.telephoneNumber}
                onChange={inputChangeHandler}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={updatedBusiness.email}
                onChange={inputChangeHandler}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={submitUpdatedBusinessInfoHandler}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      </div>

      <Card style={{ fontWeight: 'bold', backgroundColor: 'rgba(255, 228, 225, 0.5)', border: 'none', padding: '20px' }}>
        <section className="text-center my-5">
          <Card.Title><h1>Hello {business.businessName}</h1></Card.Title>
        </section>
      </Card>

      <Row>
        <Col md={8}>
          <Posts posts={posts} business= {business}/>
        </Col>
        <Col md={4}>
          <Card className="mb-4 mt-5">
            <Card.Body>
              <Card.Title>Create a Post</Card.Title>
              <Form onSubmit={handleCreatePost}>
                <Form.Group controlId="newPostTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="newPostContent">
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Create Post
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <Card>
          <Card.Body>
          <Card.Title>Pending Chats</Card.Title>
              {chatMessages.map((chat) => {
                let newMessage = chat.message[chat.message.length-1];
                // console.log(chat)
                return (
                <Card key={chat.id} className="mb-3">
                  <Card.Body>
                    <Card.Text><strong>{chat.customerName}</strong></Card.Text>
                    <Card.Text>{newMessage}</Card.Text>
                    <Button 
                    variant="primary" 
                    chatId={chat.id} 
                    chatClientId={chat.clientId}
                    chatClientName={chat.cilentName}
                    chatMessages={chat.message}
                    onClick={handleOpenChatModal}>Chat</Button> {/* Button to open chat modal */}
                  </Card.Body>
                </Card>
              )})}
            </Card.Body>
          </Card>
          {showChatModal? 
          <Chat 
          chatId={chatRoomId}
          showChatModal={showChatModal}
          handleCloseChatModal={handleCloseChatModal} />: null}
        </Col>
      </Row>
    </Container>
    
  )
}

export default BusinessDashBoard;