# -*- coding: utf-8 -*-

from scrapy.spider import Spider
from scrapy.selector import Selector

from moviespider.items import Cili006Item
from moviespider.moviedb import MovieDB

import scrapy

class DoubanSearch2Spider(Spider):
    moviedb = MovieDB()
    name = "doubanmovie"
    allowed_domains = ["douban.com"]

    def start_requests(self):
        lst = self.moviedb.getDoubanID_douban()
        lstreq = []
        for cur in lst:
            req = scrapy.FormRequest("http://movie.douban.com/subject/%d/" % (cur[0]), callback=self.search_parse)
            req.__setattr__('doubanid', cur[0])
            lstreq.append(req)
            #break
        return lstreq

    def search_parse(self, response):
        sel = Selector(response)

        print 'myparam is %d' % (response.request.doubanid)
        title = sel.css('title')[0].xpath('./text()')[0].extract().strip()
        print 'title is ' + title

        photo = sel.css('a.nbgnbg')[0]
        imgurl = photo.xpath('./img/@src')[0].extract()
        arr1 = imgurl.split('/')
        print 'img is ' + arr1[len(arr1) - 1]

        self.moviedb.updMovie_doubanmovie(response.request.doubanid, title, arr1[len(arr1) - 1])

        arrinfo = sel.css('div#info')
        for curinfo in arrinfo:
            print 'info is ' + curinfo.extract()
            bi = curinfo.extract().find(u'>又名:</span>');
            if bi > 0:
                tstr = curinfo.extract()[bi + len(u'>又名:</span>'):]
                ei = tstr.find('<br>')
                tsrt1 = tstr[0:ei].strip()
                print 'other name is ' + tsrt1
                tarr1 = tsrt1.split('/')
                for t1 in tarr1:
                    t1 = t1.strip()
                    print 't1 is ' + t1
                    self.moviedb.addMovieName_doubanmovie(response.request.doubanid, t1)

            break

        return []