import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare,faUser, faBell,faPlusSquare, faBookmark, faSignOutAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import AddBuddyModal from './AddBuddyModal';



const Sidebar = ({ currentTab, onSelectTab, user_id, hasBuddy,setHasBuddy,buddyId,setProfileView,setShowSavedItems,fetchSavedItems}) => {

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [buddyRequests, setBuddyRequests] = useState<BuddyRequestArray[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const handleLocalAddBuddyClick = () => {
    setModalOpen(!isModalOpen && !hasBuddy );
  };

  const handleSavedButtonClick = () => {
    setShowSavedItems(prevState => !prevState);
    fetchSavedItems();
  };


  //lazy check
  const toggleNotifications = () => {
    if (!showNotifications) {
      fetchBuddyRequests();
    }
    setShowNotifications(!showNotifications);
  };
  
  const handleBuddySubmit = async (buddyId) => {
    try {
      const response = await fetch('http://localhost:3000/api/BuddyRequestResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other necessary headers
        },
        body: JSON.stringify({ recipient_id: buddyId, requestor_id: user_id }),
      });
  
      if (response.ok) {
        console.log(response.body)
        alert('Buddy request sent successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to send buddy request: ${errorData.message}`);
      }
    } catch (error) {
      alert('Network error: Could not send buddy request.');
    }
  };

  const fetchBuddyRequests = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/BuddyRequestResponse?recipient_id=${user_id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          // Include other necessary headers
        }
      });
      if (response.ok) {
        const requests = await response.json();
        setBuddyRequests(requests);
      } else {
        // Handle errors
      }
    } catch (error) {
      alert('Network error: Could not get the buddy request.');
    }
  };
  
  const respondToBuddyRequest = async (requestorId, status) => {
    try {
      const response = await fetch('http://localhost:3000/api/BuddyRequestResponse', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Include other necessary headers
        },
        body: JSON.stringify({ recipient_id: user_id, requestor_id: requestorId, status: status }),
      });
  
      if (response.ok) {
        alert(`Buddy request ${status === 'accepted' ? 'accepted' : 'rejected'} successfully!`);
        setBuddyRequests(buddyRequests.filter(request => request.requestor_id !== requestorId)); // Remove the responded request from state
        if(status ==='accepted'){
          updateSharedFeedId(requestorId);
        }
      } else {
        // Handle errors
      }
    } catch (error) {
      alert('Network error: Could not respond to buddy request.');
    }
  };

  const updateSharedFeedId = async (requestorId) => {
    try {
      const response = await fetch('http://localhost:3000/api/UserFeedId', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ buddy_id: user_id, user_id: requestorId
        }), //user_is is now  the buddy. 
      });
  
      if (response.ok) {
        setHasBuddy(true);
      } else {
        // Handle errors
      }
    } catch (error) {
      console.error('Error updating shared feed ID:', error);
    }
  };

  
  const BuddyRequestDropdown = () => {
  if (buddyRequests.length === 0) {
    return <div className="flex items-center space-x-1 p-2 border-gray-300 rounded">
            No new notifications.</div>;
  }

    return (
      <div className="flex items-center space-x-1 p-2 border-gray-300 rounded">
        {buddyRequests.map(request => (
          <div key={request.request_id} className="flex-1 p-1 text-xs border-2 border-gray-300 rounded">
            <p>User {request.requestor_id.toString()} wants to be your buddy.</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 text-xxs rounded mr-2" onClick={() => respondToBuddyRequest(request.requestor_id, 'accepted')}>Accept</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 text-xxs rounded" onClick={() => respondToBuddyRequest(request.requestor_id, 'rejected')}>Reject</button>
          </div>
        ))}
      </div>
    );
  };

  
  const handleRemoveBuddyClick = async () => {

    const confirmRemove = window.confirm("Are you sure you want to remove your buddy?");

    if (confirmRemove) {
    try {
      // First API call to deleteUserFeedId
      const response1 = await fetch('http://localhost:3000/api/UserFeedId', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user_id, buddy_id:buddyId }), 
      });
  
      if (!response1.ok) {
        throw new Error('Failed to remove user feed ID');
      }
  
      // Second API call to deleteBuddyRequestResponse
      const response2 = await fetch('http://localhost:3000/api/BuddyRequestResponse', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipient_id: buddyId, requestor_id: user_id }), 
      });
  
      if (!response2.ok) {
        throw new Error('Failed to remove buddy request response');
      }

      const response3 = await fetch('http://localhost:3000/api/SharedFeedId', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user_id}), 
      });
  
      if (!response3.ok) {
        throw new Error('Failed to update sharedfeed_id');
      }
  
      // Update local state to reflect buddy removal
      setHasBuddy(false);
      alert('Buddy successfully removed');
    } catch (error) {
      console.error('Error removing buddy:', error);
      alert('Error removing buddy.');
    }
  }
  };
  
  return (
    <aside className="bg-white p-4 h-full">
      <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
        <ul className="space-y-2">
          
          {/* Logo or user avatar */}
          <div className="flex items-center space-x-4 mb-5">
          <FontAwesomeIcon icon={faUser} className="h-10 w-10 rounded-full bg-black text-white p-2" />
          <span className="font-bold text-xl">tor</span>
          </div>

          {/* Feeds Container */}
          <div className="flex justify-between mb-6">
            {/* Home/Private Feed Icon */}
            <li>
              <button
                className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${currentTab === 'private' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                onClick={() => onSelectTab('private')}
              >
                <FontAwesomeIcon icon={faUser} className="w-6 h-6" />
                <span className="ml-3">Private Feed</span>
              </button>
            </li>
            {/* Buddy Feed Icon */}
            <li>
            <button
            className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white ${hasBuddy ? 'hover:bg-gray-100 dark:hover:bg-gray-700 bg-gray-200 dark:bg-gray-700' : 'opacity-50 cursor-not-allowed'}`}
            onClick={() => hasBuddy && onSelectTab('buddy')}
            disabled={!hasBuddy}
          >
            <FontAwesomeIcon icon={faUserFriends} className={`w-6 h-6 ${!hasBuddy ? 'opacity-50' : ''}`} />
            <span className={`ml-3 ${!hasBuddy ? 'opacity-50' : ''}`}>Buddy Feed</span>
          </button>
          </li>
          </div>

          
          {/* Navigation items */}
          <div className="mt-auto">
                <>
                {hasBuddy ? (
                  <button className="flex items-center space-x-3 text-gray-700 hover:text-black p-2 w-full border-t border-gray-200" onClick={handleRemoveBuddyClick}>
                    <FontAwesomeIcon icon={faMinusSquare} className="w-5 h-5" />
                    <span>Remove Your Buddy</span>
                  </button>
              ) : (
                <button className="flex items-center space-x-3 text-gray-700 hover:text-black p-2 w-full border-t border-gray-200" onClick={handleLocalAddBuddyClick}>
                  <FontAwesomeIcon icon={faPlusSquare} className="w-5 h-5" />
                  <span className="flex-grow text-center">Add Buddy ID</span>
                </button>
              )}

              {isModalOpen && (
              <AddBuddyModal user_id={user_id} handleBuddySubmit={handleBuddySubmit} handleCloseModal={() => setModalOpen(false)} />
              )}
              
            </>

            <div className="notification-container">
            <button 
            className={`flex items-center space-x-3 text-gray-700 hover:text-black p-2 w-full border-t border-gray-200 ${buddyRequests.length > 0 ? 'has-notifications' : ''}`}
            onClick={toggleNotifications}
            >
            <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
            <span className="flex-grow text-center">Notifications</span>
            {buddyRequests.length > 0 && (
              <span className="notification-count">{buddyRequests.length}</span> // Shows the count of notifications
            )}
           </button>
           {showNotifications && <BuddyRequestDropdown />}
           </div>


           <button 
              onClick={handleSavedButtonClick} 
              className="flex items-center space-x-3 text-gray-700 hover:text-black p-2 w-full border-t border-gray-200"
            >
              <FontAwesomeIcon icon={faBookmark} className="w-5 h-5"/>
              <span className="flex-grow text-center">Saved</span>

          </button>
    
            <button 
              className="flex items-center space-x-3 text-gray-700 hover:text-black p-2 w-full border-t border-gray-200"
              onClick={() => setProfileView(prev => !prev)}
              
            >
              <FontAwesomeIcon icon={faUser} className="w-5 h-5"/>
              <span className="flex-grow text-center">My Account</span>
            </button>

            <button className="flex items-center space-x-3 text-gray-700 hover:text-black p-2 w-full border-t border-gray-200">
              <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5"/>
              <span className="flex-grow text-center">Log out</span>
            </button>
          </div>
          {/* Version number */}
          <div className="flex items-center space-x-3 text-gray-700 hover:text-black p-5 w-full border-t border-gray-400">
            <span className="flex-grow text-center text-xs">Version 0.01</span>
          </div>
        </ul>
      </div>
    </aside>
  );

}
export default Sidebar;

