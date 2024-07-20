import { useState, useEffect } from "react";

function BusinessDashBoard () {
  const [business, setBusiness] = useState({});
  const [chatrequests, setChatRequests] = useState([{}]);
  const [changeInfo, setChangeInfo] = useState(false);

  useEffect(() => {
    // fetch business data
    const result = {};
    setBusiness(result);
    // fetch chat
    const chats = [{}];
    setChatRequests(chats);
    // forEach interestedCompanies, fetch their posts. Sort by date (newest to oldest)
    
    //todo ask riley about this line
    //! const companiesPosts = [{}];
    //! setPosts(companiesPosts) 
  }, []);

  // Event Handlers
  const changeBusinessInfoHandler = () => {
    setChangeInfo(true);
  }

  const updateBusinessInfoHandler = (e) => {
    e.preventDefault();
    // Handle the update business info logic here (e.g., send a request to the server)
    setChangeInfo(false);
  };

  const inputChangeHandler = (e) => {
    setBusiness({
      ...business,
      [e.target.name]: e.target.value
    });
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
    <form onSubmit={updateBusinessInfoHandler}>
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
      <button type="submit">Save Changes</button>
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
        {changeInfo? {updatingBusinessInfo}: {businessInfo}}
      </section>
      <section className="Chatboxes">
        {clientChats}
        {/* follower name, profile pic */}
      </section>
    </>
  )
}

export default BusinessDashBoard;