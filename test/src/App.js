import React, {useState} from 'react';  /* imports the React object and the useState hook from the 'react' package.
                                            useState is a hook that allows functional components to manage state */
import './App.css'; // 确保样式文件的名字和路径正确    /* imports App.Css file which contains the styles which will be applied to elements*/
import logImage from './logo1.png';        // imports logo1.png image
import userLogImage from './logo.svg';      //imports logo.svg

function MultiLineTextInput() {       // renders a form with multi line text input fields
  const [textInput, setTextInput] = useState('');       // tracks the text input value
  const [serverResponse, setServerResponse] = useState('');   // tracks the response from the server
  const [plugins, setPlugins] = useState([]);   // tracks an array of plugins
  const [isLoading, setIsLoading] = useState(false);    // tracks whether the component is currently loading data
  const [chats, setChats] = useState([]); // 新增状态来追踪所有对话    // tracks an array of conversations
  const [activeChatId, setActiveChatId] = useState(null); // 当前活动对话的ID    // used to track the ID of the currently active conversation

  const handleSubmit = async () => {
    if (activeChatId) {           //Checks if there's an active chat. If there is an active chat, it proceeds with further actions.
      const activeChatIndex = chats.findIndex(chat => chat.id === activeChatId);   // method to find the index of the active chat within the chats array
      if (activeChatIndex >= 0) {           // This code is responsible for updating the messages in the active chat when the activeChatIndex is found
        // 更新活动对话的信息
        const updatedChats = [...chats];  // A shallow copy of the chats array is created using the spread operator [...chats]. This is done to avoid directly mutating the original state.
        updatedChats[activeChatIndex] = {     /* After this block executes, the updatedChats array contains the modified information of the active chat,
                                                  with the new user message appended to its messages array */
          ...updatedChats[activeChatIndex],
          messages: [...updatedChats[activeChatIndex].messages, {sender: 'user', text: textInput}],
        };
        setChats(updatedChats);    // using the setChats function to update the state of the chats

        // 发送信息给服务器并处理响应
        // This section of the code initiates a fetch request to send the text input to a server endpoint
        setIsLoading(true);   // True value indicates that the component is currently in a loading state.
        try {
          const response = await fetch('http://13.239.121.247:8080/upload_text', {   // initiates a post request to the URL
            method: 'POST',
            body: JSON.stringify({text: textInput}),       // The body option contains the text input data, which is converted to a JSON string
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.text();       //Once the server responds, the response data is extracted using response.text()
          setServerResponse(data);      // The response data is stored in the state variable serverResponse using the setServerResponse function

          // 更新活动对话的服务器响应
          // This part updates the active chat's messages to include the server response.
          updatedChats[activeChatIndex] = {
            ...updatedChats[activeChatIndex],
            messages: [...updatedChats[activeChatIndex].messages, {sender: 'server', text: data}],
          };
          setChats(updatedChats);   // updates the chat, making sure the changes are reflected
        } catch (error) {       // used to catch errors if they occur during submitting the text
          console.error('Error submitting text:', error);
        } finally {       // Always executed regardless of whether an error is caught or not
          setIsLoading(false);
        }

        // 清除输入框
        setTextInput('');     // This line clears the text input field by setting the textInput state variable to an empty string.
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
      showPlugins: false,
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
    if (!activeChatId) return; // 如果没有活动对话，则直接返回

    const activeChatIndex = chats.findIndex(chat => chat.id === activeChatId);
    if (activeChatIndex === -1) return; // 找不到活动对话则返回

    // 切换插件列表的显示状态
    const updatedChats = [...chats];
    const activeChat = updatedChats[activeChatIndex];

    // 如果尚未加载插件数据，则先进行加载
    if (!activeChat.plugins) {
      setIsLoading(true);
      try {
        const response = await fetch('https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[per_page]=10');
        const data = await response.json();
        activeChat.plugins = data.plugins;
      } catch (error) {
        console.error('Error fetching plugins:', error);
      } finally {
        setIsLoading(false);
      }
    }

    // 切换显示状态
    activeChat.showPlugins = !activeChat.showPlugins;
    setChats(updatedChats);
  };
  const Message = ({message}) => {
    return (
        <div className={`message ${message.sender === 'user' ? 'user' : 'server'}`}>
          {message.sender === 'user' && (
              <div className="userMessageWrapper">
                <img src={userLogImage} alt="User" className="userIcon"/>
              </div>
          )}
          <div className="messageContent">{message.text}</div>

          {message.sender === 'server' && (
              <div className="messageContent">{message.text}</div>
          )}
        </div>
    );
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
                /* <div key={index} className={`message ${message.sender}`}>
                   {message.text}
                 </div>*/
                <Message key={index} message={message}/>
            ))}

            <div className="logoArea">
              <img src={logImage} alt="WordPress Plugins" className="logo"/>
              <div><br/></div>
              <button className="fetchBtn" onClick={fetchPlugins}>
                &#x2B07; {/* Unicode character for down arrow */}
              </button>
            </div>
            {activeChatId && chats.find(chat => chat.id === activeChatId)?.showPlugins && (
                <div className="pluginsList">
                  <h2>WordPress Plugins:</h2>
                  <ul>
                    {chats.find(chat => chat.id === activeChatId)?.plugins?.map((plugin, index) => (
                        <li key={index}>{plugin.name} - {plugin.version}</li>
                    ))}
                  </ul>
                </div>
            )}
          </div>

          <div className="inputArea">
            <div className="textInputWrapper">
              <div className="inputIcon">&#x1F4AC;</div>
              {/* Example: Speech balloon Unicode character */}
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
            <p className="disclaimer">Tip: This AI can make mistakes. Consider checking important
              information.</p>
          </div>
          {isLoading && <p>Loading...</p>}
          {serverResponse && (
              <div className="serverResponse">
                <h2>Server Response:</h2>
                <p>{serverResponse}</p>
              </div>
          )}

        </div>
      </div>
  );
}

export default MultiLineTextInput;