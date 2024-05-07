import React, { useState } from 'react';
import './Home.css'; // Ensure this is the correct path to your CSS file
import logoImage from './logo1.png'; // Update this path to your actual logo image
import userAvatar from './user_avatar.png'; // User avatar image
import serverAvatar from './server_avatar.png'; // Server (GPT) avatar image


function MultiLineTextInput() {
    const [textInput, setTextInput] = useState('');
    const [serverResponse, setServerResponse] = useState('');
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
            setServerResponse(data.gpt_response);
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
                            <div className="messageContent">{message.text}</div>
                        </div>
                    ))}
                </div>

                <div className="inputArea">
                    <textarea className="textInput" placeholder="Type your message here..." value={textInput} onChange={handleInputChange} disabled={isLoading}/>
                    <button className="submitBtn" onClick={handleSubmit} disabled={isLoading}>&#9654;</button>
                </div>
                {serverResponse && <div className="serverResponse"><p>{serverResponse}</p></div>}
                {errorMessage && <div className="errorResponse"><p>{errorMessage}</p></div>}
            </div>
        </div>
    );
}

export default MultiLineTextInput;