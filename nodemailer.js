const nodemailer = require('nodemailer');
 
const sendEmail = (email,link) => {

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
 
let mailDetails = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your One Time reset password link',
    html: `<h1>Welcome</h1>
    <h4>Link will be expired in 5 minutes</h4>
    <p>${link}</p>`
};
 
mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) {
        console.log('Error Occurs');
        console.log(err);
    } else {
        console.log('Email sent successfully');
    }
});
}

module.exports = sendEmail