var fs = require('fs');
var path = require('path');

require('iconv-lite').extendNodeEncodings();

var readFileOrDie = function(filename, rusMode){
   try {
      return fs.readFileSync(filename, {encoding: 'cp866'});
   } catch(err) {
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
      throw err;
   }
};

module.exports = function(filenameCSV, filenameHPT, rusMode){
   filenameCSV = path.resolve(__dirname, filenameCSV);
   filenameHPT = path.resolve(__dirname, filenameHPT);

   var contentCSV = readFileOrDie(filenameCSV);
   var contentHPT = readFileOrDie(filenameHPT);
};
