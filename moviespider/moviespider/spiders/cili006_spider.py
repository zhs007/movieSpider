# -*- coding: utf-8 -*-

from scrapy.spider import Spider
from scrapy.selector import Selector

from moviespider.items import Cili006Item

from moviespider.moviedb import MovieDB

class Cili006Spider(Spider):
    name = "cili006"
    allowed_domains = ["cili07.com"]
    start_urls = [
        "http://cili07.com/"
    ]

    def parse(self, response):
        moviedb = MovieDB()
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
            moviedb.addMovie_cili006(item)
            #items.append(item)
        return items
