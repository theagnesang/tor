import React from 'react';


export async function handleBuddySubmit(buddyId,user_id) {
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
        alert(`You have already sent a buddy request to ${buddyId}`);
      }
    } catch (error) {
      alert('Network error: Could not send buddy request.');
    }
  };
  
  export async function fetchBuddyRequests(user_id) {
    try {
      const response = await fetch(`http://localhost:3000/api/BuddyRequestResponse?recipient_id=${user_id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          // Include other necessary headers
        }
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
        console.error('Network error:', error);
        return null; // Or handle errors as needed
    }
  };
  
  export async function respondToBuddyRequest(user_id, requestorId, status) {
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
        return { success: true, accepted: status === 'accepted' };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error('Error:', error);
      return { success: false, error };
    }
  };

export async function updateSharedFeedId (user_id,requestorId) {
    try {
      const response = await fetch('http://localhost:3000/api/UserFeedId', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ buddy_id: user_id, user_id: requestorId
        }), //user_is is now  the buddy. 
      });
  
      return response.ok;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
  };

  const fetchShared_feedid = async (user_id) => {

    try {
    const response = await fetch(`http://localhost:3000/api/SharedFeedId?user_id=${user_id}`, {
        credentials: 'include'
        });
        const data = await response.json();
        return data[0].shared_feedid;
    }catch (error) {
        console.error('Error fetching shared feed id:', error);
    }

    };

export async function handleRemoveBuddyClick(user_id,buddyId) {

    const sharedFeedIdData = await fetchShared_feedid(user_id);

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

      const response3 = await fetch('http://localhost:3000/api/feedItem', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shared_feedid: sharedFeedIdData}), 
      });
  
      if (!response3.ok) {
        throw new Error('Failed to delete sharedfeed_id post');
      }

      const response4 = await fetch('http://localhost:3000/api/SharedFeedId', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user_id}), 
      });
  
      if (!response4.ok) {
        throw new Error('Failed to update sharedfeed_id');
      }
  
      // Update local state to reflect buddy removal
      return true;
    } catch (error) {
      console.error('Error removing buddy:', error);
      alert('Error removing buddy.');
    }
  };