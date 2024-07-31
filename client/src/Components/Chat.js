import { useState, useEffect,memo } from 'react';
import io from 'socket.io-client';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

// const socket = io.connect('http://localhost:3000');

const Chat = (props) => {
  const [chat, setChat] = useState([]);
  const[chatId,setChatId] =useState(-1);
  const [businessId, setBusinessId] = useState(-1);
  const [clientId, setClientId] = useState(-1);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState({});

  async function fetchChats(id) {
    try {
      let result = await axios.get(`http://localhost:3000/chats/${id}`);
      setChat(result.data);
    } catch (err) {
      console.log(err)
    }
  }

  async function fetchChatId(businessId,clientId){
      try{
        let result = await axios.post(`http://localhost:3000/chats`,
          {
            businessId:businessId,
            clientId: clientId
          });
          if(true){
            console.log(result.data);
          } else{
            console.log(result.data[0].id);
            setChatId(result.date[0].id);
          }
  }catch(err){
    console.log(err);
  }
  }
  useEffect(() => {
    console.log('chatId',props.chatId,'businessId:',props.businessId,
      'clientId:',props.clientId);
    setBusinessId(props.businessId)
    setClientId(props.clientId)
    let socket = io.connect('http://localhost:3000');
    setSocket(socket);
    socket.emit('join',{businessId:props.businessId,clientId:props.client});
    let tempChatId;
      if (props.chatId === -1) {
        console.log("check")
        fetchChatId(props.businessId, props.clientId);
      } else {
    fetchChats(props.chatId);
    setChatId(props.chatId);
        tempChatId = props.chatId;
      }
      socket.on('chat message', async (message) => {
        console.log('message received:', message);
        try {
        let result = await axios.get(`http://localhost:3000/chats/${tempChatId}`);
        setChat(result.data);
      } catch (err) {
        console.log(err)
      }
      });
      socket.on('chatId', (chatId) => {
        console.log('chatId:', chatId);
        setChatId(chatId.chatId);
      });
    // return () => {
    //   socket.off('receiveMessage');
    // };
  }, []);

  const sendMessage = async () => {
    if (message.trim() && props.role === 'business') {
      socket.emit('business chat message', {
        chatId: chatId,
        businessId: businessId,
        sender: props.role,
        clientId: props.clientId,
        message: message});
      setMessage('');
    } else if (message.trim() && props.role === 'client') {
      socket.emit('client chat message', {
        chatId: chatId,
        clientId: clientId,
        sender: props.role,
        businessId: props.businessId,
        message: message});
      setMessage('');
    }
      try {
      let result = await axios.get(`http://localhost:3000/chats/${props.chatId}`);
      setChat(result.data);
    } catch (err) {
      console.log(err)
    }
  };

  const MessagesInChat = memo(function MessagesInChat({ chatData }) {
    return chatData.map((chatItem) => (
      <div key={chatItem.id}>{chatItem.message}</div>
    ));
  }, [chat]);

  return (
    <div>
      <Modal show={props.showChatModal} onHide={props.handleCloseChatModal}>
        {/* Chat modal */}
        <Modal.Header closeButton>
          <Modal.Title>Chat with Customer {props.chatRoomClient}</Modal.Title>
        </Modal.Header>
        {chat?  <MessagesInChat chatData={chat} />:<p>No message yet</p>}
        {messages}
        <Modal.Body>
          <Form>
            <Form.Group controlId="chatMessage">
              <Form.Label>Reply</Form.Label>
              <Form.Control
              as="textarea"
              value={message}
              onChange={(e) => e.target.value.key === 'Enter'? sendMessage():setMessage(e.target.value)}
              rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
          variant="secondary"
          onClick={props.handleCloseChatModal}>Close</Button>
          <Button
          variant="primary"
          onClick={sendMessage}>Send</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Chat;