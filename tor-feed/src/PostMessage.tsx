import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const PostMessage = ({ onPostSubmit, currentTab, feedId, user_id}) => {
  const [content, setContent] = useState('');

  // Placeholder values for private_feedid and type
  const postType = 'post';


  const handleResize = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto'; // Reset the height
    textarea.style.height = textarea.scrollHeight + 'px'; // Set new height
  };

  const handleChange = (e) => {
    setContent(e.target.value);
    handleResize(e);
  };

  // In PostMessage.js
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let apiBody = {};

      // Check the current tab to decide which feed ID to use
      if (currentTab === 'private') {
        apiBody = {
          private_feedid: feedId,
          type: postType,
          content: content,
          user_id: user_id
        };
      } else { // Assuming all other cases should use shared_feedid
        apiBody = {
          shared_feedid: feedId,
          type: postType,
          content: content,
          user_id: user_id
        };
      }

      // Sending the POST request
      const response = await fetch('http://localhost:3000/api/feedItem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiBody)
      });

      if (response.ok) {
        const newPost = await response.json();
        onPostSubmit(newPost);
        setContent(''); // Reset content after successful post
      } else {
        throw new Error('Failed to post message');
      }
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="post-grid-container">
        <textarea 
          value={content}
          onChange={handleChange}
          placeholder="What's on your mind?"
          className="p-4 mr-4 rounded-lg"
        />
        <button  
          type="submit" 
          className={`post-submit-btn ${!content ? 'opacity-50 cursor-not-allowed' : ''} bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out`}
          disabled={!content}
        >
          <FontAwesomeIcon icon={faPaperPlane} /> Post
        </button>
      </form>
  );

};

export default PostMessage;
