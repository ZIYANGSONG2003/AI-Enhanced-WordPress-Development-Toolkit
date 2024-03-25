# Engineer Log Entry 1 -- B 1.4

## Date/Time: 2024-03-01

### Current Work Epic
- **Develop logic for handling POST requests, including data parsing and responses**

### To-Do List
- [x] Review the HTTP protocol for POST request standards
- [x] Draft initial logic flow for parsing POST request data
- [x] Implement POST data parsing mechanism
- [x] Create unit tests for data parsing logic

### Learnings/Workings
- Realized the importance of robust error handling in data parsing to prevent injection attacks
- Learned about new JSON parsing libraries that offer enhanced security features

### Technical Step-Throughs
- Set up a local development environment to test POST request handling
- Successfully parsed JSON payload from POST request using `json-parser` library

### Personal Notes/Workings from Meetings
- Team agrees on using `response-handler` module for generating standardized responses
- Decisions made on response status codes for various scenarios (e.g., 200 OK, 400 Bad Request)

### Log Entry Details
- The log entry will be valid for 2-3 days as I iterate over the POST request handling logic.
- Interesting finding: optimizing the parsing algorithm can significantly reduce server response time.

### Additional Notes
- Following GTD methodology to keep track of tasks and ensure nothing slips through.
- Encountered a challenge with handling multipart/form-data; researching best practices.

### Documentation
- Began drafting internal documentation for the POST request handling process.
- Screenshots and code snippets are being compiled for the technical documentation.

### Venting/Reflection (Private)
- Frustration with legacy code integration. Planned a strategy to refactor safely without breaking changes.

---

# Engineer Log Entry 2 -- R 1.5

## Date/Time: 2024-03-06

**Current Work Epic**  
Explore how to integrate AWS services into tools to improve scalability and performance  

**To-Do List** 
- [x] Research AWS services suitable for our project's scalability and performance needs 
- [x] Design a preliminary architecture that incorporates AWS services into our existing toolset 
- [x] Set up AWS SDK in the development environment
- [x] Experiment with AWS Lambda and Amazon S3 for scalable storage and compute tasks 

**Learnings/Workings**  
- Discovered the potential of AWS Lambda for managing scalable, event-driven computing tasks  
- Understood the benefits of Amazon S3 for scalable and secure object storage  

**Technical Step-Throughs**  
1. Initialized AWS CLI and configured access credentials in the local development environment  
2. Successfully integrated a test Lambda function to process data asynchronously  
3. Implemented S3 buckets for storage, with encryption and access policies configured for security  

**Personal Notes/Workings from Meetings**  
- Team consensus to prioritize the integration of AWS Lambda for backend tasks to reduce server load  
- Decided to use Amazon CloudFront in conjunction with S3 to improve content delivery speeds globally  

**Log Entry Details**  
This log entry is reflective of the initial phase of AWS integration, focusing on scalability and performance. Key tasks for the coming days include optimizing Lambda functions and exploring Amazon DynamoDB for database scalability.  

**Interesting finding:** Utilizing AWS Auto Scaling with EC2 instances can drastically improve our application's responsiveness during peak loads.  

**Additional Notes**  
- Adopting the Agile methodology to adapt quickly to the learning curve and implementation challenges of AWS services  
- Planning to explore AWS Elastic Beanstalk for easy deployment and management of applications  

**Documentation**  
- Initiated comprehensive documentation on integrating AWS services, highlighting setup procedures, and best practices  
- Creating a repository of code examples and templates for AWS services integration  

**Venting/Reflection (Private)**  
Encountered initial challenges with AWS IAM roles and permissions. Dedicated time to understanding IAM policies better to ensure secure and effective access management. The complexity of AWS services is high, but recognizing their power to transform our tool's scalability and performance is motivating.

---

# Engineer Log Entry 3 -- 

## Date/Time: 2024-03-11
