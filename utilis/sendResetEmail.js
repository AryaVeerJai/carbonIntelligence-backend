const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // const transport = nodemailer.createTransport({
  //   service: "godaddy",
  //   host: "smtpout.secureserver.net",
  //   port: 465,
  //   auth: {
  //     user: "test@hiquik.com",
  //     pass: "Admin@123@Test",
  //   },
  // });
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtpout.secureserver.net",
    port: 465,
    auth: {
      user: "jai.webshark@gmail.com",
      // pass: "ekndkxjvkprjpgcj",
      pass: "brauulcfviuqnzfe",
    },
  });

  const message = {
    from: `Khado Store <store@khadostore.com>`,
    to: options.email,
    subject: options.subject,
    // text: options.message,
    html: options.message,
  };
  await transport
    .sendMail(message)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = sendEmail;



//  To generate app password enavel 2FA in Google and go to this like: https://myaccount.google.com/apppasswords
