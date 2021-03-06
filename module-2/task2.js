const fs = require('fs');
const csvtojson = require('csvtojson');

const readStream = fs.createReadStream('./csv/nodejs-hw1-ex1.csv');
const writeStream = fs.createWriteStream('./module-2/demo.txt');

readStream
  .pipe(csvtojson())
  .pipe(writeStream)
  .on('error', (error) => {
    console.log(error);
  });
