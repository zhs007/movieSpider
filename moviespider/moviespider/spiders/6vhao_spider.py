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

        baseurl = "http://www.6vhao.com/dy/index_%d.html"

        max = 131
        for cur in range(2, max):
            req = scrapy.FormRequest(baseurl % (cur), callback=self.search_parse)
            lstreq.append(req)
            #break
        return lstreq

    def search_parse(self, response):
        sel = Selector(response)

        lst = sel.css('ul.list')
        for cur in lst:
            #print "cur is %s" % (cur.extract())
            cura = cur.xpath('./li/a/@href')[1].extract()
            print "cur is %s" % (cura)

            tarr1 = cura.split('/')
            tarr2 = tarr1[len(tarr1) - 1].split('.')
            print 'curmovie id is ' + tarr2[0]

            self.moviedb.insMovie_dytt8((int)(tarr2[0]), cura, '')

        return []