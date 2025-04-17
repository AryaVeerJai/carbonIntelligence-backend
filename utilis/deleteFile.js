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

        const params = {
            // Bucket: 'tanzivamernnew', // pass your bucket name
            Bucket: 'tanzivamern', // pass your bucket name
            Key: file
        };
        s3.deleteObject(params, function (s3Err, data) {

            if (data) {
                console.log(`File deleted successfully at ${data}`)

                return resolve(data);



            }

            if (s3Err) {
                console.log(s3Err)
                return reject(s3Err)
            }
        });

    });
    // })



