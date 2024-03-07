import React, { useState } from 'react';
import './App.css'; // 确保样式文件的名字和路径正确

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

  const handleNewChat = () => {
    // 新建对话的逻辑
  };

  const handleUserLogin = () => {
    // 用户登录的逻辑
  };

  return (
    <div className="appContainer">
      <div className="sidebar">
        <button className="sidebarButton" onClick={handleNewChat}>New Chat</button>
        <button className="sidebarButton" onClick={handleUserLogin}>User Login</button>
        {/* 侧边栏的其他内容 */}
      </div>
      <div className="mainContent">
        <div className="container">
          <h1>Multi-Line Text Input</h1>
          <textarea
            className="textInput"
            value={textInput}
            onChange={(event) => setTextInput(event.target.value)}
            rows={4}
            cols={50}
          />
          <br />
          <button className="submitBtn" onClick={() => {}}>Submit</button>
          {isLoading && <p>Loading...</p>}
          {serverResponse && (
            <div className="serverResponse">
              <h2>Server Response:</h2>
              <p>{serverResponse}</p>
            </div>
          )}
          <button className="fetchBtn" onClick={() => {}}>Fetch WordPress Plugins</button>
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
      </div>
    </div>
  );
}

export default MultiLineTextInput;
