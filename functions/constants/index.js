const PROJECT_ID = '//add your project id';
const BUCKET_NAME = '//add your bucket name';
const ACCOUNT_SID = '//add your Twilio account sid here';
const AUTH_TOKEN = '//add your Twilio auth token here';
const SENDER_MOBILE_NO = 'whatsapp:+14155238886';
const RECEIVER_MOBILE_NO = 'whatsapp://add your mobile number with country code';
const TABLE_HEADER = [
  { header: 'Date' },
  { header: 'Time' },
  { header: 'Place' }
];
const EMAIL_DETAILS = {
  to: '// add your email id',
  from: '// add the email id which u have configured in send grid',
  subject: 'DayTracker Report',
  text: 'Hi, Pls find the attachment for the list of places you have visited',
};

const REPORT_MESSAGE = 'DayTracker Report';

module.exports = {
  PROJECT_ID,
  BUCKET_NAME,
  ACCOUNT_SID,
  AUTH_TOKEN,
  SENDER_MOBILE_NO,
  RECEIVER_MOBILE_NO,
  TABLE_HEADER,
  REPORT_MESSAGE,
  EMAIL_DETAILS
};
