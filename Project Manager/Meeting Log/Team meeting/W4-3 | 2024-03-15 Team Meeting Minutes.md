# Wk 4-3 | 2024-03-15 Team Meeting Minutes

## Meeting Details
- **Date:** 15/03/2024
- **Time:** 21:00 - 22:25
- **Location:** Remote
- **Attendees:** Nicky Song [Lead/Scribe], Kunlun Zang, Stephanie Sun, Zubin

## Agenda

1. **UI Bug Discovery**
   
   Discovery of a bug in UI related to React's handling of container elements, specifically when a button is clicked, causing a logo icon to move from its original position.

2. **Description Adjustment**

   The user icon's position shifts with text input length. Implement a messaging function that ensures consistent placement of user icons and input content.

3. **Plugin List Persistence Issue**

   Previous session's plugin list remains visible after starting a new chat. Modify `fetchPlugins` to clear past session data upon initiating a new chat.

## Discussion Topics

| Time        | Action Item                                              | Presenter           | Notes                                                        |
| ----------- | -------------------------------------------------------- | ------------------- | ------------------------------------------------------------ |
| 21:00-21:45 | Investigating and Resolving UI Bug                       | Kunlun Zang & Zubin | A detailed examination of React's container handling to identify the root cause of the logo displacement issue. Possible solutions include fixing positioning CSS or adjusting React state management. |
| 21:45-22:05 | Enhancing User Experience Through Description Adjustment | Nicky Song          | Implementing `UserMessageWrapper` and content CSS classes to maintain icon positioning and streamline user input visibility. |
| 22:05-22:25 | Ensuring Plugin List Freshness                           | Stephanie Sun       | Discussion on modifying `fetchPlugins` to include a clear session function, preventing data carry-over between chat sessions. |

## Action Items (Assigned Tasks with Timeframes)

- **March 16-18:**
  - Kunlun Zang & Zubin to perform an in-depth analysis of the UI bug, focusing on React's container behavior. The goal is to isolate the issue and propose preliminary solutions.

- **March 19:**
  - Stephanie Sun to develop the `UserMessageWrapper` function, incorporating necessary CSS adjustments to ensure static user icon positioning regardless of input length.

- **March 20-21:**
  - Nicky Song to revise the `fetchPlugins` function, adding a mechanism to clear previous session data upon initiating a new chat session. This task includes testing to ensure no data persistence issues remain.

## Decisions

- The team has decided to prioritize the UI bug as a critical issue requiring immediate attention. A step-by-step debugging approach will be adopted, with a deadline set for initial findings by March 18.
- For the description adjustment, the implementation of a new message function with enhanced CSS classes was agreed upon as the solution. This adjustment aims to improve the overall user experience by maintaining a consistent layout for user inputs and icons.
- On the matter of plugin list persistence, the unanimous decision was to update the `fetchPlugins` method. This update will introduce a clear session functionality, ensuring a fresh start for users with each new chat initiation. This decision underscores the team's commitment to a seamless user experience.
- These decisions reflect the group's consensus on addressing identified issues with a clear timeline and assigned responsibilities to ensure efficient resolution and implementation.
