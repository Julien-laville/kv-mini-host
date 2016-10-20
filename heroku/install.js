var path = require("path")
var sqlite3 = require("sqlite3")
var dbPath = path.join(__dirname, '..', 'dbs', "kvs.db")
var dbkv = new sqlite3.Database(dbPath);

dbkv.run("CREATE TABLE IF NOT EXISTS `key_values` ( `key` TEXT NOT NULL UNIQUE, `value` TEXT, PRIMARY KEY(`key`) )", function(error) {
    if(error) {
        console.error(error.toString())
    } else {
        console.log("table created successfully")
    }
});