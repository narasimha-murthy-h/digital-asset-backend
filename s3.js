const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

const bucketName = 'digitalasset99160';
const region = 'ap-south-1';
const accessKeyId = 'AKIAXXJ6DBI2Y5DOOSXZ';
const secretAccessKey = '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';

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadparams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadparams).promise();
}

exports.uploadFile = uploadFile;
