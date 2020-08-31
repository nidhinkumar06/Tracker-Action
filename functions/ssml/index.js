const WELCOME_MESSAGE_NEW_USER =
  `<speak>Welcome to Day Tracker.<break time="500ms" />I will assist you to store where you have went during these Covid times it will be helpful to track the places you have visited if you got covid</speak>`;
const WELCOME_MESSAGE_EXISTING_USER = `<speak>Welcome to Day Tracker<break time="500ms" /></speak>`;
const ADD_ROUTE_SUCCESS = `<speak>Great! <break time="200ms" /> I have stored what you have said <break time="500ms" /></speak>`;
const ADD_ROUTE_ERROR = 'Something went wrong in storing the data';
const TABLE_SUCCESS = 'Here is the list of places you have visited';
const TABLE_ERROR = 'You have not visited any places for the last 15 days';
const EMAIL_SUCCESS = 'I have send the report to your email.Pls check it out';
const EMAIL_ERROR = 'Something went wrong while sending email';
const WHATSAPP_SUCCESS = 'Report has been sent to ur whatsapp number';
const WHATSAPP_ERROR = 'Something went wrong while sending whatsapp';

module.exports = {
  WELCOME_MESSAGE_NEW_USER,
  WELCOME_MESSAGE_EXISTING_USER,
  ADD_ROUTE_SUCCESS,
  ADD_ROUTE_ERROR,
  TABLE_SUCCESS,
  TABLE_ERROR,
  EMAIL_SUCCESS,
  EMAIL_ERROR,
  WHATSAPP_SUCCESS,
  WHATSAPP_ERROR
};
