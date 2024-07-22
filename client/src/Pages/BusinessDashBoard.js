import { useState, useEffect } from "react";
import axios from "axios";
// import "dotenv/config.js";

function BusinessDashBoard () {
  const [business, setBusiness] = useState({});
  const [changeInfo, setChangeInfo] = useState({});
  const [chatrequests, setChatRequests] = useState([{}]);
  const [changeInfoMode, setChangeInfoMode] = useState(false);
  const [posts, setPosts] = useState([{}]);
  const [creatingNewPost, setCreatingNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [updatePost, setUpdatePost] = useState(false);
  const [updatePostId, setUpdatePostId] = useState(-1);
  const [updateingPostContent, setUpdatingPostContent] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    // fetch business data
    // const serverAddress = process.env.SERVERADDRESS;
    const data = JSON.parse(localStorage.getItem('ImmivanRole'));
    setBusiness(data);
    setChangeInfo(data);

    // fetch chat
    // let chats = [{}];
    // (async () => {
    //   chats = await axios.get(`http://localhost:4000/chats/:id`)
    //   setChatRequests(chats);
    // })();
    
    // business post
    let companiesPosts = [{}];
    (async () => {
      try {
        companiesPosts = await axios.get(`http://localhost:4000/posts/${data.id}`);
        setPosts(companiesPosts.data);
      } catch (err) {
        setError('An error occurred while fetching posts');
        console.error('Error fetching posts:', err);
      }
    })();
  }, []);

  // Business Profile Event Handlers
  const changeBusinessInfoHandler = () => {
    console.log(business.id)
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
    let updatedInfo = {};
    updatedInfo.businessName = changeInfo.businessName;
    updatedInfo.businessType = changeInfo.businessType;
    updatedInfo.businessLocation = changeInfo.businessLocation;
    updatedInfo.information = changeInfo.information;
    updatedInfo.contactPerson = changeInfo.contactPerson;
    updatedInfo.telephoneNumber = changeInfo.telephoneNumber;
    updatedInfo.email = changeInfo.email;

    try {
      console.log(business.id)
      let result = await axios.put(`http://localhost:4000/businessdashboard/${business.id}`, {updatedInfo});
      console.log(result)
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

  // Post Event Handlers
  const creatingNewPostHandler = () => {
    setCreatingNewPost(true);
  }
  const cancelCreatingNewPostHandler = () => {
    setCreatingNewPost(false);
  }
    const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      const response = await axios.post('http://localhost:4000/posts/', {
        businessId: business.id,
        content: newPostContent
      });
      setNewPostContent('');
      setCreatingNewPost(false);
      // window.location.reload()
    } catch (error) {
      console.error('Error creating post:', error);
      // Handle error (e.g., show error message to user)
    }
  };
  const changingPostContent = (e) => {
    setUpdatingPostContent(e.target.value)
    console.log(updateingPostContent)
  };

  const updatingPost = (e) => {
    // console.log(business.id)
    setUpdatePost(true);
    let targetPost = posts.find((post) => {
      if (post.postId == e.target.id)
      return post.content;
    });
    setUpdatingPostContent(targetPost.content)
    setUpdatePostId(e.target.id);
  }

  const cancelUpdatingPost = () => {
    setUpdatePost(false);
    setUpdatingPostContent("")
    setUpdatePostId(-1);
  }

  const submitUpdatedPost = async (e) => {
    try {
      await axios.put(`http://localhost:4000/posts/${e.target.id}`, { 
        businessId: business.id,
        content: updateingPostContent })
      .then((res) => 
        console.log(res.data.result)
      )
      window.location.reload();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  }

  const deletePost = async (e) => {
    console.log(business.id)
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:4000/posts/${e.target.id}`, {
          data:{businessId: business.id}
        });
        window.location.reload();
      } catch (error) {
        console.error('Error deleting post:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  // Contents
  const businessInfo = (
    <>
      <ul>
        <li>Business type: {business.businessType}</li>
        <li>Business location: {business.businessLocation}</li>
        <li>Information: {business.information}</li>
        <li>Contact Person: {business.contactPerson}</li>
        <li>Contact number: {business.telephoneNumber}</li>
      </ul>
      <button onClick={changeBusinessInfoHandler}>Update Information</button>
    </>
  );
  const createPostForm = (
    <form onSubmit={handleCreatePost}>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Write a new post..."
          required
        />
        <button type="submit">Create Post</button>
        <button type="button" onClick={cancelCreatingNewPostHandler}>Cancel</button>
      </form>
  )
  const updatingBusinessInfo = (
    <form onSubmit={submitUpdatedBusinessInfoHandler}>
      <div>
        <label htmlFor="businessType">Business type:</label>
        <input
          type="text"
          id="businessType"
          name="businessType"
          value={changeInfo.businessType || ""}
          onChange={inputChangeHandler}
        />
      </div>
      <div>
        <label htmlFor="businessLocation">Business location:</label>
        <input
          type="text"
          id="businessLocation"
          name="businessLocation"
          value={changeInfo.businessLocation || ""}
          onChange={inputChangeHandler}
        />
      </div>
      <div>
        <label htmlFor="information">Information:</label>
        <textarea
          id="information"
          name="information"
          value={changeInfo.information || ""}
          onChange={inputChangeHandler}
        />
      </div>
      <div>
        <label htmlFor="contactPerson">Contact Person:</label>
        <input
          type="text"
          id="contactPerson"
          name="contactPerson"
          value={changeInfo.contactPerson || ""}
          onChange={inputChangeHandler}
        />
      </div>
      <div>
        <label htmlFor="telephoneNumber">Contact number:</label>
        <input
          type="tel"
          id="telephoneNumber"
          name="telephoneNumber"
          value={changeInfo.telephoneNumber || ""}
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

  const companiesPosts = posts.map((post) => {
    updatePost && updatePostId == post.postId?
    post = 
    <div key={`post-${post.postId}`} style={{backgroundColor: "#fff"}}>
      <textarea
        value={updateingPostContent}
        onChange={changingPostContent}
      />
      <div>{post.likesCount > 1? `${post.likesCount}Likes`:`${post.likesCount}Like`}</div>
      <button id={post.postId} onClick={submitUpdatedPost}>Update</button>
      <button onClick={cancelUpdatingPost}>Cancel</button>
    </div> : 
    post = 
    <div key={`post-${post.postId}`}  style={{backgroundColor: "#fff"}}>
      <p>{post.content}</p>
      <div>{post.likesCount > 1? `${post.likesCount}Likes`:`${post.likesCount}Like`}</div>
      <button id={post.postId} onClick={updatingPost}>Update</button>
      <button id={post.postId} onClick={deletePost}>Delete</button>
    </div>
    return post;
  })

  // let clientChats = (
  //   chatrequests.map((chat) => (
  //         <div key={chat.id}>
  //           <p>{chat.client.displayname}</p>
  //           <img src={chat.client.profilePic} />
  //           <p>{chat.message[chat.message.length()-1]}</p>
  //         </div>
  //       ))
  // )

  return (
    <>
      <h1>Hi {business.businessName}</h1>
      <section className="business info">
        <h3>{business.businessName}</h3>
        {changeInfoMode? updatingBusinessInfo: businessInfo}
      </section>
      <section className="Chatboxes">
        {/* {clientChats} */}
        {/* follower name, profile pic */}
      </section>
      <section>
        <>
        <h3 key={"Post header"}>Your Posts</h3>
        <button onClick={creatingNewPostHandler}>Create a New Post</button>
        {creatingNewPost? createPostForm:<></>}
        {posts? companiesPosts:<></>}
        </>
      </section>
    </>
  )
}

export default BusinessDashBoard;