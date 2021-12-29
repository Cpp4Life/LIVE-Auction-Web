const nodemailer = require('nodemailer')

exports.normalizeText = (text) => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

exports.sendMail = (email, otp) => {
    console.log(`${email} ${otp}`);
    try {
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
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    } catch (error) {
        console.log(error);
    }
}

exports.formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
});