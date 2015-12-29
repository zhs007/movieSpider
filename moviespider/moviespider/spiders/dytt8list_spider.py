# -*- coding: utf-8 -*-

from scrapy.spider import Spider
from scrapy.selector import Selector

from moviespider.items import Cili006Item
from moviespider.moviedb import MovieDB

import scrapy

class Dytt8ListSpider(Spider):
    moviedb = MovieDB()
    name = "dytt8list"
    allowed_domains = ["ygdy8.net"]

    def start_requests(self):
        lstreq = []

        #baseurl = "http://www.ygdy8.net/html/gndy/china/list_4_%d.html"
        #max = 72
        #baseurl = "http://www.ygdy8.net/html/gndy/rihan/list_6_%d.html"
        #max = 21
        baseurl = "http://www.ygdy8.net/html/gndy/oumei/list_7_%d.html"
        max = 130
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
            cura = cur.xpath('./a/@href')[1].extract()
            print "cur is %s" % (cura)

            tarr1 = cura.split('/')
            tarr2 = tarr1[len(tarr1) - 1].split('.')
            print 'curmovie id is ' + tarr2[0]

            self.moviedb.insMovie_dytt8((int)(tarr2[0]), cura, '')

        return []