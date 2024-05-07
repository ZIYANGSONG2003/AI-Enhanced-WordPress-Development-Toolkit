import React, { useState } from 'react';
import './Home.css'; // 确保这是您的 CSS 文件的正确路径
import logoImage from './logo1.png'; // 更新此路径为您的实际 logo 图片
import userAvatar from './user_avatar.png'; // 用户头像图片
import serverAvatar from './server_avatar.png'; // 服务器（GPT）头像图片

function MultiLineTextInput() {
    const [textInput, setTextInput] = useState('');
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async () => {
        if (!textInput.trim() || !activeChatId) {
            console.log('Empty text input or no active chat selected.');
            return;
        }

        console.log(`Attempting to send message: ${textInput} to chat ID: ${activeChatId}`);

        const newMessage = { sender: 'user', text: textInput, avatar: userAvatar };
        const updatedChats = chats.map(chat =>
            chat.id === activeChatId ? { ...chat, messages: [...chat.messages, newMessage] } : chat
        );

        setChats(updatedChats);
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
            console.log('Response received:', data);

            const serverMessage = { sender: 'server', text: data.gpt_response, avatar: serverAvatar };
            const updatedChatsWithResponse = chats.map(chat =>
                chat.id === activeChatId ? { ...chat, messages: [...chat.messages, serverMessage] } : chat
            );

            setChats(updatedChatsWithResponse);
        } catch (error) {
            console.error('Error submitting text:', error);
            setErrorMessage('Failed to send message. Please try again later.');
        } finally {
            setIsLoading(false);
        }

        setTextInput('');
    };

    const handleInputChange = (event) => {
        setTextInput(event.target.value);
    };

    const handleNewChat = () => {
        const newChatId = Date.now();
        setActiveChatId(newChatId);
        setChats([...chats, { id: newChatId, messages: [] }]);
    };

    const handleChatClick = (chatId) => {
        setActiveChatId(chatId);
        const activeChat = chats.find(chat => chat.id === chatId);
        setTextInput(activeChat?.messages[activeChat.messages.length - 1]?.text || '');
    };

    return (
        <div className="appContainer">
            <div className="sidebar">
                <button className="sidebarButton" onClick={handleNewChat}>New Chat</button>
                {chats.map((chat, index) => (
                    <div key={chat.id} className={`chatPreview ${chat.id === activeChatId ? 'active' : ''}`} onClick={() => handleChatClick(chat.id)}>
                        Chat {index + 1}
                    </div>
                ))}
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
                {errorMessage && <div className="errorResponse"><p>{errorMessage}</p></div>}
            </div>
        </div>
    );
}

export default MultiLineTextInput;
