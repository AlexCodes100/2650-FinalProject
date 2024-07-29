import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

// const socket = io.connect('http://localhost:3000');

const Chat = (props) => {
  const [chat, setChat] = useState([]);
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

  useEffect(() => {
    setBusinessId(props.businessId)
    let socket = io.connect('http://localhost:3000');
    setSocket(socket);
    fetchChats(props.chatId);
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // return () => {
    //   socket.off('receiveMessage');
    // };
  }, []);

  const sendMessage = async () => {
    if (message.trim()) {
      socket.emit('business chat message', {
        chatId: props.chatId,
        businessId: businessId,
        sender: props.role,
        clientId: props.clientId,
        message: message});
      setMessage('');
      try {
      let result = await axios.get(`http://localhost:3000/chats/${props.chatId}`);
      setChat(result.data);
    } catch (err) {
      console.log(err)
    }
    }
  };

  return (
    <div>
      <Modal show={props.showChatModal} onHide={props.handleCloseChatModal}>
        {/* Chat modal */}
        <Modal.Header closeButton>
          <Modal.Title>Chat with Customer {props.chatRoomClient}</Modal.Title>
        </Modal.Header>
        {chat? chat.map((chat) => {
          return <div key={chat.id}>{chat.message}</div>
        }):<p>No message yet</p>}
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