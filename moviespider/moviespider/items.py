# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class MoviespiderItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass

class Cili006Item(scrapy.Item):
    magnet = scrapy.Field()
    ed2k = scrapy.Field()
    topic_id = scrapy.Field()
    filename = scrapy.Field()