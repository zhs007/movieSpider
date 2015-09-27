from scrapy.spider import Spider
from scrapy.selector import Selector

#from amazomspider.items import DmozItem

class TaobaoMovieSpider(Spider):
    name = "taobaomovie"
    allowed_domains = ["taobao.com"]
    start_urls = [
        # "http://h5.m.taobao.com/app/movie/pages/redeem/home.html",
        "http://h5.m.taobao.com/app/movie/pages/redeem/movie-list.html"
    ]

    def parse(self, response):
        with open('taobaomovie-movielist.html', 'w') as f:
            f.write(response.body)
        #sel = Selector(response)
        # sites = sel.xpath('//ul[@class="directory-url"]/li')
        # items = []
        # for site in sites:
        #     item = DmozItem()
        #     item['title'] = site.xpath('a/text()').extract()
        #     item['link'] = site.xpath('a/@href').extract()
        #     item['desc'] = site.xpath('text()').extract()
        #     items.append(item)
        # return items
