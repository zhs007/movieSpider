# -*- coding: utf-8 -*-

from scrapy.spider import Spider
from scrapy.selector import Selector

from moviespider.items import Cili006Item
from moviespider.moviedb import MovieDB

import scrapy

class Cili006Spider(Spider):
    moviedb = MovieDB()
    name = "cili006search"
    allowed_domains = ["cili007.com"]

    def start_requests(self):
        lst = self.moviedb.getMovie_cili006search()
        lstreq = []
        for cur in lst:
            lstreq.append(scrapy.FormRequest("http://cili007.com/?topic_title3=%s" % (cur[0]),
                                   callback=self.parse))
        return lstreq

    def parse(self, response):
        print "OK!"
        sel = Selector(response)
        arrmovie = sel.xpath('/html/body/div[@class="middle-box"]/div[@class="w"]/dl[@class="list-item"]/dd')
        items = []
        for curmovie in arrmovie:
            print 'curmovie is ' + curmovie.extract()
            item = Cili006Item()
            item['magnet'] = curmovie.xpath('./@magnet')[0].extract()
            item['ed2k'] = curmovie.xpath('./@ed2k')[0].extract()
            item['topic_id'] = curmovie.xpath('./@topic_id')[0].extract()
            item['filename'] = curmovie.xpath('./span[@class="b"]/a/text()')[0].extract()
            self.moviedb.addMovie_cili006(item)
            #items.append(item)
        return items
