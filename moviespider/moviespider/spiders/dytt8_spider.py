# -*- coding: utf-8 -*-

from scrapy.spider import Spider
from scrapy.selector import Selector

from moviespider.items import Cili006Item

from moviespider.moviedb import MovieDB

class Dytt8Spider(Spider):
    name = "dytt8"
    allowed_domains = ["dytt8.net"]
    start_urls = [
        "http://www.dytt8.net/index.html"
    ]

    def parse(self, response):
        moviedb = MovieDB()
        sel = Selector(response)
        lstmovie = sel.css('div.co_content2')
        arrmovie = lstmovie[0].xpath('./ul/a/@href')
        items = []
        procnums = 0
        for curmovie in arrmovie:
            procnums = procnums + 1
            print 'dytt8 proc ' + str(procnums)
            #print 'curmovie is ' + curmovie.extract()
            tarr1 = curmovie.extract().split('/')
            tarr2 = tarr1[len(tarr1) - 1].split('.')
            #print 'curmovie id is ' + tarr2[0]

            moviedb.insMovie_dytt8((int)(tarr2[0]), curmovie.extract(), '')
            #item = Cili006Item()
            #item['magnet'] = curmovie.xpath('./@magnet')[0].extract()
            #item['ed2k'] = curmovie.xpath('./@ed2k')[0].extract()
            #item['topic_id'] = curmovie.xpath('./@topic_id')[0].extract()
            #item['filename'] = curmovie.xpath('./span[@class="b"]/a/text()')[0].extract()
            #moviedb.addMovie_cili006(item)
            #items.append(item)
        return items
