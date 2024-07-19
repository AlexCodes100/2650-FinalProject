import { useState, useEffect } from "react";
import axios from "axios";
import "dotenv/config.js";

function BusinessDashboard () {
  const [business, setBusiness] = useState({});
  const [changeInfo, setChangeInfo] = useState({});
  const [chatrequests, setChatRequests] = useState([{}]);
  const [changeInfoMode, setChangeInfoMode] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // fetch business data
    const serverAddress = process.env.SERVERADDRESS;
    const data = JSON.parse(localStorage.getItem('ImmivanRole'));
    setBusiness(data);
    setChangeInfo(data);

    // fetch chat
    let chats = [{}];
    (async () => {
      chats = await axios.get(`${serverAddress}/chats/:id`)
      setChatRequests(chats);
    })();
    
    // business post
    let companiesPosts = [{}];
    (async () => {
      companiesPosts = await axios.get(`${serverAddress}/posts/:id`)
      setPosts(companiesPosts);
    })();
  }, []);

  // Event Handlers
  const changeBusinessInfoHandler = () => {
    setChangeInfoMode(true);
  }

  const cancelInputChangeHandler = () => {
    setChangeInfoMode(false);
    setError(false);
  }

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setChangeInfo((prevData) =>({
      ...prevData,
      [name]: value
    }));
  };

  const submitUpdatedBusinessInfoHandler = async (e) => {
    e.preventDefault();
    // Handle the update business info logic here (e.g., send a request to the server)
    let updatedInfo = changeInfo
    try {
      let result = await axios.put(`${serverAddress}/business/:id`, {updatedInfo});
      if (result.data[0].result === "successful") {
        console.log(result.data[0].message)
        setChangeInfoMode(false);
      } else {
        setError(true);
        console.log(result.data[0].message)
      }
      
    } catch (err) {
      console.log("Error occured during updating business info: ", err)
    }
    
  };

  // Contents
  const businessInfo = (
    <>
      <ul>
        <li>Business type: {business.business}</li>
        <li>Business location: {business.location}</li>
        <li>Information: {business.information}</li>
        <li>Contact Person: {business.contactPerson}</li>
        <li>Contact number: {business.telephoneNumber}</li>
      </ul>
      <button onClick={changeBusinessInfoHandler}>Update Information</button>
    </>
  );

  const updatingBusinessInfo = (
    <form onSubmit={submitUpdatedBusinessInfoHandler}>
      <div>
        <label htmlFor="business">Business type:</label>
        <input
          type="text"
          id="business"
          name="business"
          value={business.business || ""}
          onChange={inputChangeHandler}
        />
      </div>
      <div>
        <label htmlFor="location">Business location:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={business.location || ""}
          onChange={inputChangeHandler}
        />
      </div>
      <div>
        <label htmlFor="information">Information:</label>
        <textarea
          id="information"
          name="information"
          value={business.information || ""}
          onChange={inputChangeHandler}
        />
      </div>
      <div>
        <label htmlFor="contactPerson">Contact Person:</label>
        <input
          type="text"
          id="contactPerson"
          name="contactPerson"
          value={business.contactPerson || ""}
          onChange={inputChangeHandler}
        />
      </div>
      <div>
        <label htmlFor="telephoneNumber">Contact number:</label>
        <input
          type="tel"
          id="telephoneNumber"
          name="telephoneNumber"
          value={business.telephoneNumber || ""}
          onChange={inputChangeHandler}
        />
      </div>
      <div>
        {error? <p style={{ color: "red" }}>Error occur while updating. Please try again. If the error continues, please contact us.</p>:<></>}
      </div>
      <button type="submit">Save Changes</button>
      <button type="button" onClick={cancelInputChangeHandler}>Cancel</button>
    </form>
  );

  let clientChats = (
    chatrequests.map((chat) => (
          <div key={chat.id}>
            <p>{chat.client.displayname}</p>
            <img src={chat.client.profilePic} />
            <p>{chat.message[chat.message.length()-1]}</p>
          </div>
        ))
  )

  return (
    <>
      <h1>Hi {business.displayname}</h1>
      <section className="business info">
        <h3>{business.displayname}</h3>
        {changeInfoMode? {updatingBusinessInfo}: {businessInfo}}
      </section>
      <section className="Chatboxes">
        {clientChats}
        {/* follower name, profile pic */}
      </section>
    </>
  )
}

export default BusinessDashboard;