document.getElementById('template-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const requirements = document.getElementById('requirements').value;
    console.log('Requirements:', requirements); // 调试输出
    try {
        const response = await fetch('http://54.66.206.5:8080/upload_text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: requirements })
        });
        console.log('Response status:', response.status); // 调试输出
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Response data:', data); // 调试输出
        const gptResponse = data.gpt_response;
        console.log('GPT Response:', gptResponse); // 调试输出

        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <h2>Generated Code:</h2>
            <pre>${gptResponse}</pre>
            <button id="create-page-btn">Create WordPress Page</button>
        `;

        document.getElementById('create-page-btn').addEventListener('click', async () => {
            const pageTitle = prompt("Enter the title for the new page:");
            if (pageTitle) {
                try {
                    const createResponse = await fetch('http://your-wordpress-site.com/wp-json/custom/v1/create_page', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ title: pageTitle, content: gptResponse })
                    });
                    console.log('Create page response status:', createResponse.status); // 调试输出
                    if (!createResponse.ok) {
                        throw new Error(`HTTP error! status: ${createResponse.status}`);
                    }
                    const createData = await createResponse.json();
                    console.log('Create page response data:', createData); // 调试输出
                    alert(`Page created successfully with ID: ${createData.page_id}`);
                } catch (error) {
                    console.error('Error creating page:', error);
                }
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
});
