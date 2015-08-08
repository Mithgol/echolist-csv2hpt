#!/usr/bin/env node

var thisAPI = require('./api.js');
var clog = console.log;

var params = [].concat(process.argv);
params.shift(); // 'node'
params.shift(); // 'echolist-csv2hpt'

var inputEncoding = 'cp866';
var outputEncoding = 'cp866';
var rusMode = false;
params = params.filter(function(nextParam){
   if( nextParam.indexOf('--input=') === 0 ){
      inputEncoding = nextParam.slice('--input='.length);
      return false;
   } else if( nextParam.indexOf('--output=') === 0 ){
      outputEncoding = nextParam.slice('--output='.length);
      return false;
   } else if( nextParam.toLowerCase() === '--rus' ){
      rusMode = true;
      return false;
   }

   return true;
});

if( params.length < 2 ){
   clog('');
   if( rusMode ){
      clog('Использование:');
      clog('   echolist-csv2hpt inputCSV configHPT');
      clog('');
      clog('Параметры:');
      clog('');
      clog('inputCSV  -- путь ко входному файлу (CSV-эхолисту).');
      clog('');
      clog('configHPT -- путь к файлу конфигурации областей эхопочты HPT.');
      clog('');
      clog('Необязательный параметр "--rus" предписывает приложению');
      clog('употребление русских сообщений вместо английских.');
      clog('');
      clog('(Воздействует только на вывод в консоли, не на выходной файл.)');
      clog('');
      clog('Необязательные параметры "--input=CP866" и "--output=CP866"');
      clog('задают кодировки входного (CSV) и выходного (HPT) файла.');
      clog('Вместо CP866 в этих параметрах можно употреблять кодировки,');
      clog('https://github.com/ashtuchkin/iconv-lite поддерживаемые.');
      clog('');
      clog('По умолчанию используется кодировка CP866 (обычная на системе');
      clog('Windows в российском Фидонете, так что она употребляется');
      clog('наиболее часто).');
      clog('');
      clog('Можно указать несколько параметров inputCSV пред заключительным');
      clog('параметром configHPT. Описания областей эхопочты из более');
      clog('ранних параметров inputCSV получают приоритет над описаниями');
      clog('областей эхопочты из дальнейших параметров inputCSV.');
   } else {
      clog('Usage:');
      clog('   echolist-csv2hpt inputCSV configHPT');
      clog('');
      clog('Parameters:');
      clog('');
      clog('inputCSV  -- path to an input (CSV echolist) file.');
      clog('');
      clog('configHPT -- path to the HPT echomail area configuration file.');
      clog('');
      clog('An optional "--rus" parameter dictates the application to use');
      clog('Russian messages instead of English.');
      clog('');
      clog('(It only affects console output, not the output file.)');
      clog('');
      clog('Optional parameters "--input=CP866" and "--output=CP866" define');
      clog('the encodings of input (CSV) and output (HPT) file. Encodings');
      clog('supported by https://github.com/ashtuchkin/iconv-lite can be');
      clog('used in these parameters instead of CP866.');
      clog('');
      clog('CP866 is the default encoding (it is used by Windows users');
      clog('in Russian Fidonet, which is the largest use case).');
      clog('');
      clog('Several inputCSV parameters can be given before the final');
      clog('configHPT parameter. Echomail area descriptions from the');
      clog('earlier inputCSV parameters take precedence over the echomail');
      clog('area descriptions from the latter inputCSV parameters.');
   }
   process.exit(1);
}

var filenameHPT = params.pop();
var filenamesCSV = params;

thisAPI(
   filenamesCSV,
   filenameHPT,
   {
      rusMode: rusMode,
      inputEncoding: inputEncoding,
      outputEncoding: outputEncoding
   }
);
