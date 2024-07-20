import React from 'react';

function Posts({posts}){
    return(
        <div className='posts'>
            <h2>Posts</h2>
            {/* {posts.map((post, index) => (
        <div key={index}> */}
            {posts.map((post) => (
        <div key={post.id}>
          <h4>{post.title}</h4>
          <p>{post.content}</p>
            {/* add more user information if need it  */}
        </div>
      ))}
    </div>
  );
}

export default Posts;