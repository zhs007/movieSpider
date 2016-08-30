"use strict";

var shell = require('shelljs');

shell.cd('../moviespider');
shell.exec('/usr/local/bin/scrapy crawl cili006');
//shell.exec('/usr/local/bin/scrapy crawl dytt8');
//shell.exec('/usr/local/bin/scrapy crawl w6vhao');
//shell.exec('/usr/local/bin/scrapy crawl dytt8proc');
//shell.exec('/usr/local/bin/scrapy crawl w6vhaoproc');
//
//shell.cd('../movieproc');
//shell.exec('/root/.nvm/versions/node/v5.1.0/bin/node bin/movieproc.js');