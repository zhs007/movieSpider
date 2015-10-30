# -*- coding: utf-8 -*-

from scrapy.spider import Spider
from scrapy.selector import Selector

import scrapy

from moviespider.items import Cili006Item

from moviespider.moviedb import MovieDB

class AcfunSpider(Spider):
    name = "acfun"
    allowed_domains = ["acfun.tv"]
    start_urls = [
        "http://www.acfun.tv/v/list97/index.htm"
    ]

    def start_requests(self):
        return [scrapy.FormRequest('http://localhost:8089',
                                   formdata={'url': 'http://m.acfun.tv/list/#channel=97'},
                                   callback=self.parse)]

    def parse(self, response):
        #print response.body
        #moviedb = MovieDB()
        sel = Selector(response)
        arrmovie = sel.xpath('/html/body/div[@id="stage"]/section[@id="content"]/div[@class="mainer"]/div[@class="part"]/div[@class="unit"]')
        items = []
        for curmovie in arrmovie:
            print 'curmovie is ' + curmovie.extract()
            #item = Cili006Item()
            #item['magnet'] = curmovie.xpath('./@magnet')[0].extract()
            #item['ed2k'] = curmovie.xpath('./@ed2k')[0].extract()
            #item['topic_id'] = curmovie.xpath('./@topic_id')[0].extract()
            #item['filename'] = curmovie.xpath('./span[@class="b"]/a/text()')[0].extract()
            #moviedb.addMovie_cili006(item)
            #items.append(item)
        return items