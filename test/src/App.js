import React, { useState } from 'react';
import './App.css';

function MultiLineTextInput() {
  const [textInput, setTextInput] = useState('');
  const [serverResponse, setServerResponse] = useState('');
  const [plugins, setPlugins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]); // 追踪所有对话
  const [activeChatId, setActiveChatId] = useState(null); // 当前活动对话的ID

  const handleSubmit = async () => {
    // ...处理提交逻辑，需要根据 activeChatId 更新对应的对话
  };

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
    // 如果需要实时更新活动对话的textInput，需要在此实现
  };

  const fetchPlugins = async () => {
    // ...处理获取插件逻辑
  };

  const handleNewChat = () => {
    const newChatId = Date.now();
    setChats([...chats, { id: newChatId, messages: [] }]);
    setActiveChatId(newChatId);
    // 清除主输入区域
    setTextInput('');
    setServerResponse('');
  };

  const handleUserLogin = () => {
    // ...处理用户登录逻辑
  };

  const handleChatClick = (chatId) => {
    setActiveChatId(chatId);
    // 还可以在此处设置 activeChat 的其他状态，例如 textInput 和 serverResponse
    const activeChat = chats.find(chat => chat.id === chatId);
    if (activeChat) {
      setTextInput(''); // 假设每次点击都清空文本输入
      // setServerResponse(activeChat.lastResponse); // 假设你保存了最后的响应
    }
  };

  return (
    <div className="appContainer">
      <div className="sidebar">
        <button className="sidebarButton" onClick={handleNewChat}>New Chat</button>
        <button className="sidebarButton" onClick={handleUserLogin}>User Login</button>
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`chatPreview ${chat.id === activeChatId ? 'active' : ''}`}
            onClick={() => handleChatClick(chat.id)}
          >
            Chat {chat.id}
          </div>
        ))}
      </div>
      <div className="mainContent">
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
          {/* 加载和服务器响应状态展示 */}
          {isLoading && <p>Loading...</p>}
          {serverResponse && (
            <div className="serverResponse">
              <h2>Server Response:</h2>
              <p>{serverResponse}</p>
            </div>
          )}
          {/* 获取插件按钮和插件列表 */}
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
      </div>
    </div>
  );
}

export default MultiLineTextInput;
