# -*- coding: utf-8 -*-

from scrapy.spider import Spider
from scrapy.selector import Selector

from moviespider.items import Cili006Item
from moviespider.moviedb import MovieDB

import scrapy

class DoubanSearch2Spider(Spider):
    moviedb = MovieDB()
    name = "doubansearch2"
    allowed_domains = ["douban.com"]
    curbegin = 0
    curid = 0
    curname = ''

    def startnext(self):
        return [scrapy.FormRequest("http://movie.douban.com/subject_search?start=%d&search_text=%s&cat=1002" % (self.curbegin, self.curname), callback=self.search_parse)]

    def start_requests(self):
        lst = self.moviedb.getMovie_doubansearch2()
        for cur in lst:
            self.curbegin = 0
            self.curid = cur[1]
            self.curname = cur[0]
            return self.startnext()
        return []
        # lst = self.moviedb.getMovie_doubansearch()
        # lstreq = []
        # for cur in lst:
        #     print cur[0]
        #     print cur[1]
        #     if len(cur[2]) > 0:
        #         req = scrapy.FormRequest("http://www.douban.com/search?cat=1002&q=%s %s" % (cur[0], cur[2]), callback=self.search_parse)
        #         req.__setattr__('searchcname', cur[0])
        #         req.__setattr__('doubansearchid', cur[1])
        #         lstreq.append(req)
        #     else:
        #         req = scrapy.FormRequest("http://www.douban.com/search?cat=1002&q=%s" % (cur[0]), callback=self.search_parse)
        #         req.__setattr__('searchcname', cur[0])
        #         req.__setattr__('doubansearchid', cur[1])
        #         lstreq.append(req)
        #     #break
        # return lstreq

    def search_parse(self, response):
        sel = Selector(response)
        #print 'myparam is %d' % (response.request.doubansearchid)
        arrmovie = sel.css('a.nbg')
        #print 'arrmove len is %d' % (len(arrmovie))
        if len(arrmovie) <= 0:
            self.moviedb.procMovie_doubansearch2(self.curid, self.curbegin)
            return self.start_requests()

        self.curbegin += 15

        for curmovie in arrmovie:
            print 'curmovie is ' + curmovie.extract()
            title = curmovie.xpath('./@title')
            print 'title is ' + title[0].extract()
            url = curmovie.xpath('./@href')
            print 'url is ' + url[0].extract()
            tarr = url[0].extract().split('/')
            #print tarr[len(tarr) - 2]
            self.moviedb.addMovie_douban(tarr[len(tarr) - 2], title[0].extract())

        return self.startnext()
        return []

    # def main_parse(self, response, searchcname, doubansearchid):
    #     sel = Selector(response)
    #
    #     proc = 2
    #
    #     arrkeyword = sel.xpath('/html/head/meta[@name="keywords"]/@content')
    #     for curkeyword in arrkeyword:
    #         print 'keywords is ' + curkeyword.extract()
    #         ci = curkeyword.extract().find(searchcname)
    #         if ci == 0:
    #             proc = 1
    #
    #     #arrspan = sel.xpath('/html/body/div[@id="wrapper"]/div[@id="content"]/div[@class="grid-16-8 clearfix"]/div[@class="article"]/div[@class="indent clearfix"]/div[@class="subjectwrap clearfix"]/div[@class="subject clearfix"]/div[@id="info"]/span[@class="pl"]');
    #     arrinfo = sel.css('div#info')
    #     for curinfo in arrinfo:
    #         print 'info is ' + curinfo.extract()
    #         bi = curinfo.extract().find(u'>又名:</span>');
    #         tstr = curinfo.extract()[bi + len(u'>又名:</span>'):]
    #         ei = tstr.find('<br>')
    #         tsrt1 = tstr[0:ei].strip()
    #         print 'other name is ' + tsrt1
    #         if tsrt1.find(searchcname) == 0:
    #             proc = 1
    #         else:
    #             t2 = searchcname
    #             if searchcname.find(' ') >= 0:
    #                 tarr2 = searchcname.split(' ')
    #                 t2 = tarr2[0];
    #                 for ii in range(1, len(tarr2) - 1):
    #                     t2 += ' '
    #                     t2 += tarr2[ii]
    #
    #             print 'searchname is ' + searchcname
    #             print 't2 is ' + t2
    #
    #             tarr1 = tsrt1.split('/')
    #             for t1 in tarr1:
    #                 t1 = t1.strip()
    #                 print 't1 is ' + t1
    #                 if t1.find(t2) == 0:
    #                     proc = 1
    #                 elif t1.find(searchcname) == 0:
    #                     proc = 1
    #
    #     print 'proc is %d' % (proc)
    #
    #     arrmobile = sel.xpath('/html/head/meta[@name="mobile-agent"]/@content')
    #     for curmobile in arrmobile:
    #         print 'mobile-agent is ' + curmobile.extract()
    #         tarr = curmobile.extract().split('/')
    #         #print tarr[len(tarr) - 2]
    #         self.moviedb.procMovie_doubansearch(doubansearchid, proc, tarr[len(tarr) - 2])
    #     return []