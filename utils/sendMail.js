const sgMail = require('@sendgrid/mail');
require('dotenv').config();

exports.sendMail = async(mailTo, token) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: mailTo, // Change to your recipient
        from: process.env.FROM, // Change to your verified sender
        subject: 'Account verification',
        html: `
            <div>
                <h3>Click the following link to verify your account.</h3>
                <p><a target="_blank" href="http://locahost:9000/users/verify/${token}" data-saferedirecturl="http://www.google.com/url?q=https://agenda-pw2.herokuapp.com/users/verify/${token}">Link</a></p>
            </div>
        `,
    }
    await sgMail
        .send(msg)
        .then(() => {
        console.log('Email sent')
        })
        .catch((error) => {
        console.error(error)
        })    
}
