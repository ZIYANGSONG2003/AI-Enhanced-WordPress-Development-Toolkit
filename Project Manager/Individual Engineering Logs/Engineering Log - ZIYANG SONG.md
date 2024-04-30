# Engineering Log - ZIYANG SONG

## Overview

This log captures the detailed progress on various tasks assigned to me in the project. It reflects the work completed, in progress, and planned, along with learnings and future goals. This document serves to track contributions and provide a transparent account of the developments and challenges encountered.

## Contributions Update

### Tasks Completed:

**G1.1 Initiate the Project Repo/Onboarding - 2451 #3**
- Successfully set up the project repository and onboarded new team members, ensuring everyone was familiar with our workflow and tools.

**B1.5 Error handling and message validation #10**
- Implemented robust error handling mechanisms for our messaging feature and validated input to prevent potential security issues.

**F1.5 Message sending function #16**
- Developed the core functionality for sending messages within our application, focusing on efficiency and user experience.

**R1.6 Front-end framework comparison #25**
- Conducted a comprehensive comparison of front-end frameworks, ultimately contributing to the decision to use React for our project due to its component-based architecture and vibrant ecosystem.

**B1.3 Develop text upload API #9**
- Created an API for text file uploads, optimizing for different file types and sizes, and integrated it with our front-end.

**F1.7 Plug-in list capture and display #23**
- Engineered a solution to capture and display a list of plug-ins, enhancing the customizability of our application.

### Ongoing Tasks:

**G1.3 Project Documentation update (Audit 2) #67**
- Currently updating and auditing project documentation to ensure accuracy and completeness.

**R2.3 Market positioning #40**
- Analyzing market trends and positioning our product to better meet customer needs and stand out in the competitive landscape.

**R1.4 User experience research #7**
- Engaging with users to gather feedback on our UI/UX, aiming to refine and improve their interactions with our platform.

### Upcoming Tasks:

**T1.1 Implement testing for database #68**
- Preparing to design and execute a comprehensive testing suite for our database to ensure data integrity and performance.

## Reflections:

- The completion of the message sending function (#F1.5) was particularly challenging due to the real-time aspects of data handling and UI responsiveness. I learned a great deal about asynchronous programming and state management in React.
- Through the front-end framework comparison (#R1.6), I gained insights into the pros and cons of various frameworks, which will be beneficial for future project decisions.

## Learnings:

- The importance of thorough testing was highlighted during the development of the text upload API (#B1.3), where edge cases had to be considered to ensure reliability.
- Collaboration and communication were key in the error handling and validation task (#B1.5), requiring cross-team efforts with the back-end team to establish consistent error codes and responses.

## Future Goals:

- For the upcoming database testing task (#T1.1), I aim to focus on learning more about automated testing frameworks and incorporating them into our CI/CD pipeline.
- I intend to take a more proactive role in mentoring new team members, sharing the knowledge and best practices I've accumulated throughout my time on the project.

## Development log

27/04/2024
- I want to directly replace the uploaded file to replace this app.py instead of manually editing it on the server

PS C:\Users\ZIYANG SONG\Desktop\COMP3500_CHATGPT_TEST> scp "C:\Users\ZIYANG SONG\Desktop\COMP3500_CHATGPT_TEST\AI-Enhanced-WordPress-Development-Toolkit\test\src\app.py" ubuntu@54.66.206.5:/home/ubuntu/app.py
ubuntu@54.66.206.5: Permission denied (publickey).
lost connection

The error message "Permission denied (public key)" means that the server is configured to accept SSH connections only through public key authentication, and the public key provided (or not provided) by the SSH client does not match any public keys authorized on the server .

- ssh -i "C:\Users\ZIYANG SONG\.ssh\zmatch.pem" ubuntu@54.66.206.5 (Correctly upload the file and replace it on AWS)


- scp -i "C:\Users\ZIYANG SONG\.ssh\zmatch.pem" -r "C:\Users\ZIYANG SONG\Desktop\test\build" ubuntu@54.66.206.5:/usr/share/nginx/html/build
- scp -i "C:\Users\ZIYANG SONG\.ssh\zmatch.pem" "C:\Users\ZIYANG SONG\Desktop\COMP3500_CHATGPT_TEST\AI-Enhanced-WordPress-Development-Toolkit\test\src\app.py" ubuntu@54.66.206.5:/home/ubuntu/app.py


scp: This initiates the SCP command, which is used for copying files and directories securely over a network.
-i "C:\Users\ZIYANG SONG.ssh\zmatch.pem": This option specifies the private key file (zmatch.pem) to use for SSH authentication. It's located at C:\Users\ZIYANG SONG\.ssh\zmatch.pem on your local machine. This key is used instead of a password to authenticate with the remote server.

-r: This option tells SCP to copy directories recursively. It is necessary when you want to copy a directory and all its contents, including subdirectories and the files within them.

"C:\Users\ZIYANG SONG\Desktop\test\build": This is the source path on your local machine. It points to the directory build located under C:\Users\ZIYANG SONG\Desktop\test. This directory and all its contents will be copied to the remote server.

ubuntu@54.66.206.5: This part specifies the user and host to which the files will be copied. ubuntu is the username, and 54.66.206.5 is the IP address of the remote server.

:/usr/share/nginx/html/build: This is the destination path on the remote server where the files will be copied. It specifies that the build directory from your local machine should be placed into /usr/share/nginx/html/build on the remote server. This path is typically used to serve files from a web server running Nginx.


- scp -i "C:\Users\ZIYANG SONG\.ssh\zmatch.pem" -r "C:\Users\ZIYANG SONG\Desktop\AI-Enhanced-WordPress-Development-Toolkit\test\build" ubuntu@54.66.206.5:/usr/share/nginx/html (Correctly upload the code to upload the build file to the server, but pay attention to the file path of the build and key)

![image](https://github.com/ZIYANGSONG2003/AI-Enhanced-WordPress-Development-Toolkit/assets/110000045/0fbc56f8-6ae9-40da-96ba-8105f7b989f8)

I tried using a different gptmodel and creating a new api key, but still faced the problem of rat limit, causing the information to fail to be uploaded.

![image](https://github.com/ZIYANGSONG2003/AI-Enhanced-WordPress-Development-Toolkit/assets/110000045/9b50cb70-48b7-4d04-8fb0-c15885328cfb)

![image](https://github.com/ZIYANGSONG2003/AI-Enhanced-WordPress-Development-Toolkit/assets/110000045/842a439e-1188-4730-ba6c-c25a2a8980a6)


error log

 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:8080
 * Running on http://172.31.40.198:8080
INFO:werkzeug:Press CTRL+C to quit
INFO:werkzeug: * Restarting with stat
INFO:root:Loaded API key successfully.
WARNING:werkzeug: * Debugger is active!
INFO:werkzeug: * Debugger PIN: 847-388-080
INFO:werkzeug:150.203.65.251 - - [30/Apr/2024 05:31:17] "OPTIONS /upload_text HTTP/1.1" 200 -
DEBUG:urllib3.connectionpool:Starting new HTTPS connection (1): api.openai.com:443
DEBUG:urllib3.connectionpool:https://api.openai.com:443 "POST /v1/engines/gpt-3.5-turbo-0125/completions HTTP/1.1" 429 337
ERROR:root:Rate limit exceeded. Please wait and try again.
INFO:werkzeug:150.203.65.251 - - [30/Apr/2024 05:31:17] "POST /upload_text HTTP/1.1" 429 -
