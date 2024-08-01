import { useState, useEffect,memo } from 'react';
import io from 'socket.io-client';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

// const socket = io.connect('${apiUrl}');

const apiUrl = process.env.REACT_APP_API_URL;

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
      let result = await axios.get(`${apiUrl}/chats/${id}`);
      setChat(result.data);
    } catch (err) {
      console.log(err)
    }
  }

  async function fetchChatId(businessId,clientId){
    let id;
    try{
      id = await axios.post(`http://localhost:3000/chats`,
        {
          businessId:businessId,
          clientId: clientId
        }).then((res) => {
          if(res.data.length === 0){
            console.log("No chat found for this user and business");
            console.log(res.data);
          } else {
            console.log(res.data[0].id);
            setChatId(res.data[0].id);
          }
          return res;
        }).then(async (res) => {
          console.log("fetching chat");
          let result = await axios.get(`http://localhost:3000/chats/${res.data[0].id}`);
          setChat(result.data);
          return res;
        });
    }catch(err){
      console.log(err);
    }
    return id.data[0].id;
  }
  useEffect(() => {
    console.log('chatId',props.chatId,'businessId:',props.businessId,
      'clientId:',props.clientId);
      // set business id and client id
    setBusinessId(props.businessId)
    setClientId(props.clientId)
    // create a socket connection
    let socket = io.connect('http://localhost:3000');
    setSocket(socket);
    // join the chat room
    socket.emit('join',{businessId:props.businessId,clientId:props.clientId});
    let tempChatId;
    // if there is no chat id from the props, fetch the chat id
      if (props.chatId === -1) {
        console.log("chatId id set to -1")
        fetchChatId(props.businessId, props.clientId);
        console.log("tempChatId:",tempChatId);
        console.log(tempChatId);
      } else {
        console.log("chatId id set to props.chatId:",props.chatId)
        fetchChats(props.chatId);
        setChatId(props.chatId);
        tempChatId = props.chatId;
      }
      socket.on('chat message', async (message) => {
        // console.log('message received:', message);
        if (tempChatId) {
          console.log('temp chatId:', tempChatId);
          try {
            let result = await axios.get(`http://localhost:3000/chats/${tempChatId}`);
            setChat(result.data);
          } catch (err) {
            console.log(err)
          }
        } else {
          console.log('original chatId:', chatId);
          try {
            let result = await axios.get(`http://localhost:3000/chats/${chatId}`);
            setChat(result.data);
          } catch (err) {
            console.log(err)
          }
        }
      //   try {
      //   let result = await axios.get(`http://localhost:3000/chats/${tempChatId}`);
      //   setChat(result.data);
      // } catch (err) {
      //   console.log(err)
      // }
      });
      socket.on('chatId', (chatId) => {
        // console.log('chatId:', chatId);
        if (chatId.chatId){
          console.log("no chatId.chatid")
          setChatId(chatId.chatid);
        } else {
          console.log('Setting chatId:', chatId); 
          setChatId(chatId);
        }
        // let tempChatId = {chatId: chatId};
        console.log('chatId:', chatId);
        // setChatId(tempChatId.chatId);
      });
    // return () => {
    //   socket.off('receiveMessage');
    // };
  }, []);

  const sendMessage = async () => {
    if (message.trim() && props.role === 'business') {
      console.log(`sending to chatId ${chatId}`);
      socket.emit('business chat message', {
        chatId: chatId,
        businessId: businessId,
        sender: props.role,
        clientId: props.clientId,
        message: message});
      setMessage('');
    } else if (message.trim() && props.role === 'client') {
      // console.log(`sending to chatId ${chatId}`);
      console.log(chatId)
      socket.emit('client chat message', {
        chatId: chatId,
        clientId: clientId,
        sender: props.role,
        businessId: props.businessId,
        message: message});
      setMessage('');
    }
      try {
        console.log("Sending message to chatId", chatId);
      let result = await axios.get(`${apiUrl}/chats/${chatId}`);
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