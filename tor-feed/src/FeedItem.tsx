import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faSave, faComment, faBookmark,faPaperPlane } from '@fortawesome/free-solid-svg-icons';


interface FeedItemProps {
  item: FeedItemArray; // Replace FeedItemArray with the actual type of item
  feedId: UUID | null; // Replace UUID with the actual type, assuming UUID is a string
  currentTab: string; // Adjust if currentTab has specific possible values like 'private' | 'buddy'
  refreshFeedItems: () => void; // Assuming this is a function that returns nothing
  user_id: bigint | null; // Assuming user_id can be bigint or null
  fetchSavedItems: () => void; // Assuming this is also a function that returns nothing
}

const FeedItem: React.FC<FeedItemProps> = ({ item, feedId, currentTab, refreshFeedItems, user_id, fetchSavedItems }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [userName, setUserName] = useState(null);
  const indentStyle = item.type === 'comment' ? { marginLeft: '20px' } : {};
  let itemIdAsString = String(item.item_id);
  
  //http://localhost:3000/api/likedItem?user_id=${user_id}&item_id=${item.item_id}
  const toggleLike = async () => {
    const newLikedStatus = !isLiked;
    setIsLiked(newLikedStatus);

    try {
      let response;
      const requestOptions = {
        method: 'POST' || 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: user_id,
          item_id: itemIdAsString
        })
      };
  
      if (newLikedStatus) {
        requestOptions.method = 'POST';
        response = await fetch('http://localhost:3000/api/likedItem', requestOptions);
      } else {
        requestOptions.method = 'DELETE';
        response = await fetch('http://localhost:3000/api/likedItem', requestOptions);
      }
  
      if (!response.ok) {
        throw new Error('Failed to update like status');
      }
  
      // Optionally, handle the response
    } catch (error) {
      console.error('Error updating like status:', error);
      setIsLiked(!isLiked); // Revert the UI update in case of an error
    }
  };

  const toggleSaved = async () => {
    const newSavedStatus = !isSaved;
    setIsSaved(newSavedStatus);

    try {
      let response;
      const requestOptions = {
        method: 'POST' || 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: user_id,
          item_id: itemIdAsString
        })
      };
  
      if (newSavedStatus) {
        requestOptions.method = 'POST';
        response = await fetch('http://localhost:3000/api/savedItem', requestOptions);
      } else {
        requestOptions.method = 'DELETE';
        response = await fetch('http://localhost:3000/api/savedItem', requestOptions);
      }
  
      if (!response.ok) {
        throw new Error('Failed to update like status');
      }
  
      // Optionally, handle the response
    } catch (error) {
      console.error('Error updating like status:', error);
      setIsSaved(!isSaved); // Revert the UI update in case of an error
    }
  };

  const fetchUserName = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/firstname?user_id=${user_id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error fetching username:', error);
      return []; // Return an empty array in case of an error
    }
  };


  useEffect(() => {
    const fetchLikedStatus = async () => {
      try {

        const response = await fetch(`http://localhost:3000/api/likedItem?user_id=${user_id}&item_id=${itemIdAsString}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Update the isLiked state based on the response
        setIsLiked(data != null); // Adjust this according to how your API response is structured
      } catch (error) {
        console.error('Error fetching liked status:', error);
      }
    };
  
    fetchLikedStatus()
  }, [itemIdAsString, user_id]);

  useEffect(() => {
    const fetchSavedStatus = async () => {
      try {

        const response = await fetch(`http://localhost:3000/api/savedItem?user_id=${user_id}&item_id=${itemIdAsString}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Update the isLiked state based on the response
        setIsSaved(data != null); // Adjust this according to how your API response is structured
      } catch (error) {
        console.error('Error fetching liked status:', error);
      }
    };
  
    fetchSavedStatus()
  }, [itemIdAsString, user_id]);
  
  useEffect(() => {
    const getUserName = async () => {
      const UserName = await fetchUserName();
      if (UserName) {
        setUserName(UserName);
      }
    };

    getUserName();
  }, []);

  const toggleCommentBox = () => {
    setShowCommentBox(!showCommentBox);
  };

  const handleCommentSubmit = async () => {

    let apiBodyChoice;

        if (currentTab==="private"){
          apiBodyChoice = {
          parent_id: itemIdAsString,
          type: 'comment',
          content: commentContent,
          private_feedid: feedId,
          user_id:user_id
        };    

        } else{ 
          
          apiBodyChoice = {
          parent_id: itemIdAsString,
          type: 'comment',
          content: commentContent,
          shared_feedid: feedId,
          user_id:user_id
        };
      }
      console.log(apiBodyChoice)

    try {
    
      const response = await fetch('http://localhost:3000/api/feedItem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiBodyChoice)
      });

      if (response.ok) {
        // Handle successful submission, e.g., clear comment input, refresh comments
        console.log("user_id",user_id)
        setCommentContent('');
        refreshFeedItems();
      } else {
        throw new Error('Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className={`flex flex-col space-y-2 p-4 border-b last:border-b-0 ${item.type === 'comment' ? 'comment-style' : ''}`} 
        style={indentStyle}
    >
        <div className={`flex space-y-2 space-x-2`} >
          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">A</div>
          <div className="font-semibold">{item.user_id.toString()}</div>
        <div className="text-sm text-gray-500">{new Date(item.created_at).toLocaleString()}</div>
        </div>
      <div className="text-gray-700">
          {item.content}
      </div>
      <div className="flex items-center space-x-2">
      <button 
        onClick={toggleLike} 
        className={`transform ${isLiked ? 'text-blue-500 scale-120' : 'text-gray-500'} transition duration-150 ease-in-out`}
      >
        <FontAwesomeIcon icon={faThumbsUp} />
      </button>
      <button 
        onClick={() => {
          toggleSaved();
          fetchSavedItems();
        }}
        className={`transform ${isSaved ? 'text-blue-500 scale-120' : 'text-gray-500'} transition duration-150 ease-in-out`}
      >  
        <FontAwesomeIcon icon={faBookmark} />
      </button>
        {item.type === 'post' && (
          <button onClick={toggleCommentBox}>
            <FontAwesomeIcon icon={faComment} />
          </button>
        )}
      </div>
      {showCommentBox && (
        <div className="mt-2">
          <input 
            type="text" 
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className="break-words w-full mb-2 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded p-2"
            placeholder='Comment Here'
          />
          {commentContent && (
      <button 
        onClick={handleCommentSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-xs rounded"
      >
       <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    )}
        </div>
      )}
    </div>
  );
};

export default FeedItem;

