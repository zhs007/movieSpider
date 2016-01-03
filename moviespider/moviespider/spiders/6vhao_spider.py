# -*- coding: utf-8 -*-

from scrapy.spider import Spider
from scrapy.selector import Selector

from moviespider.items import Cili006Item
from moviespider.moviedb import MovieDB

import scrapy

class W6vhaoSpider(Spider):
    moviedb = MovieDB()
    name = "w6vhao"
    allowed_domains = ["6vhao.net"]

    def start_requests(self):
        lstreq = []

        baseurl0 = "http://www.6vhao.com/dy/index.html"
        req = scrapy.FormRequest(baseurl0, callback=self.search_parse)
        lstreq.append(req)

        return lstreq

        baseurl = "http://www.6vhao.com/dy/index_%d.html"

        max = 131
        for cur in range(2, max):
            req = scrapy.FormRequest(baseurl % (cur), callback=self.search_parse)
            lstreq.append(req)
            #break
        return lstreq

    def search_parse(self, response):
        sel = Selector(response)

        lst = sel.css('ul.list')[0].xpath('./li')
        for cur in lst:
            #print "cur is %s" % (cur.extract())
            cura = cur.xpath('./a/@href')[0].extract()
            #print "cur is %s" % (cura)

            at = cur.xpath('./a/text()')
            if len(at) > 0:
                curn = cur.xpath('./a/text()')[0].extract()
            else:
                curn = cur.xpath('./a/font/text()')[0].extract()

            bt = curn.find(u'《')
            et = curn.find(u'》')
            if bt == -1 or et == -1:
                name = curn
            else:
                name = curn[(bt + 1):et]

            #print 'curmovie name is ' + name

            self.moviedb.insMovie_6vhao(cura, name)

        return []