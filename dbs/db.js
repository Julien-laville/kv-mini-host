var config = require(path.join(__dirname,"config.json"))[process.env.environment];

module.exports = function(dbpath){
    return {
        store : function(key, cb) {

        },

        getAll : function (cb) {

        },

        get : function (keys, value, cb) {
            var dbkv = new sqlite3.Database(dbPath);

            if(keys.length > 1) {
                var idString = keys.join(',')
                var q = "SELECT * from key_values WHERE key in (?)"
            } else {
                var idString = keys.join(',')
                var q = "SELECT * from key_values WHERE key = ?"
            }

            dbkv.get(q,{1 : idString}, function(error, row) {
                if(error) {
                    cb(error)
                } else {
                    cb(null, {value : row.value})
                }
                dbkv.close()
            })
        },

        remove : function (key, cb) {

        },
        status : function (cb) {
            var dbkv = new sqlite3.Database(dbPath);
            dbkv.get("SELECT count(*) as tableLength from key_values ", function(error, row) {
                if (error) {
                    cb(error)
                } else {

                    cb(null, {
                        entries: row.tableLength,
                        config: config
                    })

                }

                dbkv.close()
            })

        }
    }
}