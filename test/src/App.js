import React, { useState } from 'react';

function MultiLineTextInput() {
  const [textInput, setTextInput] = useState('');
  const [serverResponse, setServerResponse] = useState('');
  const [plugins, setPlugins] = useState([]);

  const handleSubmit = async () => {
    try {
      // 这里替换成你的服务器地址
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
    }
  };

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const fetchPlugins = async () => {
    try {
      const response = await fetch('https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[per_page]=10');
      const data = await response.json();
      setPlugins(data.plugins);
    } catch (error) {
      console.error('Error fetching plugins:', error);
    }
  };

  return (
    <div>
      <h1>Multi-Line Text Input</h1>
      <textarea
        value={textInput}
        onChange={handleInputChange}
        rows={4}
        cols={50}
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
      <br />
      {serverResponse && (
        <div>
          <h2>Server Response:</h2>
          <p>{serverResponse}</p>
        </div>
      )}
      <button onClick={fetchPlugins}>Fetch WordPress Plugins</button>
      {plugins.length > 0 && (
        <div>
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
