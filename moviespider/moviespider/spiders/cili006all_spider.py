# -*- coding: utf-8 -*-

from scrapy.spider import Spider
from scrapy.selector import Selector

from moviespider.items import Cili006Item
from moviespider.moviedb import MovieDB

import scrapy

class Cili006AllSpider(Spider):
    moviedb = MovieDB()
    name = "cili006all"
    allowed_domains = ["cili06.com"]
    maxid = 103627

    def start_requests(self):
        lstreq = []
        for cur in range(31, self.maxid + 1)[::-1]:
            if not self.moviedb.hasMovie_cili006(cur):
                req = scrapy.FormRequest("http://cili06.com/%d.html" % (cur), callback=self.parse)
                req.__setattr__('cili006searchid', cur)
                lstreq.append(req)

        return lstreq

    def parse(self, response):
        print "%d" % (response.request.cili006searchid)
        sel = Selector(response)

        item = Cili006Item()

        arrtitle = sel.css('div.desc-title')
        if len(arrtitle) <= 0:
            return []

        title = sel.css('div.desc-title')[0]
        print title.extract()
        item['filename'] = title.xpath('./h2/text()')[0].extract()
        print item['filename']
        #emindex = item['filename'].find('<em>')
        #print emindex
        #item['filename'] = item['filename'][0:emindex].strip()
        #print item['filename']

        item['magnet'] = ''
        item['ed2k'] = ''
        item['topic_id'] = response.request.cili006searchid

        arr = sel.css('div.desc-list-item')
        for cur in arr:
            ah = cur.xpath('./div[@class="t"]/a/@href')[0].extract()
            if ah.find('magnet') == 0:
                item['magnet'] = ah
            elif ah.find('ed2k') == 0:
                item['ed2k'] = ah

        self.moviedb.addMovie_cili006(item)

        return []
