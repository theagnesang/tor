// src/FeedPage.js
import React, { useState, useEffect,useCallback  } from 'react';
import FeedWindow from './FeedWindow';
import SideBar from './SideBar';
import PostMessage from './PostMessage';
import ToDoList from './ToDoList';
import ProfileSettings from './Profile';
import PromptOfTheDay from './PromptOfTheDay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';


async function fetchFeedId(feedType, userId) {
  
  const response = await fetch(`http://localhost:3000/api/UserFeedId?user_id=${userId}`, {
    credentials: 'include'
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data);

    // Access the first object in the array
    const feedData = data[0];

    if (feedType === 'private') {
      return feedData.private_feedid;
    } else if (feedType === 'buddy') {
      return feedData.shared_feedid;
    }
  } else {
    const textResponse = await response.text();
    throw new Error(`Failed to fetch feed items ${textResponse}`);
  }
}

async function fetchFeedItems(feedType, feedId) {

  let url;
  if (feedType === 'private') {
    url = `http://localhost:3000/api?private_feedid=${feedId}`;
  }else {
    url = `http://localhost:3000/api?shared_feedid=${feedId}`;
  }

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  });
  
  if (response.ok) {
    console.log('returning items')
    const items = await response.json();
    return items;
  } else {
    const textResponse = await response.text();
    throw new Error(`Failed to fetch feed items ${textResponse}`);
  }

  
}

const FeedPage = (toggleTheme) => {
  const [currentTab, setCurrentTab] = useState('private');
  const [feedItems, setFeedItems] = useState([]);
  const [refreshFeed, setRefreshFeed] = useState(false);
  const [userId, setUserId] = useState(null);
  const [buddyId, setBuddyId] = useState(null);
  const [feedId, setFeedId] = useState(null);
  const [hasBuddy, setHasBuddy] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [savedItems, setSavedItems] = useState([]);
  const [ProfileView, setProfileView] = useState(false);
  const [showSavedItems,setShowSavedItems] = useState(false);
  const [theme, setTheme] = useState('light'); // Assuming 'light' as default
  const themeClassName = theme === 'dark' ? 'dark-mode' : '';
  
  const fetchSavedItems = useCallback(async () => {
    try {
      const savedItemsResponse = await fetch(`http://localhost:3000/api/allSavedItem?user_id=${userId}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
  
      if (!savedItemsResponse.ok) {
        throw new Error('Unable to get all saved feed items');
      }
      const savedItemsData = await savedItemsResponse.json();
      const itemIds = savedItemsData.map(item => item.item_id);
      const itemIdsString = itemIds.join(',');
  
      const feedItemsResponse = await fetch(`http://localhost:3000/api/feedItem?item_id=${itemIdsString}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
  
      if (!feedItemsResponse.ok) {
        throw new Error('Unable to get all saved feed items content');
      }
      const feedItemsData = await feedItemsResponse.json();
      setSavedItems(feedItemsData); // Assuming this is an array of saved items
      console.log(savedItems)
    } catch (error) {
      console.error('Error fetching saved items:', error);
    }
  },[savedItems,userId]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
  const fetchBuddyStatus = useCallback(async () => {
    if (userId) {
      try {
        const userIdInt = parseInt(userId, 10);
        const response = await fetch(`http://localhost:3000/api/UserFeedId?user_id=${userIdInt}`, {
          credentials: 'include'
        });
        const data = await response.json();
        console.log("calling fetchBuddyStatus", parseInt(data[0].buddy_id, 10));
        if (parseInt(data[0].buddy_id, 10) !== -1) {
          setHasBuddy(true); 
          setBuddyId(parseInt(data[0].buddy_id, 10));
        }
      } catch (error) {
        console.error('Error fetching buddy status:', error);
      }
    }
  }, [userId]); // dependency array includes all dependencies of this callback
  
    const refreshFeedItems = () => {
    setRefreshFeed(prev => !prev);
  };
  
  const handleNewPost = (newPost) => {
    setFeedItems([newPost, ...feedItems]);
  };

  useEffect(() => {
    fetchBuddyStatus();
  }, [fetchBuddyStatus]); // now you can safely add fetchBuddyStatus to the dependencies array
  
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/userinfo', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setUserId(parseInt(data.user_id,10));
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserId();
  }, []);
  
  useEffect(() => {
    const fetchAndSetItems = async () => {
      try {
        const fetchedFeedId = await fetchFeedId(currentTab, userId);
        if (fetchedFeedId) {
          const items = await fetchFeedItems(currentTab, fetchedFeedId);
          setFeedItems(items);
          setFeedId(fetchedFeedId);
        } else {
          console.error("No feedId returned from fetchFeedId");
        }
      } catch (error) {
        console.error("Error fetching feed items or feedId:", error);
      }
    };
  
    if (userId) { // Assuming you want to run this only if userId is available
      fetchAndSetItems();
    }
  }, [currentTab, userId, refreshFeed]); // Dependency array

  useEffect(() => {
    // Fetch the current theme preference from the API
    fetch('http://localhost:3000/api/screenpreference')
      .then(response => response.json())
      .then(data => setTheme(data.theme)) // Assuming the response contains a 'theme' field
      .catch(error => console.error('Error fetching theme preference:', error));
  }, [userId]);

  return (
    <div className={`feed-page ${themeClassName}`}>
      <div className={isSidebarVisible ? "newsfeed-grid-container" : "toggled-newsfeed-grid-container"} >
            {/* Hide/Show Sidebar Button */}
            <button 
            onClick={toggleSidebar} 
            disabled={ProfileView}
            className={`focus:outline-none absolute top-1/2 transform -translate-y-1/2 ${isSidebarVisible ? 'left-60' : 'left-0'} bg-gray-200 p-1.5 rounded-md`}
          >
            <FontAwesomeIcon icon={isSidebarVisible ? faArrowLeft : faArrowRight} />
          </button>

          {/* Sidebar */}
          {isSidebarVisible && (
            <SideBar currentTab={currentTab} 
                    onSelectTab={setCurrentTab} 
                    user_id={userId}
                    hasBuddy={hasBuddy}
                    setHasBuddy={setHasBuddy}
                    buddyId={buddyId} 
                    setProfileView={setProfileView}
                    toggleTheme={toggleTheme}
                    setTheme={setTheme}
                    setShowSavedItems={setShowSavedItems}
                    fetchSavedItems={fetchSavedItems}
            />
          )}
          {!ProfileView && (
            <div className="item-grid-container">
            {/* Main content area */}
              <div className="item-column-grid-container bg-white shadow p-4 items-center rounded-lg" style={{ maxHeight: '755px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                {/* PostMessage component will go here */}
                <PostMessage 
                  items={feedItems} 
                  onPostSubmit={handleNewPost} 
                  currentTab={currentTab} 
                  feedId={feedId}
                  user_id={userId}
                />
              </div>

                {/* Feed window - Only this part will scroll */}
                
              <div className="overflow-y-auto" style={{maxHeight: '685px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                <FeedWindow 
                  items={feedItems} 
                  refreshFeedItems={refreshFeedItems}
                  currentTab={currentTab}
                  feedId={feedId}
                  user_id={userId}
                  savedItems={savedItems}
                  fetchSavedItems={fetchSavedItems}
                  showSavedItems={showSavedItems}
                  />
              </div>
            </div>
          )}
          {ProfileView && (
            
            <ProfileSettings 
            user_id={userId}
            setTheme={setTheme}
            theme={theme}
            />
    
          )}

            {/* Right sidebar for To-Do List and Prompt of the Day */}
            <div className="flex flex-col">
              <ToDoList /> {/* To-Do List */}
              <PromptOfTheDay /> {/* Prompt of the Day */}
              </div>
      </div>
    </div>
  );
};

export default FeedPage;
