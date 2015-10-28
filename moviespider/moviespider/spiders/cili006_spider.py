# -*- coding: utf-8 -*-

from scrapy.spider import Spider
from scrapy.selector import Selector

from moviespider.items import Cili006Item

class Cili006Spider(Spider):
    name = "cili006"
    allowed_domains = ["cili006.com"]
    start_urls = [
        "http://cili006.com/"
    ]

    def parse(self, response):
        #with open('taobaomovie-movielist.html', 'w') as f:
        #    f.write(response.body)
        sel = Selector(response)
        arrmovie = sel.xpath('/html/body/div[@class="middle-box"]/div[@class="w"]/dl[@class="list-item"]/dd')
        items = []
        for curmovie in arrmovie:
            print 'curmovie is ' + curmovie.extract()
            item = Cili006Item()
            item['magnet'] = curmovie.xpath('text()').extract()
            item['ed2k'] = curmovie.xpath('dd/text()').extract()
            item['topic_id'] = curmovie.xpath('.//dd/@topic_id').extract()
            item['filename'] = curmovie.xpath('.//dd/span[@class="b"]/a/text()').extract()
            items.append(item)
        return items
