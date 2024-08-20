import openai
import json
import requests
import time

# Load your API key
openai.api_key = ""

# Load and preprocess data
dataset_path = r'AI-Enhanced-WordPress-Development-Toolkit\GPT_model\GPT3.5\data.jsonl'
with open(dataset_path, 'r', encoding='utf-8') as file:
    raw_data = [json.loads(line) for line in file]

formatted_data = []
for entry in raw_data:
    messages = entry.get("messages", [])
    if messages:
        chat_messages = []
        for message in messages:
            role = message.get("role")
            content = message.get("content", "")
            if role and content:
                chat_messages.append({
                    "role": role,
                    "content": content
                })

        formatted_data.append({
            "messages": chat_messages
        })

# Save preprocessed data to a JSONL file
formatted_data_path = r'AI-Enhanced-WordPress-Development-Toolkit\formatted_data.jsonl'
with open(formatted_data_path, 'w', encoding='utf-8') as outfile:
    for entry in formatted_data:
        json.dump(entry, outfile)
        outfile.write('\n')

# Upload the preprocessed data file
upload_response = openai.File.create(
    file=open(formatted_data_path, "rb"),
    purpose='fine-tune'
)

# Confirm file upload
print("Upload Response:", upload_response)

# Get the file ID
file_id = upload_response['id']  # Use the uploaded file ID

# Make the fine-tuning request
fine_tune_response = requests.post(
    'https://api.openai.com/v1/fine_tuning/jobs',
    headers={
        'Authorization': f'Bearer {openai.api_key}',
        'Content-Type': 'application/json'
    },
    json={
        'training_file': file_id,
        'model': 'gpt-3.5-turbo-0613'
    }
)


# Print the fine-tuning response
fine_tune_job_id = fine_tune_response.json().get('id')
print("Fine-Tuning Response:", fine_tune_response.json())

# Check the status of the fine-tuning job
while True:
    status_response = requests.get(
        f'https://api.openai.com/v1/fine_tuning/jobs/{fine_tune_job_id}',
        headers={
            'Authorization': f'Bearer {openai.api_key}'
        }
    )
    status_data = status_response.json()
    print("Fine-Tuning Job Status Response:", status_data)

    if status_data.get('status') in ['succeeded', 'failed']:
        break

    # Wait for 30 seconds before checking again
    time.sleep(30)
