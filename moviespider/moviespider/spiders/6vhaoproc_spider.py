# -*- coding: utf-8 -*-

from scrapy.spider import Spider
from scrapy.selector import Selector

from moviespider.items import Cili006Item
from moviespider.moviedb import MovieDB

import scrapy

class W6vhaoProcSpider(Spider):
    moviedb = MovieDB()
    name = "w6vhaoproc"
    allowed_domains = ["6chao.com"]

    def start_requests(self):
        lst = self.moviedb.getURL_6vhao()
        lstreq = []
        for cur in lst:
            req = scrapy.FormRequest(cur[0], callback=self.search_parse)
            #req = scrapy.FormRequest("http://www.ygdy8.net/%s" % (cur[1]), callback=self.search_parse)
            req.__setattr__('w6vhaourl', cur[0])
            lstreq.append(req)
            #break
        return lstreq

    def search_parse(self, response):
        sel = Selector(response)

        print 'myparam is %s' % (response.request.w6vhaourl)

        proc = 0
        main = sel.xpath('//a')
        for cur in main:
            #print 'cur is %s' % (cur.extract())
            url = cur.xpath('./@href')
            if len(url) > 0:
                if url[0].extract().find('ed2k') == 0 or url[0].extract().find('ftp') == 0:
                    #print 'cur is %s' % (cur.extract())
                    proc = 1
                    self.moviedb.insCommonFile(url[0].extract(), cur.xpath('./text()')[0].extract())

        if proc == 1:
            self.moviedb.updMovie_6vhao(response.request.w6vhaourl, 1)

        return []