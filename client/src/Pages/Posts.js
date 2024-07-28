import { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';


function Posts({ posts, business }) {
  const errorFetching = <p>Error occurred. Please try again later.</p>;
  const [updatePost, setUpdatePost] = useState(false);
  const [updatePostId, setUpdatePostId] = useState(-1);
  const [updatingPostTitle, setUpdatingPostTitle] = useState("");
  const [updateingPostContent, setUpdatingPostContent] = useState("");

  const changingPostContent = (e) => {
    setUpdatingPostContent(e.target.value)
  };

  const updatingPost = (e) => {
    setUpdatePost(true);
    let targetPost = posts.find((post) => {
      let foundPost = {};
      if (post.postId === e.target.id){
        foundPost = post;
      }
      return foundPost;
    });
    setUpdatingPostTitle(targetPost.title);
    setUpdatingPostContent(targetPost.content)
    setUpdatePostId(e.target.id);
  };

  const cancelUpdatingPost = () => {
    setUpdatePost(false);
    setUpdatingPostContent("")
    setUpdatePostId(-1);
  }

  const submitUpdatedPost = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/posts/${e.target.id}`, { 
        businessId: business.id,
        title: updatingPostTitle,
        content: updateingPostContent })
      .then((res) => 
        console.log(res.data.result)
      )
      window.location.reload();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const deletePost = async (e) => {
    console.log(business.id)
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:3000/posts/${e.target.id}`, {
          data:{businessId: business.id}
        });
        window.location.reload();
      } catch (error) {
        console.error('Error deleting post:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  const postsContent = (
    <div className="posts">
      <h2>Posts</h2>
      {posts.length === 0 ? (
        <p>No posts from followed businesses yet.</p>
      ) : Array.isArray(posts) ?(
        posts.map((post) => (
          updatePost && updatePostId === post.postId.toString()? 
          // post update form
          <Card key={post.postId} className="mb-4">
            <Card.Body>
              <Card.Title>Updating {post.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">By: {post.businessName}</Card.Subtitle>
              {/* <Card.Text>{post.content}</Card.Text> */}
              <Form id={post.postId} onSubmit={submitUpdatedPost}>
                <Form.Group controlId="formBasicTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" placeholder="Enter title" value={updatingPostTitle} onChange={(e) => setUpdatingPostTitle(e.target.value)}/>
                </Form.Group>
                <Form.Group controlId="formBasicContent">
                  <Form.Label>Content</Form.Label>
                  <Form.Control type="text" placeholder="Enter content" value={updateingPostContent} onChange={changingPostContent}/>
                </Form.Group>
                <Button variant="primary" type="submit" >Submit</Button>
                <Button variant="secondary" onClick={cancelUpdatingPost}>Cancel</Button>
              </Form>
              <Card.Footer>
                <small className="text-muted">Posted on: {new Date(post.createDate).toLocaleDateString()}</small>
              </Card.Footer>
            </Card.Body>
          </Card>:
          // Posts content display
          <Card key={post.postId} className="mb-4">
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">By: {post.businessName}</Card.Subtitle>
              <Card.Text>{post.content}</Card.Text>
              <Card.Footer>
                <small className="text-muted">Posted on: {new Date(post.createDate).toLocaleDateString()}</small>
              </Card.Footer>
              <Button variant="primary" id={post.postId} onClick={updatingPost} >Update</Button>
              <Button variant="danger" id={post.postId} onClick={deletePost}>Delete</Button> 
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>Invalid data format for posts.</p>
      )}
    
    </div>
  );
  return posts === "Failed to fetch posts. Please try again later."
    ? errorFetching
    : postsContent;
}

export default Posts;
