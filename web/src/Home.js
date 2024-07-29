import React, { useState } from 'react';
import './Home.css'; // 确保这是您的 CSS 文件的正确路径
import logoImage from './logo1.png'; // 更新此路径为您的实际 logo 图片
import userAvatarDefault from './user_avatar.png'; // 用户默认头像图片
import serverAvatar from './server_avatar.png'; // 服务器（GPT）头像图片

function MultiLineTextInput() {
    const [textInput, setTextInput] = useState('');
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [userAvatar, setUserAvatar] = useState(userAvatarDefault); // 新增状态用于存储用户头像

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setUserAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarClick = () => {
        document.getElementById('avatarInput').click();
    };

    const handleSubmit = async () => {
        if (!textInput.trim() || !activeChatId) {
            console.log('Empty text input or no active chat selected.');
            return;
        }

        const newMessage = { sender: 'user', text: textInput, avatar: userAvatar };
        // Optimistically update UI immediately
        updateChatMessages(newMessage);

        setIsLoading(true);

        try {
            const response = await fetch('http://54.66.206.5:8080/upload_text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textInput }),
            });

            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }

            const data = await response.json();
            const serverMessage = { sender: 'server', text: data.gpt_response, avatar: serverAvatar };
            // Update chat with server response
            updateChatMessages(serverMessage);
        } catch (error) {
            console.error('Error submitting text:', error);
            updateChatError('Failed to send message. Please try again later.');
        } finally {
            setIsLoading(false);
            setTextInput(''); // 确保在提交完成后清空输入框
        }
    };

    const updateChatMessages = (message) => {
        setChats(chats => chats.map(chat =>
            chat.id === activeChatId ? { ...chat, messages: [...chat.messages, message], error: '' } : chat
        ));
    };

    const updateChatError = (error) => {
        setChats(chats => chats.map(chat =>
            chat.id === activeChatId ? { ...chat, error } : chat
        ));
    };

    const handleInputChange = (event) => {
        setTextInput(event.target.value);
    };

    const handleNewChat = () => {
        const newChatId = Date.now();
        setActiveChatId(newChatId);
        setChats([...chats, { id: newChatId, messages: [], error: '' }]);
    };

    const handleChatClick = (chatId) => {
        setActiveChatId(chatId);
        setTextInput(''); // 确保在选择不同的聊天时清空输入框
    };

    return (
        <div className="appContainer">
            <a href="https://wordpress.com/home/nickysong1029.wordpress.com" target="_blank" className="wordpressButton">Go to WordPress</a>
            <div className="sidebar">
                <div className="sidebarTop">
                    <button className="sidebarButton" onClick={handleNewChat}>New Chat</button>
                    {chats.map((chat, index) => (
                        <div key={chat.id} className={`chatPreview ${chat.id === activeChatId ? 'active' : ''}`} onClick={() => handleChatClick(chat.id)}>
                            Chat {index + 1}
                        </div>
                    ))}
                </div>
                <div className="sidebarBottom">
                    <div className="avatarContainer">
                        <input type="file" id="avatarInput" style={{ display: 'none' }} onChange={handleAvatarChange} />
                        <img src={userAvatar} alt="User Avatar" className="userAvatar" onClick={handleAvatarClick} />
                    </div>
                </div>
            </div>

            <div className="mainContent">
                <div className="logoArea">
                    <img src={logoImage} alt="Logo" className="logo"/>
                </div>
                <div className="container">
                    {activeChatId && chats.find(chat => chat.id === activeChatId)?.messages.map((message, index) => (
                        <div key={index} className={`message ${message.sender === 'user' ? 'user' : 'server'}`}>
                            <img src={message.avatar} alt={`${message.sender} Avatar`} className="messageAvatar"/>
                            <div className={`${message.sender === 'user' ? 'messageContent' : 'messageText'}`}>
                                {message.text}
                            </div>
                            <div className="nameTag">{message.sender === 'user' ? 'YOU' : 'GPT'}</div>
                        </div>
                    ))}
                </div>

                <div className="inputArea">
                    <textarea className="textInput" placeholder="Type your message here..." value={textInput} onChange={handleInputChange} disabled={isLoading}/>
                    <button className="submitBtn" onClick={handleSubmit} disabled={isLoading}>&#9654;</button>
                </div>
                {activeChatId && chats.find(chat => chat.id === activeChatId)?.error && (
                    <div className="errorResponse">
                        <p>{chats.find(chat => chat.id === activeChatId)?.error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MultiLineTextInput;
