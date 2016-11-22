var path = require('path')
var config = require(path.join(__dirname, '..', 'config.json'))[process.env.environment];

var kvs = {}
var size = 0

module.exports = function(){
    return {
        load : function(keys, cb) {
            var rows = []
            keys.forEach(function(key) {
                rows.push({key : key, value : kvs[key]})
            })
            cb(null, rows)
        },

        store : function (key, value, cb) {
            kvs.key = value
            size ++
            cb(null, {success : true})
        },

        loadAll : function(cb) {
            cb(null, Object.keys(kvs))
        },

        removeAll : function (cb) {
            kvs = {}
            size = 0
            cb(null, {success : true})
        },

        remove : function(key, cb) {
            if(kvs.key) {
                delete(kvs.key)
                size --
                cb(null, {'delete' : 1})
            } else {
                cb(null, {'delete' : 0})
            }
        },

        status : function (cb) {
            cb(null, {entries : size, config : config})
        }
    }
}