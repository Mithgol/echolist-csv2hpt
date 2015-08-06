#!/usr/bin/env node

var thisAPI = require('./api.js');
var clog = console.log;

var params = [].concat(process.argv);
params.shift(); // 'node'
params.shift(); // 'echolist-csv2hpt'

var rusMode = false;
params = params.filter(function(nextParam){
   if( nextParam.toLowerCase() === '--rus' ){
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
      clog('An optional "--rus" parameter tells the application to use');
      clog('Russian messages instead of English.');
      clog('');
      clog('(It only affects console output, not the output file.)');
   }
   process.exit(1);
}

var filenameCSV = params[0];
var filenameHPT = params[1];

thisAPI(filenameCSV, filenameHPT, rusMode);
