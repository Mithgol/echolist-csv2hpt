[![(a histogram of downloads)](https://nodei.co/npm-dl/echolist-csv2hpt.png?height=3)](https://npmjs.org/package/echolist-csv2hpt)

This package (`echolist-csv2hpt`) is a CLI tool that copies Fidonet echomail area descriptions from a CSV echolist to an HPT areas file.

It requires [Node.js](http://nodejs.org/) to run and [npm](https://www.npmjs.org/) to be installed.
* Starting from v1.0.0, this module requires Node.js version 4.0.0 or newer.
* You may run older versions of this module in Node.js version 0.10.x or 0.12.x. These older versions, however, had to contain an additional dependency ([`array.prototype.find`](https://www.npmjs.com/package/array.prototype.find)) as a polyfill for a missing [ECMAScript 2015 (ES6) feature](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) which is now a part of Node.js.

## Installing echolist-csv2hpt

[![(npm package version)](https://nodei.co/npm/echolist-csv2hpt.png?downloads=true&downloadRank=true)](https://npmjs.org/package/echolist-csv2hpt)

### Installing as a global application

* Latest packaged version: `npm install -g echolist-csv2hpt`

* Latest githubbed version: `npm install -g https://github.com/Mithgol/echolist-csv2hpt/tarball/master`

The application becomes installed globally and appears in the `PATH`. Then use `echolist-csv2hpt` command to run the application.

### Installing as a portable application

Instead of the above, download the [ZIP-packed](https://github.com/Mithgol/echolist-csv2hpt/archive/master.zip) source code of the application and unpack it to some directory. Then run `npm install --production` in that directory.

You may now move that directory (for example, on a flash drive) across systems as long as they have the required version of Node.js installed.

Unlike the above (`npm -g`), the application does not appear in the `PATH`, and thus you'll have to run it directly from the application's directory. You'll also have to run `node echolist-csv2hpt [parameters]` instead of `echolist-csv2hpt [parameters]`.

## Running echolist-csv2hpt

You may run `echolist-csv2hpt` without parameters to get help about its command line arguments.

(Run `echolist-csv2hpt --rus` to get Russian help instead of English.)

## Locking files

The application **does not** lock any files and **does not** create any “lock files” (flag files, semaphore files). The application's user should control the access to the HPT's configuration.

## Testing echolist-csv2hpt

[![(build testing status)](https://img.shields.io/travis/Mithgol/echolist-csv2hpt/master.svg?style=plastic)](https://travis-ci.org/Mithgol/echolist-csv2hpt)

It is necessary to install [JSHint](http://jshint.com/) for testing.

* You may install JSHint globally (`npm install jshint -g`) or locally (`npm install jshint` in the directory of echolist-csv2hpt).

After that you may run `npm test` (in the directory of echolist-csv2hpt). Only the JS code errors are caught; the code's behaviour is not tested.

## License

MIT license (see the `LICENSE` file).
