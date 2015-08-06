var fs = require('fs');
var path = require('path');

require('array.prototype.find');
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
         description: lineParts[2].replace(/"/g, '') // prevent double quotes
      };
   }).filter(function(nextLine){
      return nextLine !== null;
   });

   var contentHPT = readFileOrDie(
      filenameHPT, options.outputEncoding, options.rusMode
   ).split(/([\r\n]+)/).map(function(nextLine, idx){
      if( idx % 2 === 1 ) return nextLine; // line separator's index: 1, 3, 5…

      var lineParts = nextLine.split(/(\s+)/);

      var echoAreaLine = (
         lineParts[0].length > 0 &&
         lineParts[0].toLowerCase() === 'echoarea' &&
         typeof lineParts[2] !== 'undefined' && // echotag element
         typeof lineParts[4] !== 'undefined' // path element
      ) || (
         lineParts[0].length < 1 &&
         typeof lineParts[2] !== 'undefined' &&
         lineParts[2].toLowerCase() === 'echoarea' &&
         typeof lineParts[4] !== 'undefined' && // echotag element
         typeof lineParts[6] !== 'undefined' // path element
      );

      if( !echoAreaLine ) return nextLine; // not an echoarea line

      // do not attempt anything if an echoarea line already has a description
      if( lineParts.indexOf('-d') > -1 ) return nextLine;
      if( lineParts.indexOf('-D') > -1 ) return nextLine;

      var echotagIDX, pathIDX;
      if( lineParts[0].length > 0 ){
         echotagIDX = 2;
         pathIDX = 4;
      } else {
         echotagIDX = 4;
         pathIDX = 6;
      }

      var descriptionElement = contentCSV.find(function(elementCSV){
         return elementCSV.echotag.toLowerCase() ===
            lineParts[echotagIDX].toLowerCase();
      });
      if( typeof descriptionElement === 'undefined' ) return nextLine;

      lineParts[pathIDX] += ' -d "' + descriptionElement.description + '"';
      return lineParts.join('');
   }).join('');

   writeFileOrDie(
      filenameHPT, contentHPT, options.outputEncoding, options.rusMode
   );
   clog('');
   if( options.rusMode ){
      clog('Готово.');
   } else {
      clog('Done.');
   }
};
