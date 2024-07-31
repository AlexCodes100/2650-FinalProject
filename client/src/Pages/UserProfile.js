import { useEffect, useState } from "react";
import { Card, Container, Row, Col } from 'react-bootstrap';
import axios from "axios";

function UserProfile({ user }) {
  const [updatingUser, setUpdatingUser] = useState(user)
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    setUpdatingUser(user);
  },[])
  // Event Handler
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setUpdatingUser((prevData) =>({
      ...prevData,
      [name]: value
    }));
  };
  const changeClientProfile = () => {
    setUpdating(true);
  }
  const cancelChangeClientProfile = () => {
    setUpdating(false);
  }
  const submitUpdate = async (e) => {
    e.preventDefault();

    let updatedProfile = {};
    updatedProfile.firstName = updatingUser.firstName;
    updatedProfile.lastName = updatingUser.lastName;
    updatedProfile.orgainzation = updatingUser.orgainzation;
    updatedProfile.familySize = updatingUser.familySize;
    updatedProfile.preferredLanguage = updatingUser.preferredLanguage;

    try {
      let result = await axios.put(`${apiUrl}/clientdashboard/${user.id}`, {updatedProfile});
      console.log(result)
      if (result.data[0].result === "successful") {
        console.log(result.data[0].message)
        setUpdating(false);
      } else {
        setError(true);
        console.log(result.data[0].message)
      }
    } catch (err) {
      console.log("Error occured during updating client profile: ", err)
    }
  }
  // content
  const userProfile = (
    <>
    <p><strong>First Name:</strong> {user.firstName}</p>
    <p><strong>Last Name:</strong> {user.lastName}</p>
    <p><strong>Email:</strong> {user.email}</p>
    <p><strong>Preferred Language:</strong> {user.preferredLanguage}</p>
    {user.role === "student"? <p><strong>Institution:</strong> {user.orgainzation}</p>:<p><strong>Company:</strong> {user.orgainzation}</p>}
    <p><strong>Number of family member:</strong> {user.familySize}</p>
    <button onClick={changeClientProfile}>Update</button>
  </>)

  const updatingProfileForm = (
    <>
    <p><strong>Email:</strong> {user.email}</p>
      <form onSubmit={submitUpdate}>
      <div>
        <label htmlFor="ClientFirstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={updatingUser.businessType || ""}
          onChange={inputChangeHandler}
        />
      </div>
      <div>
        <label htmlFor="ClientLastName">Business location:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={updatingUser.businessLocation || ""}
          onChange={inputChangeHandler}
        />
      </div>
      <div>
        <label htmlFor="preferredLanguage">Preferred Language:</label>
        <select
          id="preferredLanguage"
          name="preferredLanguage"
          value={updatingUser.preferredLanguage || ""}
          onChange={inputChangeHandler}
        >
          <option value="">Select a language</option>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="Chinese Traditional">Chinese Traditional</option>
          <option value="Japanese">Japanese</option>
          <option value="Punjabi">Punjabi</option>
          <option value="Tagalog">Tagalog</option>
          <option value="Korean">Korean</option>
          <option value="Vietnamese">Vietnamese</option>
          <option value="Chinese Simplified">Chinese Simplified</option>
        </select>
      </div>
      {user.role === "student"? <div>
        <label htmlFor="institution">Institution:</label>
        <textarea
          id="institution"
          name="institution"
          value={updatingUser.orgainzation || ""}
          onChange={inputChangeHandler}
        />
      </div>:<div>
        <label htmlFor="Company">Contact Person:</label>
        <input
          type="text"
          id="company"
          name="company"
          value={updatingUser.orgainzation || ""}
          onChange={inputChangeHandler}
        />
      </div>}
      <div>
        <label htmlFor="familySize">Number of family member:</label>
        <input
          type="number"
          id="familySize"
          name="familySize"
          value={updatingUser.familySize || ""}
          onChange={inputChangeHandler}
        />
      </div>
      <div>
        {error? <p style={{ color: "red" }}>Error occur while updating. Please try again. If the error continues, please contact us.</p>:<></>}
      </div>
      <button type="submit">Save Changes</button>
      <button type="button" onClick={cancelChangeClientProfile}>Cancel</button>
    </form>
    </>
  )
  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>{user.displayName}</Card.Title>
              <Card.Text>
                {updating? updatingProfileForm:userProfile}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UserProfile;