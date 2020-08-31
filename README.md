<div align="center">
  <img src="./assets/aog.png" alt="aog" height="105">
</div>

<div align="center">
  <h1>𝗖𝗢𝗩𝗜𝗗/𝗗𝗔𝗬 𝗧𝗿𝗮𝗰𝗸𝗲𝗿 𝗔𝗰𝘁𝗶𝗼𝗻</h1>
  <p>Create an Google Assistant Action using the new Actions Builder</p>
</div>

**NOTE**

This is an experimental project and will receive minimal maintenance. Only bugs for security issues will be accepted. No feature requests will be accepted. Pull requests will be acknowledged and reviewed as soon as possible. There is no associated SLAs.

**ABOUT**

𝗖𝗢𝗩𝗜𝗗/𝗗𝗔𝗬 𝗧𝗿𝗮𝗰𝗸𝗲𝗿 𝗔𝗰𝘁𝗶𝗼𝗻 using the new Actions Builder.In this series you'll learn how to create an Action in the new Actions Builder from Scratch for this we have taken an use case to track the list of places where the user has visited during these pandemic time.

𝗪𝗵𝗮𝘁 𝘆𝗼𝘂'𝗹𝗹 𝗹𝗲𝗮𝗿𝗻 𝗳𝗿𝗼𝗺 𝘁𝗵𝗶𝘀 𝘀𝗲𝗿𝗶𝗲𝘀

1. What is Google Assistant
2. What is Actions Builder and Scene
3. How to write conversation for the action we are going to build
4. How to build an action using the new Actions Builder
5. How to create a cloud function to write logics for our action
6. How to store and reterive data from firestore
7. How to generate a pdf file in cloud function using PdfMake
8. How to use send grid to send an email with attachment
9. How to upload the pdf file to Cloud storage
10. How to send pdf attachment to Whatsapp using Twilio


## Setup Instructions

### Prerequisites

1. Node.js and NPM
   - We recommend installing using [nvm for Linux/Mac](https://github.com/creationix/nvm) and [nvm-windows for Windows](https://github.com/coreybutler/nvm-windows)
2. Install the [Firebase CLI](https://developers.google.com/actions/dialogflow/deploy-fulfillment)
   - We recommend using MAJOR version `7` with `7.1.1` or above, `npm install -g firebase-tools@^7.1.1`
   - Run `firebase login` with your Google account

### Configuration

#### Firebase Deployment

1. On your local machine, in the `functions` directory, run `npm install`
   1. Note that when creating a new project, you must install the `@assistant/conversation` library like `npm install @assistant/conversation`.
2. Run `firebase deploy` to deploy the function.


*NOTE*

Before Deploying the function make sure you have added all the necessary keys like the one mentioned below

1. Google Service account json file (For CloudStorage)
2. Send Grid API Key (For Sending Email)
3. Twilio ACCOUNT_ID and AUTH_TOKEN (For Sending message in Whatsapp)
4. Your mobile number in the Receiver Mobile no (For receiving message in Whatsapp)
5. Your Email address in which you will receive the report

*To add these keys go to `functions/constants/index.js` file as well as `functions/environments/index.js` file*

𝗚𝗼𝗼𝗴𝗹𝗲 𝗔𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁 𝗥𝗲𝘀𝗼𝘂𝗿𝗰𝗲𝘀

1. Documentation → https://aog.page.link/conversation
2. Actions samples → https://aog.page.link/samples
3. Actions codelab → https://aog.page.link/codelabs