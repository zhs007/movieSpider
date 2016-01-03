"use strict";

var shell = require('shelljs');

shell.cd('../moviespider');
shell.exec('scrapy crawl cili006');
shell.exec('scrapy crawl dytt8');
shell.exec('scrapy crawl w6vhao');
shell.exec('scrapy crawl dytt8proc');
shell.exec('scrapy crawl w6vhaoproc');

shell.cd('../movieproc');
shell.exec('/root/.nvm/versions/node/v5.1.0/bin/node bin/movieproc.js');