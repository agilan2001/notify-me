const nodemailer = require('nodemailer')
var admin = require("firebase-admin");
var private_key = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g,'\n');
console.log(private_key);
var serviceAccount = {
    "type": "service_account",
    "project_id": "notify-me-agiapp",
    "private_key_id": "e515ac3da414b30fdd53d3200b165afc89d811be",
    "private_key": private_key,
    "client_email": "firebase-adminsdk-ue5hw@notify-me-agiapp.iam.gserviceaccount.com",
    "client_id": "107056211000073409089",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ue5hw%40notify-me-agiapp.iam.gserviceaccount.com"
  }
  

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://notify-me-agiapp.firebaseio.com"
});

var db = admin.firestore();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'agilanvlr2001@gmail.com',
        pass: 'tlbehdowmlmiqsda'
    }
});



module.exports = (req,res) => {
    var time = parseInt(Date.now() / 60000);
    time = 26792036;
    var count = 0;
    db.collection('jobs').where('time', '==', time).get().then(
        (snap) => {
            if (!snap.empty) {
                snap.forEach(doc => {
                    count++;
                    admin.messaging().sendToDevice(doc.data()["token"], 
                    {
                        "data": {
                            "notification": JSON.stringify({
                                "body": doc.data()["mes"],
                            })
                        }
                    })

                    if (doc.data()["mail"]) {

                        var mailOptions = {
                            from: 'agilanvlr2001@gmail.com',
                            to: doc.data()["mail"],
                            subject: 'Notify-Me ALERT',
                            html: `<center><h1 style = "color:blue">Notify-Me ALERT</h1>
                      <img style="height:100px" src= "https://dl.dropbox.com/s/0ap2te49gnthv16/bell.png">
                      <h3 style="text-decoration:underline">MESSSAGE</h3>
                      <h2 style="font-style:italic">${doc.data()["mes"]}</h2>
                      <h3><a href = "https://notify-me-agiapp.web.app/">https://notify-me-agiapp.web.app/</a></h3>
                      </center>`
                        };

                        transporter.sendMail(mailOptions);

                    }
                    db.collection('jobs').doc(doc.id).set({ done: true }, { merge: true });

                })

            }
            res.status(200).send("sent " + count)
        }

    )
};

