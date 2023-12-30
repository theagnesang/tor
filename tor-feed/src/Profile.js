import React, { useState, useEffect } from 'react';

const timezones = [
  { label: "GMT-12:00", value: "Etc/GMT+12" },
  { label: "GMT-11:00", value: "Etc/GMT+11" },
  { label: "GMT-10:00", value: "Etc/GMT+10" },
  { label: "GMT-09:00", value: "Etc/GMT+09" },
  { label: "GMT-08:00", value: "Etc/GMT+08" },
  { label: "GMT-07:00", value: "Etc/GMT+07" },
  { label: "GMT-06:00", value: "Etc/GMT+06" },
  { label: "GMT-05:00", value: "Etc/GMT+05" },
  { label: "GMT-04:00", value: "Etc/GMT+04" },
  { label: "GMT-03:00", value: "Etc/GMT+03" },
  { label: "GMT-02:00", value: "Etc/GMT+02" },
  { label: "GMT-01:00", value: "Etc/GMT+1" },
  { label: "GMT+00:00", value: "Etc/GMT" },
  { label: "GMT+01:00", value: "Etc/GMT-1" },
  { label: "GMT+02:00", value: "Etc/GMT-2" },
  { label: "GMT+03:00", value: "Etc/GMT-3" },
  { label: "GMT+04:00", value: "Etc/GMT-4" },
  { label: "GMT+05:00", value: "Etc/GMT-5" },
  { label: "GMT+06:00", value: "Etc/GMT-6" },
  { label: "GMT+07:00", value: "Etc/GMT-7" },
  { label: "GMT+08:00", value: "Etc/GMT-8" },
  { label: "GMT+09:00", value: "Etc/GMT-9" },
  { label: "GMT+10:00", value: "Etc/GMT-10" },
  { label: "GMT+11:00", value: "Etc/GMT-11" },
  { label: "GMT+12:00", value: "Etc/GMT-12" },
  { label: "GMT+13:00", value: "Etc/GMT-13" },
  { label: "GMT+14:00", value: "Etc/GMT-14" }
];


const ProfileSettings = ({ user_id,setTheme,theme}) => {
  // State for each field
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [contentType, setContentType] = useState('');
  const [countries, setCountries] = useState([]);
  const [updateMessage, setUpdateMessage] = useState('');

  const [updateMessages, setUpdateMessages] = useState({
    firstName: '',
    lastName: '',
    country: '',
    timeZone: '',
    contentType: ''
  });

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // Update the theme preference on the server
    fetch('http://localhost:3000/api/screenpreference', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: newTheme, user_id: user_id })
    })
    .then(response => {
      if (response.ok) {
        setUpdateMessage('Theme updated successfully!');
        setTimeout(() => setUpdateMessage(''), 5000);
      } else {
        throw new Error('Failed to update theme');
      }
    })
    .catch(error => {
      console.error('Error updating theme:', error);
      setUpdateMessage('Error updating theme');
    });
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
  
      // Extracting the official country names
      const countryNames = [''].concat(data
        .sort((a, b) => a.name.common.localeCompare(b.name.common))
        .map(country => country.name.common));      
      return countryNames;
    } catch (error) {
      console.error('Error fetching countries:', error);
      return []; // Return an empty array in case of an error
    }
  };



const handleSubmit = async (e) => {
  e.preventDefault();

  const updateField = async (field, value) => {
    const response = await fetch(`http://localhost:3000/api/${field}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value, user_id:user_id })
    });

    if (response.ok) {
      // Update success message for this field
      setUpdateMessages(prev => ({ ...prev, [field]: 'Update successful!' }));
    } else {
      // Handle errors
      console.error('Error updating', field);
      // Optionally, set an error message
    }
  };

  await updateField('firstname', firstName);
  await updateField('lastname', lastName);
  await updateField('country', country);
  await updateField('timezone', timeZone);
  await updateField('contenttype', contentType);

  // Optionally, reset messages after some time
  setTimeout(() => setUpdateMessages({ firstName: '', lastName: '', country: '', timeZone: '', contentType: '' }), 5000);
};

  useEffect(() => {
    const getCountries = async () => {
      const countryNames = await fetchCountries();
      setCountries(countryNames);
    };

    getCountries();
  }, []);




  // setUserName


  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    // Handle the file upload logic (e.g., sending it to a server)
  };
  return (
    <div className='toggled-profile-grid-container bg-white shadow p-4 items-center rounded-lg'> 
      <form onSubmit={handleSubmit}>
        
        <div className="border-b border-gray-200 py-2">
          <label>First Name:</label>
          <input
            type="text"
            className="border-2 border-gray-200 focus:border-blue-300 rounded p-2"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
          <span>{updateMessages.firstName}</span>
        </div>
  
        <div className="border-b border-gray-200 py-2">
          <label>Last Name:</label>
          <input
            type="text"
            className="border-2 border-gray-200 focus:border-blue-300 rounded p-2"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
          <span>{updateMessages.lastName}</span>
        </div>
  
        <div className="border-b border-gray-200 py-2">
          <label>
            Country:
            <select value={country} onChange={e => setCountry(e.target.value)} className="border-2 border-gray-200 focus:border-blue-300 rounded p-2">
            <option value="" disabled>Select a country</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>{country}</option>
              ))}
            </select>
          </label>
          <span>{updateMessages.country}</span>
        </div>
  
        <div className="border-b border-gray-200 py-2">
          <label>
            Time Zone:
            <select value={timeZone} onChange={e => setTimeZone(e.target.value)} className="border-2 border-gray-200 focus:border-blue-300 rounded p-2">
              {timezones.map((tz, index) => (
                <option key={index} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </label>
          <span>{updateMessages.timeZone}</span>
        </div>
  
        <div className="border-b border-gray-200 py-2">
          <label>Content Type:</label>
          <select value={contentType} onChange={e => setContentType(e.target.value)} className="border-2 border-gray-200 focus:border-blue-300 rounded p-2">
            <option value="short_form_writing">Short-Form Writing (e.g. tweeter)</option>
            <option value="short_form_video">Short-Form Video (e.g. TikTok, Youtube Shorts)</option>
            <option value="long_form_writing">Long-Form Writing (e.g. Medium)</option>
            <option value="long_form_video">Long-Form Video (e.g. Youtube)</option>
            <option value="mid_form_writing_design">Mid-Form Writing & Design (e.g. Instagram)</option>
            <option value="mid_form_writing">Mid-Form Writing (e.g. Medium, Linkedin)</option>
          </select>
          <span>{updateMessages.contentType}</span>
        </div>
        {/*<div>
          <label>Profile Picture:</label>
          <input
            type="file"
            onChange={handleFileUpload}
          />
          
        </div>

         <div className='settings-container bg-white shadow p-4 items-center rounded-lg'>
          <div>
            <h2>Screen Preferences</h2>
            <button 
              onClick={() => handleThemeChange('light')} 
              disabled={theme === 'light'}
            >
              Light Mode
            </button>
            <button 
              onClick={() => handleThemeChange('dark')} 
              disabled={theme === 'dark'}
            >
              Dark Mode
            </button>
            {updateMessage && <span>{updateMessage}</span>}
          </div>
        </div> */}
  
        <div className="border-b border-gray-200 py-2">
          <label></label> {/* Empty label for alignment */}
              <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out mt-4 text-center">
              Save
              </button>
        </div>
      </form>
    </div>
  );
  
};

export default ProfileSettings;
