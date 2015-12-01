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
        lst = self.moviedb.getMovie_doubansearch()
        lstreq = []
        for cur in lst:
            print cur[0]
            print cur[1]
            req = scrapy.FormRequest("http://www.douban.com/search?cat=1002&q=%s" % (cur[0]), callback=self.search_parse)
            req.__setattr__('searchcname', cur[0])
            req.__setattr__('doubansearchid', cur[1])
            lstreq.append(req)
            #break
        return lstreq

    def search_parse(self, response):
        sel = Selector(response)
        #print 'myparam is %d' % (response.request.doubansearchid)
        lstreq = []
        arrmovie = sel.css('div.result')
        print 'arrmove len is %d' % (len(arrmovie))
        for curmovie in arrmovie:
            print 'curmovie is ' + curmovie.extract()
            url = curmovie.xpath('./div[@class="pic"]/a/@href')
            #self.moviedb.procMovie_doubansearch(response.request.doubansearchid, 1, url[0].extract())

            myparam = [self, response.request.searchcname, response.request.doubansearchid]
            def myfunc(response):
                searchcname = myparam[1]
                doubansearchid = myparam[2]
                myparam[0].main_parse(response, searchcname, doubansearchid)

            req = scrapy.FormRequest(url[0].extract(), callback=myfunc)
            #req.__setattr__('searchcname', response.request.searchcname)
            #req.__setattr__('doubansearchid', response.request.doubansearchid)
            #print 'myparam is %d' % (req.doubansearchid)
            lstreq.append(req)
            break
        return lstreq

    def main_parse(self, response, searchcname, doubansearchid):
        sel = Selector(response)
        #print 'myparam is %d' % (doubansearchid)

        proc = 2
        arrkeyword = sel.xpath('/html/head/meta[@name="keywords"]/@content')
        for curkeyword in arrkeyword:
            print 'keywords is ' + curkeyword.extract()
            ci = curkeyword.extract().find(searchcname)
            if ci == 0:
                proc = 1
            #tarr = curkeyword.extract().split('/')
            #print tarr[len(tarr) - 2]
            #self.moviedb.procMovie_cili006search(response.request.cili006searchid, proc)

        arrmobile = sel.xpath('/html/head/meta[@name="mobile-agent"]/@content')
        for curmobile in arrmobile:
            print 'mobile-agent is ' + curmobile.extract()
            tarr = curmobile.extract().split('/')
            #print tarr[len(tarr) - 2]
            self.moviedb.procMovie_doubansearch(doubansearchid, proc, tarr[len(tarr) - 2])
        return []