// MultiLineTextInput.js

import React, { useState } from 'react';
import './App.css'; // 确保你的样式文件也叫这个名字

function MultiLineTextInput() {
  const [textInput, setTextInput] = useState('');
  const [serverResponse, setServerResponse] = useState('');
  const [plugins, setPlugins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://13.239.121.247:8080/upload_text', {
        method: 'POST',
        body: JSON.stringify({ text: textInput }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.text();
      setServerResponse(data);
    } catch (error) {
      console.error('Error submitting text:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const fetchPlugins = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[per_page]=10');
      const data = await response.json();
      setPlugins(data.plugins);
    } catch (error) {
      console.error('Error fetching plugins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Multi-Line Text Input</h1>
      <textarea
        className="textInput"
        value={textInput}
        onChange={handleInputChange}
        rows={4}
        cols={50}
      />
      <br />
      <button className="submitBtn" onClick={handleSubmit}>Submit</button>
      {isLoading && <p>Loading...</p>}
      {serverResponse && (
        <div className="serverResponse">
          <h2>Server Response:</h2>
          <p>{serverResponse}</p>
        </div>
      )}
      <button className="fetchBtn" onClick={fetchPlugins}>Fetch WordPress Plugins</button>
      {plugins.length > 0 && (
        <div className="pluginsList">
          <h2>WordPress Plugins:</h2>
          <ul>
            {plugins.map((plugin, index) => (
              <li key={index}>{plugin.name} - {plugin.version}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MultiLineTextInput;
