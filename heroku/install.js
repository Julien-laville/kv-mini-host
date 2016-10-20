var sqlite3 = require("sqlite3")
var dbPath = path.join(__dirname, '..', "kvs.db")
var dbkv = new sqlite3.Database(dbPath);

sqlite3.run("CREATE TABLE IF NOT EXIST key_value")