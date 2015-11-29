# -*- coding: utf-8 -*-

from scrapy.spider import Spider
from scrapy.selector import Selector

from moviespider.items import Cili006Item
from moviespider.moviedb import MovieDB

import scrapy

class DoubanSearchSpider(Spider):
    moviedb = MovieDB()
    name = "doubansearch"
    allowed_domains = ["douban.com"]

    def start_requests(self):
        lst = self.moviedb.getMovie_cili006search()
        lstreq = []
        for cur in lst:
            req = scrapy.FormRequest("http://www.douban.com/search?cat=1002&q=%s" % (cur[0]), callback=self.search_parse)
            req.__setattr__('cname', cur[0])
            lstreq.append(req)
            break
        return lstreq

    def search_parse(self, response):
        sel = Selector(response)
        print 'myparam is ' + response.request.cname
        arrmovie = sel.css('div.result')
        print 'arrmove len is %d' % (len(arrmovie))
        #items = []
        for curmovie in arrmovie:
            print 'curmovie is ' + curmovie.extract()
            url = curmovie.xpath('./div[@class="pic"]/a/@href')
            #print 'href is ' + url.__str__()
            return [scrapy.FormRequest(url[0].extract(), callback=self.main_parse)]
            #item = Cili006Item()
            #item['magnet'] = curmovie.xpath('./@magnet')[0].extract()
            #item['ed2k'] = curmovie.xpath('./@ed2k')[0].extract()
            #item['topic_id'] = curmovie.xpath('./@topic_id')[0].extract()
            #item['filename'] = curmovie.xpath('./span[@class="b"]/a/text()')[0].extract()
            #self.moviedb.addMovie_cili006(item)
            #items.append(item)
        #return items

    def main_parse(selfself, response):
        sel = Selector(response)
        arrmeta = sel.xpath('/html/head/meta')
        for curmeta in arrmeta:
            print 'curmeta is ' + curmeta.extract()
        return []