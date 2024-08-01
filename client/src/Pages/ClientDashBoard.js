import React, { useContext, useEffect, useState } from "react";
// components
import RecommendedCompanies from "./RecommendedCompanies";
import FollowedCompanies from "./FollowedCompanies";
import Posts from "./Posts";
import UserProfile from "./UserProfile";
// chat component
import Chat from "../Components/Chat";
import io from 'socket.io-client';
import axios from "axios";
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function ClientDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState({
    // delete soon once we have the user data from login
    id: '1',
    firstName: 'xavier',
    lastName: 'P',
    email: 'x.p@gmail.com',
    orgainzation: 'Company XYZ',
    familySize: 3,
    preferredLanguage: 'French',
    role: 'student',
    followedCompanies: [
      { id: 1, name: "TechCorp" },
      { id: 2, name: "FashionHub" },
      { id: 3, name: "GlobalSolutions" }
    ]
  });
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [followedbusiness, setFollowedbusiness] = useState([]);
  const [posts, setPosts] = useState([]);
  const [recommendedBusinesses, setRecommendedBusinesses] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatRoomId, setChatRoomId] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [chatRoomBusiness, setChatRoomBusiness] = useState('');
  

  const fetchFollowedCompanies = async () => {
      try {
        // fetch all followed companies
        await axios.get(`http://localhost:3000/clientdashboard/${user.id}`)
        .then((res) => {
          console.log("res from fetch followed companies", res.data);
          let followedbusiness = res.data[0];
          // based on the response, fetch the chats
          if (res.data[0] === "No followed businesses") {
            console.log(res.data[0]);
            return;
          }
          // console.log(res.data[0])
          let newSocket = io.connect('http://localhost:3000');
          (async () => {
            try {
              // fetching messages in each chat
              let chats = await axios.post(`http://localhost:3000/chats/${user.id}`, {role: "client"});
              console.log(chats.data);
              setChatMessages(chats.data);
              chats.data.forEach((chat) => {
                newSocket.emit('join', { businessId: chat.businessId, clientId: user.id });
              });
              let merge = [];
              console.log(res.data[0]);
              res.data[0].forEach((business) => {
                let targetChat = chats.data.find((chat) => business.businessId === chat.businessId);
                console.log(targetChat)
                business.chatId = targetChat.id;
                
                console.log(business)
                merge.push(business);
                return business;
              });
              console.log(merge);
              setFollowedbusiness(merge)
            } catch (error) {
              console.error("Failed to fetch chats:", error);
            }
          })();
          return followedbusiness;
        })
        .then((res) => {
          // fetch followed companies' posts
          fetchFollowedCompaniesPosts(res)
          return res;
        })
        .then((res) => {
          // console.log(res);
          // fetch recommended companies
          fetchRecommendedCompanies(res)
        });
        // if (result.data[0] !== "No followed businesses") {
        //   console.log(result.data[0]);
        //   setFollowedbusiness(result.data[0]);
        // } else {
        //   console.log(result.data[0]);
        //   setFollowedbusiness([]);
        //     return [];
        // }
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
      }
    };

  const fetchFollowedCompaniesPosts = async (followedbusinesses) => {
    // console.log(followedbusinesses);
    try {
      let request = followedbusinesses.map((business) => {
        // console.log(business.businessId);
        return business.businessId
      });
      // console.log(request);
      let result = await axios.post(`http://localhost:3000/clientdashboard/`,{action:"fetch posts",followedbusiness: request});
      setPosts(result.data);
    }
    catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const fetchRecommendedCompanies = async (followedBusinesses) => {
    try {
      let request = followedBusinesses.map((business) => {
        // console.log(business.businessId);
        return business.businessId
      });
      // console.log(request);
      const result = await axios.post(`http://localhost:3000/clientdashboard/`, {action:"fetch recommended businesses",followedbusiness: request});
      if (result.data[0] !== "No recommended businesses") {
        // console.log(result.data);
        setRecommendedBusinesses(result.data);
      } else {
        console.log(result.data);
        setRecommendedBusinesses([]);
      }
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
    }
  }

  useEffect(() => {
    // fetch followed companies
    fetchFollowedCompanies();

    const newSocket = io.connect('http://localhost:3000');
    let chats =[{}];
    newSocket.on('chat message', async (msg) => {
      chats = await axios.post(`http://localhost:3000/chats/${user.id}`, {role: "client"});
      setChatMessages(chats.data);
      if (msg.senderRole === "business") {
        console.log("Received message from business:", msg);
      }else {
        // make the css notice the new message
        
      }
    })
  }, []);

  const handleFollow = async (companyId) => {
    console.log("Follow company with ID:", companyId);
    await axios.post(`http://localhost:3000/clientdashboard/${user.id}`, {action: "follow business", businessId: companyId})
    .then((res) => {
      if (res.data.result === "success") {
        console.log(res.data.message);
        // window.location.reload();
      }
    })
    .then(async () => {
      // fetch id chat exists
      await axios.post(`http://localhost:3000/chats/`, {businessId: companyId, clientId: user.id})
      .then(async (res) => { 
        console.log("fetched chat result from following a business ", res.data);
        if (res.data.message === "No chatId found") {
          // make new chat room in database
          await axios.post(`http://localhost:3000/chats/`, {action: "create new chat" ,businessId: companyId, clientId: user.id})
        }
      })
    });
    window.location.reload();
  }

  const handleOpenChatModal = (e) => {
    console.log(e.chatId);
    if (!e.chatId) {
      
      setChatRoomId(-1);
    } else {
      setChatRoomId(e.chatId);
    }
    console.log(e);
    setBusinessId(e.businessId);
    setChatRoomBusiness(e.businessName);
    setShowChatModal(true)
  };
  const handleCloseChatModal = () => setShowChatModal(false);

  // const handleChat = (companyId) => {
  //   console.log("Chat with company with ID:", companyId);
  //   // Add logic to handle chat action
  // };



  const handleUnfollow = async (companyId) => {
    console.log("Unfollow company with ID:", companyId);
    // Add logic to handle unfollow action, such as updating state
    // setUser((prevUser) => ({
    //   ...prevUser,
    //   followedCompanies: prevUser.followedCompanies.filter(id => id !== companyId),
    // }));
    await axios.post(`http://localhost:3000/clientdashboard/${user.id}`, {action: "unfollow business", businessId: companyId})
    .then((res) => {
      if (res.data.result === "success") {
        console.log(res.data.message);
        window.location.reload();
      }
    })
  };
  console.log(followedbusiness)
  return (
    <Container className="client-dashboard mt-4">
       <div>
      {/* Add this button to open the modal */}
      <Button variant="primary" onClick={handleOpenModal}>
        Update Profile
      </Button>

      {/* Modal for updating user profile */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserProfile user={user} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    {/* <Chat /> */}
<Card style={{ fontWeight: 'bold',backgroundColor: 'rgba(255, 228, 225, 0.5)', border: 'none', padding: '20px' }}>
        {/* <Card style={{ fontWeight: 'bold',backgroundColor: '#FFE4C4', border: 'none', padding: '20px' }}> */}
          <section className="text-center my-5">
          <Card.Title> <h1>Hello {user.firstName}</h1></Card.Title>
          </section>
        </Card>
    <Row>
      <Col md={8}>
        <Posts 
        posts={posts}
        role="client" 
      />
      </Col>
      <Col md={4}>
        <Card className="mb-4 mt-5">
          {followedbusiness[0]?
            <Card.Body>
              <Card.Title>Followed Companies</Card.Title>
              <FollowedCompanies 
              companies={followedbusiness}
              onUnfollow={handleUnfollow}
              onFollow={handleFollow}
              onChat={handleOpenChatModal}
              />
            </Card.Body>:
            <p>No followed Business</p>
          }
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Recommended Companies</Card.Title>
            <RecommendedCompanies 
              companies={recommendedBusinesses}
              onFollow={handleFollow}
              onChat={handleOpenChatModal}
              chatId={chatRoomId} // usestate
              clientId={user.id}
              role= "client"
              chatRoomBusiness={chatRoomBusiness} // usestate
              showChatModal={showChatModal}
              handleCloseChatModal={handleCloseChatModal}
            />
          </Card.Body>
        </Card>
        {showChatModal? 
          <Chat 
          chatId={chatRoomId} // usestate
          businessId = {businessId} // usestate
          clientId={user.id}
          role= "client"
          chatRoomBusiness={chatRoomBusiness} // usestate
          showChatModal={showChatModal}
          handleCloseChatModal={handleCloseChatModal} />: null}
      </Col>
    </Row>
  </Container>
  );
}

export default ClientDashboard;
