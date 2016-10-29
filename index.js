var http = require('http')
var sqlite3 = require('sqlite3')
var path = require('path')
var url = require('url');
var querystring = require('querystring');
var config = require(path.join(__dirname,"config.json"))[process.env.environment];
var fs = require("fs");
var zlib = require("zlib")

var dbPath = path.join(__dirname, "dbs", "kvs.db")

var nanoServ = http.createServer(function (req, res) {
    var reqUrl = url.parse(req.url, true)
    res.setHeader('Access-Control-Allow-Origin', config.cors);

    if(req.method === 'POST') {
        put(res, req)
    } else if(reqUrl.query.id) {
        get(res,reqUrl.query.id)
    } else if(reqUrl.path === '/delete') {
        cleanAll(res)
    } else if(reqUrl.path === '/status') {
        status(res)
    } else if(reqUrl.path === '/') {
        getAll(res)
    } else {
        res.writeHead(404);
        res.end('<h1><center>404</center></h1>')
    }

})


function getAll(res) {
    var allValues = [];
    var dbkv = new sqlite3.Database(dbPath);
    dbkv.all("SELECT * from key_values", function (error, rows) {
        if(error) {
            res.writeHead('500');
            res.end('<h1><center>500</center></h1>' + error.toString())
        } else {
            allValues = rows.map(function(r){return {key : r.key, value : r.value}})
            res.end(JSON.stringify(allValues))
        }
        dbkv.close()
    })

}

function cleanAll(res) {
    var dbkv = new sqlite3.Database(dbPath);

   dbkv.exec("DELETE from key_values", function(error) {
       if(error) {
            res.writeHead('500');
            res.end('<h1><center>500</center></h1>' + error.toString())
        } else {
            res.end(JSON.stringify({status : 'success'}))
        }
        dbkv.close()
   }) 
}

function get(res, id) {
    var dbkv = new sqlite3.Database(dbPath);
    dbkv.get("SELECT * from key_values WHERE key = ?",{1 : id}, function(error, row) {
        if(error) {
            res.writeHead('500');
            res.end('<h1><center>500</center></h1>' + error.toString())
        } else {
            res.end(JSON.stringify({value : row.value}))
        }
        dbkv.close()
    })
    
    

}

function status(res) {


    var stats = fs.statSync(dbPath)
    var fileSizeInBytes = stats["size"]
    var fileSizeInKiloBytes = fileSizeInBytes / 1000.0

    var status = {dbSize : fileSizeInKiloBytes + 'kO  '};

    var dbkv = new sqlite3.Database(dbPath);

    dbkv.get("SELECT count(*) as tableLength from key_values ", function(error, row) {
        if(error) {
            res.writeHead('500');
            res.end('<h1><center>500</center></h1>' + error.toString())
        } else {

            status.entries = row.tableLength;
            status.config = config
            res.end(JSON.stringify(status))

        }
        dbkv.close()
    })


}

function put(res, req) {
    var dbkv = new sqlite3.Database(dbPath);
    var fullBody = '';

    req.on('data', function(chunk) {
        // append the current chunk of data to the fullBody variable
        fullBody += chunk.toString();
    });
    req.on('end', function() {

        var decodedBody = querystring.parse(fullBody);

        dbkv.run("INSERT into key_values (key, value) VALUES(?,?)", {1:decodedBody.key, 2:decodedBody.value}, function(error) {
            if(error) {
                res.writeHead('500');
                res.end('<h1><center>500</center></h1>' + error.toString())
            } else {
                res.end(JSON.stringify({status : 'success'}))
            }
            dbkv.close()
        })
    })

    
}

var port = process.env.PORT || 8080
console.info("Listen on port : ", port)
nanoServ.listen(port)