var fs = require('fs');
var path = require('path');
var iconv = require('iconv-lite');

var clog = console.log;

// tribute to the “R.O.D” 2001—2002 anime OVA
var readOrDie = function(filename, encoding, rusMode){
   try {
      return iconv.decode( fs.readFileSync(filename), encoding );
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

var writeOrDie = function(filename, content, encoding, rusMode){
   try {
      fs.writeFileSync(filename, iconv.encode(content, encoding));
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

var getDescriptionElementFromContentCSV = function(contentCSV, lcEchotag){
   return contentCSV.map(function(fileCSV){
      var foundElement = fileCSV.find(
         elementCSV => elementCSV.lcEchotag === lcEchotag
      );
      if( typeof foundElement === 'undefined' ) return null;
      return foundElement;
   }).filter( nextElement => nextElement !== null )[0];
};

module.exports = function(filenamesCSV, filenameHPT, options){
   filenamesCSV = filenamesCSV.map(
      nextFilename => path.resolve(__dirname, nextFilename)
   );
   filenameHPT = path.resolve(__dirname, filenameHPT);

   var contentCSV = filenamesCSV.map(function(nextFilename){
      return readOrDie(
         nextFilename, options.inputEncoding, options.rusMode
      ).split(/(?:\r|\n)+/).map(function(nextLine){
         if( nextLine.length < 1 ) return null; // empty line
         if( nextLine.indexOf(';') === 0 ) return null; // comment line

         var lineParts = nextLine.split(',');
         if( lineParts.length !== 6 ){
            clog('');
            if( options.rusMode ){
               clog('В файле ' + nextFilename);
               clog('обнаружена строка с неожиданным количеством запятых:');
            } else {
               clog('In the file ' + nextFilename);
               clog('a line with unexpected number of commas is detected:');
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
            lcEchotag: lineParts[1].toLowerCase(),
            description: lineParts[2].replace(/"/g, '') // kill double quotes
         };
      }).filter( nextLine => nextLine !== null );
   });

   var contentHPT = readOrDie(
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

      var lcEchotagHPT;
      if( lineParts.indexOf('-d') > -1 || lineParts.indexOf('-D') > -1 ){
         // this echoarea line already has a description
         if(!( options.replaceMode )) return nextLine;

         // entered the mode of replacement
         var parts = /^(\s*EchoArea\s+)(\S+)(\s.+\s-d\s+")([^"]+)(".*)$/.exec(
            nextLine
         );
         if( parts === null ){
            clog('');
            if( options.rusMode ){
               clog('В файле ' + filenameHPT);
               clog('обнаружен неожиданный формат описания области:');
            } else {
               clog('In the file ' + filenameHPT);
               clog('an unexpected format of area description is detected:');
            }
            clog(nextLine);
            if( options.rusMode ){
               clog('Эта строка проигнорирована.');
            } else {
               clog('That line is ignored.');
            }
            return nextLine;
         }

         lcEchotagHPT = parts[2].toLowerCase();

         var elDescription = getDescriptionElementFromContentCSV(
            contentCSV, lcEchotagHPT
         );
         if( typeof elDescription === 'undefined' ) return nextLine;

         return [
            parts[1], // EchoArea
            parts[2], // an echotag
            parts[3], // pre-description
            elDescription.description,
            parts[5] // post-description
         ].join('');
      }

      var echotagIDX, pathIDX;
      if( lineParts[0].length > 0 ){
         echotagIDX = 2;
         pathIDX = 4;
      } else {
         echotagIDX = 4;
         pathIDX = 6;
      }
      lcEchotagHPT = lineParts[echotagIDX].toLowerCase();

      var descriptionElement = getDescriptionElementFromContentCSV(
         contentCSV, lcEchotagHPT
      );
      if( typeof descriptionElement === 'undefined' ) return nextLine;

      lineParts[pathIDX] += ' -d "' + descriptionElement.description + '"';
      return lineParts.join('');
   }).join('');

   writeOrDie(
      filenameHPT, contentHPT, options.outputEncoding, options.rusMode
   );
   clog('');
   if( options.rusMode ){
      clog('Готово.');
   } else {
      clog('Done.');
   }
};
