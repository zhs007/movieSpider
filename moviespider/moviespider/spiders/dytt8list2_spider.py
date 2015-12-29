# -*- coding: utf-8 -*-

from scrapy.spider import Spider
from scrapy.selector import Selector

from moviespider.items import Cili006Item
from moviespider.moviedb import MovieDB

import scrapy

class Dytt8List2Spider(Spider):
    moviedb = MovieDB()
    name = "dytt8list2"
    allowed_domains = ["ygdy8.net"]

    def start_requests(self):
        lstreq = []

        baseurl = "http://www.ygdy8.net/html/gndy/dyzz/list_23_%d.html"
        max = 133
        for cur in range(1, max):
            req = scrapy.FormRequest(baseurl % (cur), callback=self.search_parse)
            lstreq.append(req)
            #break
        return lstreq

    def search_parse(self, response):
        sel = Selector(response)

        lst = sel.css('td[height="26"]>b')
        for cur in lst:
            #print "cur is %s" % (cur.extract())
            cura = cur.xpath('./a/@href')[0].extract()
            print "cur is %s" % (cura)

            tarr1 = cura.split('/')
            tarr2 = tarr1[len(tarr1) - 1].split('.')
            print 'curmovie id is ' + tarr2[0]

            self.moviedb.insMovie_dytt8((int)(tarr2[0]), cura, '')

        return []