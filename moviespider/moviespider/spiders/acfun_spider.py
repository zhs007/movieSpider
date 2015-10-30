# -*- coding: utf-8 -*-

from scrapy.spider import Spider
from scrapy.selector import Selector

from moviespider.items import Cili006Item

from moviespider.moviedb import MovieDB

class AcfunSpider(Spider):
    name = "acfun"
    allowed_domains = ["acfun.tv"]
    start_urls = [
        "http://www.acfun.tv/v/list97/index.htm"
    ]

    def parse(self, response):
        moviedb = MovieDB()
        sel = Selector(response)
        arrmovie = sel.xpath('/html/body/div[@id="stage"]/div[@id="mainer"]/div[@id="mainer-inner"]/div[@id="area-a"]/div[@class="area-inner"]/div[@class="l"]/div[@id="block-content-channel"]/div[@class="mainer th-large"]')
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