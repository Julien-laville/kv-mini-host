var fs = require('fs')
var path = require('path')
var dbFilePath = path.join(__dirname, 'db.json')
var config = require(path.join(__dirname, '..', 'config.js'))

function initDb() {
    return {
        version : require(path.join(__dirname, '..', 'package')).version,
        size : 0,
        storage : {}
    }
}

try {
    var db = require(dbFilePath);
} catch (e) {
    var db = initDb()
}

module.exports = function() {
    return {
        load : function (key, cb) {
            cb(null, db.storage[key])
        },

        loadAll : function (cb) {
            cb(null, Object.keys(db.storage))
        },

        status : function (cb) {
            try {
                var stats = fs.statSync(dbFilePath)
            } catch (e) {
                console.log("File not yet created");
                cb(null, {entries : db.size, config : config});return
            }
            var fileSizeInBytes = stats["size"]
            var fileSizeInKiloBytes = fileSizeInBytes / 1000.0

            var status = {dbSize : fileSizeInKiloBytes + 'kO  '}
            status.entries = db.size
            status.config = config

            cb(null, status)
        },

        store : function (key, value, cb) {
            db.storage[key] = value
            cb(null)
        },

        remove : function (key, cb) {
            delete(db.storage[key])
            cb(null)
        },

        removeAll : function (cb) {
            db = initDb()
            cb(null)
        },
        
        close : function (cb) {

            var dbDesc = fs.openSync(dbFilePath, 'w+')

            fs.write(dbDesc, JSON.stringify(db), function(error) {
                if(error) {
                    cb(error)
                } else {
                    cb(null, {success : true})
                }
            })
        }
    }
}