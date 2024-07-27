import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const socket = io.connect('http://localhost:3000');

const Chat = (props) => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  async function fetchChats(id) {
    let result = await axios.get(`http://localhost:3000/chats/${id}`);
    console.log(result.data[0]);
    setChat(result.data[0]);
  }

  useEffect(() => {
    console.log(props.chatId);
    fetchChats(props.chatId);
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  // const sendMessage = () => {
  //   socket.emit('sendMessage', message);
  //   setMessage('');
  // };

  return (
    <div>
      <Modal show={props.showChatModal} onHide={props.handleCloseChatModal}> {/* Chat modal */}
            <Modal.Header closeButton>
              <Modal.Title>Chat with Customer</Modal.Title>
            </Modal.Header>
            {messages}
            <Modal.Body>
              <Form>
                <Form.Group controlId="chatMessage">
                  <Form.Label>Message</Form.Label>
                  <Form.Control as="textarea" rows={3} />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={props.handleCloseChatModal}>
                Close
              </Button>
              <Button variant="primary">
                Send
              </Button>
            </Modal.Footer>
          </Modal>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button >Send</button>
    </div>
  );
};

export default Chat;