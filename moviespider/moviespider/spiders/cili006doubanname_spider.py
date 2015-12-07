# -*- coding: utf-8 -*-

from scrapy.spider import Spider
from scrapy.selector import Selector

from moviespider.items import Cili006Item
from moviespider.moviedb import MovieDB

import scrapy

class Cili006DoubanNameSpider(Spider):
    moviedb = MovieDB()
    name = "cili006doubanname"
    allowed_domains = ["cili007.com"]

    def start_requests(self):
        lst = self.moviedb.getMovie_cili006doubanname()
        lstreq = []
        for cur in lst:
            req = scrapy.FormRequest("http://cili007.com/?topic_title3=%s" % (cur[0]), callback=self.parse)
            req.__setattr__('cili006searchid', cur[1])
            lstreq.append(req)

        return lstreq

    def parse(self, response):
        #print "OK!"
        sel = Selector(response)
        arrmovie = sel.xpath('/html/body/div[@class="middle-box"]/div[@class="w"]/dl[@class="list-item"]/dd')
        items = []
        proc = 0
        for curmovie in arrmovie:
            proc = 1
            print 'curmovie is ' + curmovie.extract()
            item = Cili006Item()
            item['magnet'] = curmovie.xpath('./@magnet')[0].extract()
            item['ed2k'] = curmovie.xpath('./@ed2k')[0].extract()
            item['topic_id'] = curmovie.xpath('./@topic_id')[0].extract()
            item['filename'] = curmovie.xpath('./span[@class="b"]/a/text()')[0].extract()
            self.moviedb.addMovie_cili006(item)
            #items.append(item)

        pages = sel.css('div.pages')
        pagea = pages.xpath('./a')
        if len(pagea) > 0:
            proc = 2

        if proc > 0:
            self.moviedb.procMovie_cili006doubanname(response.request.cili006searchid, proc)

        return items
