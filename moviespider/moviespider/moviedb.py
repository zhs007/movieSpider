# -*- coding: utf-8 -*-

import sqlite3
import base64

from moviespider.items import Cili006Item

class MovieDB:
    dbname = 'movie.db'

    def __init__(self):
        self.conn = sqlite3.connect(MovieDB.dbname)
        if not self.hasTable('cili006'):
            self.createTable_cili006()

    def hasTable(self, tblname):
        cur = self.conn.cursor()
        cur.execute("SELECT tbl_name FROM sqlite_master WHERE type='table'")
        res = cur.fetchall()
        for line in res:
            if line == tblname:
                return True

        return False

    def createTable_cili006(self):
        cur = self.conn.cursor()
        sql = '''CREATE TABLE IF NOT EXISTS `cili006`(
          `id` INT NOT NULL,
          `filename` VARCHAR(1024) NOT NULL,
          `magnet` VARCHAR(1024) NOT NULL,
          `ed2k` VARCHAR(1024) NOT NULL,
          PRIMARY KEY (`id`))'''
        cur.execute(sql)

    def addMovie_cili006(self, item):
        cur = self.conn.cursor()
        sql = "select id from cili006 where id = %s" % (item['topic_id'])
        cur.execute(sql)
        res = cur.fetchall()
        cur.close()
        #print sql
        #print len(res)
        if len(res) > 0:
            return False

        #print item['filename'].__class__
        filename = item['filename'].replace("'", "''")
        magnet = item['magnet'].replace("'", "''")
        ed2k = item['ed2k'].replace("'", "''")
        sql = "INSERT INTO cili006(id, filename, magnet, ed2k) values(%s, '%s', '%s', '%s')" % (item['topic_id'], filename, magnet, ed2k)
        #print sql
        self.conn.execute(sql)
        self.conn.commit()

        return True

    def getMovie_cili006search(self):
        cur = self.conn.cursor()
        sql = "select cname, id from cili006search where proc = 0"
        cur.execute(sql)
        res = cur.fetchall()
        cur.close()
        return res

    def procMovie_cili006search(self, sid, val):
        #cur = self.conn.cursor()
        sql = "update cili006search set proc = %d where id = %d" % (val, sid)
        self.conn.execute(sql)
        self.conn.commit()

    def getMovie_doubansearch(self):
        cur = self.conn.cursor()
        sql = "select cname, id, nameex from doubansearch where proc = 0"
        cur.execute(sql)
        res = cur.fetchall()
        cur.close()
        return res

    def procMovie_doubansearch(self, sid, proc, doubanid):
        #cur = self.conn.cursor()
        #url1 = url1.replace("'", "''")
        sql = "update doubansearch set proc = %d, doubanid = '%s' where id = %d" % (proc, doubanid, sid)
        self.conn.execute(sql)
        self.conn.commit()

    def hasMovie_douban(self, doubanid):
        cur = self.conn.cursor()
        sql = "select dbid from doubanmovie where dbid = %s" % (doubanid)
        cur.execute(sql)
        res = cur.fetchall()
        cur.close()
        return len(res) > 0

    def addMovie_douban(self, doubanid, cname):
        if self.hasMovie_douban(doubanid):
            return

        cname = cname.replace("'", "''")
        sql = "INSERT INTO doubanmovie(dbid, cname) values(%s, '%s')" % (doubanid, cname)
        #print sql
        self.conn.execute(sql)
        self.conn.commit()

    def getDoubanID_douban(self):
        cur = self.conn.cursor()
        sql = "select dbid from doubanmovie where proc = 0"
        cur.execute(sql)
        res = cur.fetchall()
        cur.close()
        return res

    def getMovie_doubansearch2(self):
        cur = self.conn.cursor()
        sql = "select name, id from doubansearch2 where proc = 0"
        cur.execute(sql)
        res = cur.fetchall()
        cur.close()
        return res

    def procMovie_doubansearch2(self, id, proc):
        sql = "update doubansearch2 set proc = %d where id = %d" % (proc, id)
        self.conn.execute(sql)
        self.conn.commit()

    def updMovie_doubanmovie(self, doubanid, cname, img):
        cname = cname.replace("'", "''")
        sql = "update doubanmovie set proc = 1, cname = '%s', img = '%s' where dbid = %d" % (cname, img, doubanid)
        self.conn.execute(sql)
        self.conn.commit()

    def hasMovieName_doubanmovie(self, doubanid, name):
        cur = self.conn.cursor()
        sql = "select id from doubanmoviename where dbid = %d and name = '%s'" % (doubanid, name)
        cur.execute(sql)
        res = cur.fetchall()
        cur.close()
        return len(res) > 0

    def addMovieName_doubanmovie(self, doubanid, name):
        if self.hasMovieName_doubanmovie(doubanid, name):
            return

        name = name.replace("'", "''")
        sql = "insert into doubanmoviename(dbid, name) values(%d, '%s')" % (doubanid, name)
        self.conn.execute(sql)
        self.conn.commit()
