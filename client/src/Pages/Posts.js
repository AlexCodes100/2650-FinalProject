import React from "react";
import { Card } from 'react-bootstrap';


function Posts({ posts }) {
  const errorFetching = <p>Error occurred. Please try again later.</p>;

  const postsContent = (
    <div className="posts">
      <h2>Posts</h2>
      {posts.length === 0 ? (
        <p>No posts from followed businesses yet.</p>
      ) : Array.isArray(posts) ?(
        posts.map((post) => (
          <Card key={post.id} className="mb-4">
          <Card.Body>
            <Card.Title>{post.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">By: {post.business_name}</Card.Subtitle>
            <Card.Text>{post.content}</Card.Text>
            <Card.Footer>
              <small className="text-muted">Posted on: {new Date(post.created_at).toLocaleDateString()}</small>
            </Card.Footer>
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
