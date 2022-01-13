const nodemailer = require('nodemailer')
const numeral = require('numeral');

exports.normalizeText = (text) => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// function
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'Gmail',
    auth: {
        user: 'auctionboi@gmail.com',
        pass: 'Auctionboi123'
    }
});

exports.sendOtpMail = (email, otp) => {
    console.log(`${email} ${otp}`);
    try {
        const mailOptions = {
            from: 'Mailing System <auctionboi@gmail.com>',
            to: email,
            subject: "OTP Account Verification",
            html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            // console.log('Message sent: %s', info.messageId);
            // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    } catch (error) {
        console.log(error);
    }
}

exports.sendNewPassword = (email, password) => {
    console.log(`${email} ${password}`);
    try {
        const mailOptions = {
            from: 'Mailing System <auctionboi@gmail.com>',
            to: email,
            subject: "New Account Password",
            html: "<h3>Here is your new password </h3>" + "<h1 style='font-weight:bold;'>" + password + "</h1>" // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            // console.log('Message sent: %s', info.messageId);
            // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    } catch (error) {
        console.log(error);
    }
}

exports.otpGenerator = () => { return (Math.floor(100000 + Math.random() * 900000)).toString() };

exports.formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
});

exports.format_number = (val) => {
    return numeral(val).format('0,0');
}
exports.sendAuctionSuccess = (email, message) => {
    console.log(`${email} ${message}`);
    try {
        const mailOptions = {
            from: 'Mailing System <auctionboi@gmail.com>',
            to: email,
            subject: "Đấu giá thành công",
            html: "<h3>Bạn đã đặt giá thành công </h3>" + "<h1 style='font-weight:bold;'>" + message + "</h1>" // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            // console.log('Message sent: %s', info.messageId);
            // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    } catch (error) {
        console.log(error);
    }
}