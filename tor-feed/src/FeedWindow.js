import React from 'react';
import FeedItem from './FeedItem'; // Ensure this component is properly defined

const FeedWindow = ({ items, feedId, currentTab, refreshFeedItems, user_id,savedItems,showSavedItems,fetchSavedItems }) => {

  console.log("Saved items:", savedItems);
  return (
    <div className="bg-white shadow rounded-lg p-6 flex flex-col space-y-4 min-h-[200px]">
      {showSavedItems ? (
        savedItems.length > 0 ? (
          savedItems.map((item) => (
            <div key={item.item_id} className="p-4 border-b border-gray-200">
              <div className="font-semibold">{item.content}</div>
              <div className="text-sm text-gray-500">{new Date(item.created_at).toLocaleString()}</div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No saved posts to show</div>
        )
      ) : (
        items.length > 0 ? (
          items.map((item) => (
            <FeedItem 
              key={item.item_id} 
              item={item}
              refreshFeedItems={refreshFeedItems}
              feedId={feedId}
              currentTab={currentTab} 
              user_id={user_id}
              fetchSavedItems={fetchSavedItems}
            />
          ))
        ) : (
          <div className="text-center text-gray-500">No posts to show</div>
        )
      )}
    </div>
  );
  
};

export default FeedWindow;


