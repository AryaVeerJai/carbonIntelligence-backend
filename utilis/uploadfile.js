const AWS = require('aws-sdk');
var fs = require('fs');

const s3 = new AWS.S3({
    accessKeyId: "AKIA3NZGUFZ4FT3KKXOD",
    secretAccessKey: "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",

    // accessKeyId: "AKIA3NZGUFZ4FW43J47A",
    // secretAccessKey: "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",
    // accessKeyId: "AKIAYIRYD6UKCFCA6BUV",
    // secretAccessKey: "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",
});

module.exports = (file) =>
    new Promise((resolve, reject) => {
        // fs.readFile(file.fieldname, function (err, data) {
        //     if (err) {
        //         return reject(err)
        //     };
        const params = {
            // Bucket: 'tanzivamernnew', // pass your bucket name
            Bucket: 'tanzivamern', // pass your bucket name
            Key: file.originalname, // file will be saved as testBucket/contacts.csv
            Body: file.buffer
        };
        s3.upload(params, function (s3Err, data) {

            if (data) {
                console.log(`File uploaded successfully at ${data.Location}`)

                return resolve(data.Location);



            }

            if (s3Err) {
                console.log(s3Err)
                return reject(s3Err)
            }
        });

    });



