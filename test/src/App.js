import React, { useState } from 'react';
import './App.css'; // 确保样式文件的名字和路径正确
import logImage from './logo1.png';

function MultiLineTextInput() {
  const [textInput, setTextInput] = useState('');
  const [serverResponse, setServerResponse] = useState('');
  const [plugins, setPlugins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]); // 新增状态来追踪所有对话
  const [activeChatId, setActiveChatId] = useState(null); // 当前活动对话的ID

  const handleSubmit = async () => {
    if (activeChatId) {
      const activeChatIndex = chats.findIndex(chat => chat.id === activeChatId);
      if (activeChatIndex >= 0) {
        // 更新活动对话的信息
        const updatedChats = [...chats];
        updatedChats[activeChatIndex] = {
          ...updatedChats[activeChatIndex],
          messages: [...updatedChats[activeChatIndex].messages, { sender: 'user', text: textInput }],
        };
        setChats(updatedChats);

        // 发送信息给服务器并处理响应
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
          // 更新活动对话的服务器响应
          updatedChats[activeChatIndex] = {
            ...updatedChats[activeChatIndex],
            messages: [...updatedChats[activeChatIndex].messages, { sender: 'server', text: data }],
          };
          setChats(updatedChats);
        } catch (error) {
          console.error('Error submitting text:', error);
        } finally {
          setIsLoading(false);
        }

        // 清除输入框
        setTextInput('');
      }
    }
  };

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };



  const handleNewChat = () => {
    const newChatId = Date.now();
    const newChat = {
      id: newChatId,
      messages: [], // 对话的消息记录
    };
    setChats([...chats, newChat]);
    setActiveChatId(newChatId); // 设置新对话为活动对话
    setServerResponse(''); // 清空之前的服务器响应
    setTextInput(''); // 清空文本输入
  };

  const handleUserLogin = () => {
    // 用户登录的逻辑
  };

  const handleChatClick = (chatId) => {
    setActiveChatId(chatId);
    // 你可能还想设置当前的textInput和serverResponse为选中对话的最后信息
    const activeChat = chats.find(chat => chat.id === chatId);
    if (activeChat && activeChat.messages.length > 0) {
      setTextInput(activeChat.messages[activeChat.messages.length - 1].text);
    } else {
      setTextInput('');
    }
    setServerResponse(''); // 假设切换对话时清空服务器响应
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
    <div className="appContainer">
      <div className="sidebar">
        <button className="sidebarButton" onClick={handleNewChat}>New Chat</button>
        <button className="sidebarButton" onClick={handleUserLogin}>User Login</button>
        {chats.map((chat, index) => (
          <div
            key={chat.id}
            className={`chatPreview ${chat.id === activeChatId ? 'active' : ''}`}
            onClick={() => handleChatClick(chat.id)}
          >
            Chat {index + 1}
          </div>
        ))}
      </div>
      <div className="mainContent">
        <div className="container">
          {activeChatId && chats.find(chat => chat.id === activeChatId)?.messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
          <div className="inputArea">
            <div className="textInputWrapper">
              <div className="inputIcon">&#x1F4AC;</div> {/* Example: Speech balloon Unicode character */}
              <textarea
                  className="textInput"
                  placeholder="Type your message here..."
                  value={textInput}
                  onChange={handleInputChange}
                  rows={1}
              />

            <button className="submitBtn" onClick={handleSubmit}>
              &#x2B06; {/* Unicode character for up arrow */}
            </button>
            </div>
            <p className="disclaimer">Tip: This AI can make mistakes. Consider checking important information.</p>
          </div>


          {isLoading && <p>Loading...</p>}
          {serverResponse && (
            <div className="serverResponse">
              <h2>Server Response:</h2>
              <p>{serverResponse}</p>
            </div>
          )}


          <div className="logoArea">
            <img src={logImage} alt="WordPress Plugins" className="logo" />
            <div><br/></div>

            <button className="fetchBtn" onClick={fetchPlugins}>
              &#x2B07; {/* Unicode character for down arrow */}

            </button>

          </div>




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