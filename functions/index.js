const functions = require('firebase-functions');
const nodemailer = require('nodemailer')
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://notify-me-agiapp.firebaseio.com"
});


const cors = require('cors')({ origin: true });
//const fetch = require('node-fetch');

var db = admin.firestore();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'agilanvlr2001@gmail.com',
        pass: 'tlbehdowmlmiqsda'
    }
});




exports.addjob = functions.https.onRequest((req, res) => {
    cors(req, res, function () {
        db.collection('jobs').add(
            {
                time: req.body.time,
                token: req.body.token,
                mes: req.body.mes,
                mail: req.body.mail
            }
        ).then((doc) => res.status(200).end(doc.id));
    });
});





exports.sendnow = functions.https.onRequest((req, res) => {
    var time = parseInt(Date.now() / 60000);
    var count = 0;
    db.collection('jobs').where('time', '==', time).get().then(
        (snap) => {
            if (!snap.empty) {
                snap.forEach(doc => {
                    count++;
                    /*
                    fetch('https://fcm.googleapis.com/fcm/send', {
                        method: 'post',
                        body: JSON.stringify({
                            "data": {
                                "notification": {
                                    "body": doc.data()["mes"],
                                }
                            },
                            "to": doc.data()["token"]
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'key=AAAALA8Ki40:APA91bFB-yGaqtLnV8JEABQb1o19vLqaJqtkbWtuRdbtPfe05ONQFr5zyMSdkwyD7sZiOsvNWHOqnbFk9AhulWUKyPal6Pkk5Lenuw6pMM8t1z9tVYkmcxe_iyBwec3nfQZc8xmCTyLZ'
                        }
                    })
                    */

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
            res.end("sent " + count)
        }

    )
});


exports.getinfo = functions.https.onRequest((req, res) => {
    cors(req, res, function () {

        db.collection('jobs').where("token", "==", req.body.token).orderBy("time").get().then(
            (snap) => {
                if (!snap.empty) {
                    var res_p = [];
                    snap.forEach(
                        (doc) => {
                            var job = {};
                            job["time"] = doc.data()["time"];
                            job["mes"] = doc.data()["mes"];
                            job["info"] = doc.data()["done"] ? false : doc.id;
                            res_p.push(job);
                        }
                    )
                    res.end(JSON.stringify(res_p));
                } else {
                    res.end("null");
                }
            }
        )
    });
});


exports.deletejob = functions.https.onRequest((req, res) => {
    cors(req, res, function () {

        db.collection('jobs').doc(req.body.del_id).delete().then(() => res.end("DONE"));

    });
});
