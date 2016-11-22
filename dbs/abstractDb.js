var path = require('path')
var config = require(path.join(__dirname, '..', 'config.json'))[process.env.environment];

module.exports = function() {
    var localDB;
    switch(config.persistMethod) {
    case 'file' :
        localDB = require(path.join(__dirname, 'file'))()
        break
    case 'db' :
        localDB = require(path.join(__dirname, 'db'))()
        break
    default :
        localDB = require(path.join(__dirname, 'volatil'))()
    }
    return {
        load : function(key, cb) {
            localDB.load(key, cb)
        },
        store : function(key, value, cb) {
            localDB.store(key, value, cb)
        },
        status : function (cb) {
            localDB.status(cb)
        },
        loadAll : function (cb) {
            localDB.loadAll(cb)
        },
        remove : function (key, cb) {
            localDB.loadAll(key, cb)
        },
        removeAll : function (cb) {
            localDB.removeAll(cb)
        }
    }

}