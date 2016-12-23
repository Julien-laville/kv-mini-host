var path = require('path')
var sqlite3 = require('sqlite3')
var config = require(path.join(__dirname, '..', 'config.js'))
var dbPath = path.join(__dirname,'kvs.db')
var fs = require("fs");

module.exports = function(){
    return {
        store : function(key, value, cb) {
            var dbkv = new sqlite3.Database(dbPath);

            dbkv.run("INSERT into key_values (key, value) VALUES(?,?)", {1:key, 2:value}, function(error) {
                if(error) {
                    cb(error)
                } else {
                    cb(null, {status : 'success'})
                }
                dbkv.close()
            })
        },

        loadAll : function (cb) {
            var dbkv = new sqlite3.Database(dbPath);
            dbkv.all("SELECT * from key_values", function (error, rows) {
                if(error) {
                    cb(error);
                } else {
                    var keys = rows.map(function(r){return r.key})
                    cb(null, keys)
                }
                dbkv.close()
            })
        },

        load : function (keys, cb) {
            var dbkv = new sqlite3.Database(dbPath);

            if(keys.length > 1) {
                var idString = keys.join(',')
                var q = "SELECT * from key_values WHERE key in (?)"
            } else {
                var idString = keys
                var q = "SELECT * from key_values WHERE key = ?"
            }

            dbkv.all(q, idString, function(error, rows) {
                if(error) {
                    cb(error)
                } else {
                    cb(null, rows)
                }
                dbkv.close()
            })
        },

        remove : function (key, cb) {
            throw 'lol no !'
        },

        removeAll : function (cb) {
            var dbkv = new sqlite3.Database(dbPath);
            dbkv.exec("DELETE from key_values", function(error) {
                if(error) {
                    cb(error)
                } else {
                    cb(null, {status : 'success'})
                }
                dbkv.close()
            })
        },

        status : function (cb) {

            var stats = fs.statSync(dbPath)
            var fileSizeInBytes = stats["size"]
            var fileSizeInKiloBytes = fileSizeInBytes / 1000.0

            var status = {dbSize : fileSizeInKiloBytes + 'kO  '};

            var dbkv = new sqlite3.Database(dbPath);
            dbkv.get("SELECT count(*) as tableLength from key_values ", function(error, row) {

                if (error) {
                    cb(error)
                } else {
                    status.entries = row.tableLength,
                    status.config = config
                    cb(null, status)
                }

                dbkv.close()
            })

        }
    }
}