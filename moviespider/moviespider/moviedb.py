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
            if line['tbl_name'] == tblname:
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
        #cur = self.conn.cursor()
        #print item['filename'].__class__
        filename = item['filename'].replace("'", "''")
        magnet = item['magnet'].replace("'", "''")
        ed2k = item['ed2k'].replace("'", "''")
        sql = "INSERT INTO cili006(id, filename, magnet, ed2k) values(%s, '%s', '%s', '%s')" % (item['topic_id'], filename, magnet, ed2k)
        print sql
        self.conn.execute(sql)
        self.conn.commit()
