var fs = require('fs');
var path = require('path');

require('iconv-lite').extendNodeEncodings();

var readFileOrDie = function(filename, encoding, rusMode){
   try {
      return fs.readFileSync(filename, {encoding: encoding});
   } catch(err) {
      console.log('');
      if( rusMode ){
         console.log([
            'Файл ',
            filename,
            ' не может быть прочитан.'
         ].join(''));
      } else {
         console.log([
            'File ',
            filename,
            ' cannot be read.'
         ].join(''));
      }
      console.log('');
      throw err;
   }
};

module.exports = function(filenameCSV, filenameHPT, options){
   filenameCSV = path.resolve(__dirname, filenameCSV);
   filenameHPT = path.resolve(__dirname, filenameHPT);

   var contentCSV = readFileOrDie(
      filenameCSV, options.inputEncoding, options.rusMode
   );
   var contentHPT = readFileOrDie(
      filenameHPT, options.outputEncoding, options.rusMode
   );
};
