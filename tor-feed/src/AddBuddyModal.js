import React, { useState } from 'react';


async function checkBuddyExists(buddyId) {
  try {
    const response = await fetch(`http://localhost:3000/api/UserFeedId?user_id=${buddyId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.length > 0 && 'shared_feedid' in data[0]; // Assuming the API returns { exists: true/false }
  } catch (error) {
    console.error('Error while checking buddy:', error);
    return false;
  }
}

function AddBuddyModal({handleBuddySubmit, handleCloseModal,user_id}) {
    const [buddyId, setBuddyId] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const buddyExists = await checkBuddyExists(buddyId);
      if (!buddyExists) {
        alert('Buddy ID does not exist.');
        return;
      }
      if (buddyId === user_id) {
        alert('Buddy ID cannot be the same as user ID.');
      } else {
        handleBuddySubmit(buddyId,user_id);
        handleCloseModal();
      }

    };
  
   return (
  <div className="modal">
    <form onSubmit={handleSubmit} className="flex items-center space-x-1 p-2 border-gray-300 rounded">
      <input
        type="text"
        value={buddyId}
        onChange={(e) => setBuddyId(e.target.value)}
        placeholder="Enter Buddy ID"
        className="flex-1 p-1 text-xs border-2 border-gray-300 rounded"
      />
    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 text-xxs rounded">
      Submit
    </button>

    </form>
  </div>
);
  }

  export default AddBuddyModal;