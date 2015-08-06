var fs = require('fs');
var path = require('path');

require('iconv-lite').extendNodeEncodings();

var clog = console.log;

var readFileOrDie = function(filename, encoding, rusMode){
   try {
      return fs.readFileSync(filename, {encoding: encoding});
   } catch(err) {
      clog('');
      if( rusMode ){
         clog('Файл ' + filename + ' не может быть прочитан.');
      } else {
         clog('File ' + filename + ' cannot be read.');
      }
      clog('');
      throw err;
   }
};

var writeFileOrDie = function(filename, content, encoding, rusMode){
   try {
      fs.writeFileSync(filename, content, {encoding: encoding});
   } catch(err) {
      clog('');
      if( rusMode ){
         clog('Файл ' + filename + ' не может быть записан.');
      } else {
         clog('File ' + filename + ' cannot be written.');
      }
      clog('');
      throw err;
   }
};

module.exports = function(filenameCSV, filenameHPT, options){
   filenameCSV = path.resolve(__dirname, filenameCSV);
   filenameHPT = path.resolve(__dirname, filenameHPT);

   var contentCSV = readFileOrDie(
      filenameCSV, options.inputEncoding, options.rusMode
   ).split(/(?:\r|\n)+/).map(function(nextLine){
      if( nextLine.length < 1 ) return null; // empty line
      if( nextLine.indexOf(';') === 0 ) return null; // comment line

      var lineParts = nextLine.split(',');
      if( lineParts.length !== 6 ){
         clog('');
         if( options.rusMode ){
            clog('Обнаружена строка с неожиданным количеством запятых:');
         } else {
            clog('A line with unexpected number of commas is detected:');
         }
         clog(nextLine);
         if( options.rusMode ){
            clog('Эта строка проигнорирована.');
         } else {
            clog('That line is ignored.');
         }
         return null; // weird line
      }
      return {
         echotag: lineParts[1],
         description: lineParts[2]
      };
   }).filter(function(nextLine){
      return nextLine !== null;
   });

   var contentHPT = readFileOrDie(
      filenameHPT, options.outputEncoding, options.rusMode
   );
};
