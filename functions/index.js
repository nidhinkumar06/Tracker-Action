const { conversation, Table } = require('@assistant/conversation');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');
const pdfFonts = require('pdfmake/build/vfs_fonts');
const pdfMake = require('pdfmake/build/pdfmake');
const sgMail = require('@sendgrid/mail');
const gridAPIKey = require('./environments');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const twilioLib = require('twilio');
const {
  PROJECT_ID,
  BUCKET_NAME,
  ACCOUNT_SID,
  AUTH_TOKEN,
  SENDER_MOBILE_NO,
  RECEIVER_MOBILE_NO,
  TABLE_HEADER,
  REPORT_MESSAGE,
  EMAIL_DETAILS
} = require('./constants');
const {
  USER_ACTIVITY_SCENE,
  NEW_USER_CONFIRMATION_SCENE,
  ADD_NEW_ROUTE_SUCCESS_SCENE,
  REPORT_SCENE,
  END_SCENE
} = require('./scenes');
const {
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
} = require('./ssml');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

//INITIALIZE FIREBASE

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const dbDoc = db.collection('DayTracker');

sgMail.setApiKey(gridAPIKey);

//SETUP CLOUD STORAGE
const gc = new Storage({
  keyFilename: path.join(__dirname, './covid-tracker-a826c-a73dc44558ac.json'),
  projectId: PROJECT_ID
});

const dayTrackerBucket = gc.bucket(BUCKET_NAME);

//SETUP OF TWILIO
const client = twilioLib(ACCOUNT_SID, AUTH_TOKEN);

const app = conversation({ debug: true });

app.handle('greetings', conv => {
  if (conv.user.lastSeenTime) {
    conv.add(WELCOME_MESSAGE_EXISTING_USER);
    conv.scene.next.name = USER_ACTIVITY_SCENE;
  } else {
    conv.add(WELCOME_MESSAGE_NEW_USER);
    conv.scene.next.name = NEW_USER_CONFIRMATION_SCENE;
  }
});

app.handle('addRouteHandler', conv => {
  const date = moment().format('YYYY-MM-DD');
  const place = conv.session.params.place;
  const visitedTime = conv.session.params.visittime;

  const hours = visitedTime.hours;
  const minutes = visitedTime.minutes === 0 ? '00' : visitedTime.minutes;
  const time = `${hours}:${minutes}`;

  const entry = {
    date,
    place,
    time
  };

  return dbDoc
    .add(entry)
    .then(() => {
      conv.add(ADD_ROUTE_SUCCESS);
      conv.scene.next.name = ADD_NEW_ROUTE_SUCCESS_SCENE;
    })
    .catch(error => {
      console.log('Error in writing to Firestore', error);
      conv.add(ADD_ROUTE_ERROR);
    });
});

app.handle('getLocationHistory', async conv => {
  const reportDatas = await getFirestoreData();

  const datas = reportDatas.map(reportData => {
    return {
      cells: [
        { text: reportData.date },
        { text: reportData.time },
        { text: reportData.place }
      ]
    };
  });

  if (datas.length > 0) {
    conv.add(TABLE_SUCCESS);
    conv.add(
      new Table({
        columns: TABLE_HEADER,
        rows: datas
      })
    );
    conv.scene.next.name = REPORT_SCENE;
  } else {
    conv.add(TABLE_ERROR);
  }
});

app.handle('sendEmail', async conv => {
  const reportDatas = await getFirestoreData();
  const pdfData = await generatePDF(reportDatas);
  const base64Data = await generateBase64(pdfData);

  const msg = {
    ...EMAIL_DETAILS,
    attachments: [
      {
        content: base64Data,
        filename: `DayTrackerReport-${moment().format('YYYY-MM-DD')}.pdf`,
        type: 'application/pdf',
        disposition: 'attachment',
        contentId: 'mytext'
      }
    ]
  };
  const emailResponse = await sendEmail(msg);
  if (emailResponse) {
    conv.add(EMAIL_SUCCESS);
    conv.scene.next.name = END_SCENE;
  } else {
    conv.add(EMAIL_ERROR);
  }
});

app.handle('sendWhatsapp', async conv => {
  const reportDatas = await getFirestoreData();
  const pdfData = await generatePDF(reportDatas);
  const base64Data = await generateBase64(pdfData);
  const bucketUrl = await pdfUpload(base64Data);
  const whatsappResponse = await sendWhatsappMessage(bucketUrl);
  if (whatsappResponse) {
    conv.add(WHATSAPP_SUCCESS);
    conv.scene.next.name = END_SCENE;
  } else {
    conv.add(WHATSAPP_ERROR);
  }
});

function getFirestoreData() {
  const startDate = moment
    .utc()
    .subtract(15, 'days')
    .format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');

  //query
  const reportRef = dbDoc
    .where('date', '>=', startDate)
    .where('date', '<=', endDate);

  return reportRef.get().then(snapshot => {
    let datas = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      datas.push({
        date: moment(data.date).format('DD-MM-YYYY'),
        time: data.time,
        place: data.place
      });
    });
    return datas;
  });
}

function generatePDF(datas) {
  const tableDatas = datas.map(data => {
    return [
      { text: data.date, alignment: 'left' },
      { text: data.time, alignment: 'left' },
      { text: data.place, alignment: 'left' }
    ];
  });

  const dayTrackerDetails = {
    style: 'tableExample',
    table: {
      body: [
        [
          { text: 'Date', style: 'tableHeader' },
          { text: 'Time', style: 'tableHeader' },
          { text: 'Place', style: 'tableHeader' }
        ]
      ].concat(tableDatas),
      headerRows: '1',
      widths: ['*', '*', '*']
    }
  };

  return new Promise(resolve => {
    const docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      content: [
        { text: 'DAY TRACKER LOCATION HISTORY', style: 'header' },
        dayTrackerDetails
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 20, 0, 5]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        }
      },
      defaultStyle: {}
    };
    resolve(docDefinition);
  });
}

function generateBase64(data) {
  return new Promise(resolve => {
    pdfMake.createPdf(data).getBase64(data => {
      resolve(data);
    });
  });
}

function sendEmail(msg) {
  return new Promise(resolve => {
    sgMail.send(msg).then(() => {
      resolve(true);
    });
  });
}

function pdfUpload(data) {
  return new Promise(resolve => {
    const fileName = `dayTracker-${moment().unix()}.pdf`;
    const file = dayTrackerBucket.file(fileName);

    var buff = Buffer.from(data, 'binary').toString('utf-8');

    const stream = file.createWriteStream({
      metadata: {
        contentType: 'application/pdf'
      }
    });

    stream.on('error', err => {
      console.log('err in stream', err);
    });

    stream.on('finish', () => {
      const fileUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;
      resolve(fileUrl);
    });

    stream.end(new Buffer(buff, 'base64'));
  });
}

function sendWhatsappMessage(url) {
  return new Promise(resolve => {
    client.messages
      .create({
        from: SENDER_MOBILE_NO,
        to: RECEIVER_MOBILE_NO,
        body: REPORT_MESSAGE,
        mediaUrl: url
      })
      .then(() => {
        resolve(true);
      })
      .catch(err => {
        console.log('error in twilio', err);
      });
  });
}

exports.fulfillment = functions.https.onRequest(app);
