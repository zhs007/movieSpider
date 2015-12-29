# -*- coding: utf-8 -*-

from scrapy.spider import Spider
from scrapy.selector import Selector

from moviespider.items import Cili006Item
from moviespider.moviedb import MovieDB

import scrapy

class Dytt8ProcSpider(Spider):
    moviedb = MovieDB()
    name = "dytt8proc"
    allowed_domains = ["dytt8.net", "ygdy8.net"]

    def start_requests(self):
        lst = self.moviedb.getURL_dytt8()
        lstreq = []
        for cur in lst:
            #req = scrapy.FormRequest("http://www.dytt8.net/%s" % (cur[1]), callback=self.search_parse)
            req = scrapy.FormRequest("http://www.ygdy8.net/%s" % (cur[1]), callback=self.search_parse)
            req.__setattr__('dytt8id', cur[0])
            lstreq.append(req)
            #break
        return lstreq

    def search_parse(self, response):
        sel = Selector(response)

        print 'myparam is %d' % (response.request.dytt8id)

        title = sel.css('title')[0].extract()
        bt = title.find(u'《')
        et = title.find(u'》')
        if bt == -1 or et == -1:
            name = title
        else:
            name = title[(bt + 1):et]

        print 'name is %s' % (name)

        main = sel.xpath('//td[@style="WORD-WRAP: break-word"]')[0]
        #main = sel.css('div#Zoom')[0]
        print 'main is %s' % (main.extract())
        main1 = main.xpath('./a/@href')
        if len(main1) >= 1:
            downurl = main1[0].extract()
        else:
            main1 = main.xpath('./u/font/a/@href')
            if len(main1) >= 1:
                downurl = main1[0].extract()
            else:
                main1 = main.xpath('./font/span/a/@href')
                if len(main1) >= 1:
                    downurl = main1[0].extract()
                else:
                    main1 = main.xpath('./table/tbody/tr/td/a/@href')
                    if len(main1) >= 1:
                        downurl = main1[0].extract()
                    else:
                        main1 = main.xpath('./p/a/@href')
                        if len(main1) >= 1:
                            downurl = main1[0].extract()
                        else:
                            downurl = main.xpath('./font/a/@href')[0].extract()

        print 'downurl is %s' % (downurl)

        self.moviedb.updMovie_dytt8(response.request.dytt8id, name, downurl, 1)
        #print 'downurl is %s' % (downurl[0].extract())
        #img = main.xpath('./span/table/tbody/tr/td/a')[0]
        #print 'img is %s' % (img.extract())

        return []