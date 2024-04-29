import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests  # Import requests to make API calls

app = Flask(__name__)
CORS(app)

GPT_API_URL = 'https://api.openai.com/v1/engines/davinci-codex/completions'  # Use the appropriate API URL
GPT_API_KEY = os.environ.get('GPT_API_KEY')  # Get the API key from an environment variable

@app.route('/upload_text', methods=['POST'])
def upload_text():
    text = request.json.get('text')
    if text:
        headers = {
            'Authorization': f'Bearer {GPT_API_KEY}',
            'Content-Type': 'application/json'
        }
        payload = {
            'prompt': text,
            'max_tokens': 150  # Adjust as needed
        }
        response = requests.post(GPT_API_URL, headers=headers, json=payload)
        if response.status_code == 200:
            gpt_response = response.json().get('choices', [{}])[0].get('text')
            return jsonify({'gpt_response': gpt_response})
        else:
            return jsonify({'error': 'Error from GPT API'}), response.status_code
    else:
        return jsonify({'error': 'No text provided'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
