import fs from 'fs';
import csvtojson from 'csvtojson';

const readStream = fs.createReadStream('./csv/nodejs-hw1-ex1.csv');
const writeStream = fs.createWriteStream('./module-2/demo3-2.txt');

readStream
  .pipe(csvtojson())
  .pipe(writeStream)
  .on('error', (error) => {
    console.log(error);
  });
