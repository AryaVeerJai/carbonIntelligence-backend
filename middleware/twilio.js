const twilio = require("twilio");

const client = twilio(
  // "ACab27872908d801f793d6932f224017e5",
  "AC9bfc030357ae904c56ddf42eabbe25bd",
  // "09654654eac09c625cdd5e102e892cd3"
  "7ceb02f9bdbe8327681aa808e80e387a"
);
//after createService function creation

//send verification code token
const sendVerification = async (req, res, number) => {
  client.verify.v2
    .services("VA438006354579c3f5e642588e561207f1")
    .verifications.create({ to: `${number}`, channel: "sms" })
    .then((verification) => console.log(verification.status));
};

//check verification token
const checkVerification = async (req, res, number, code) => {
  return new Promise((resolve, reject) => {
    client.verify.v2
      // .services("VA438006354579c3f5e642588e561207f1")
      .services("AC9bfc030357ae904c56ddf42eabbe25bd")
      .verificationChecks.create({ to: `${number}`, code: `${code}` })
      .then((verification_check) => {
        console.log(verification_check);
        resolve(verification_check.status);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          success: false,
          error: {
            message: `Max OTP limit exceed`,
          },
        });
      });
  });
};
module.exports = {
  sendVerification,
  checkVerification,
};
