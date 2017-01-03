var http = require('http')
var path = require('path')
var url = require('url');
var querystring = require('querystring');
var config = require(path.join(__dirname, 'config.js'));
var db = require(path.join(__dirname, 'dbs', 'abstractDb'))(config)
var zlib = require("zlib")

/* prevent close */
require(path.join(__dirname, 'process_ui'))()

var nanoServ = http.createServer(function (req, res) {
    var reqUrl = url.parse(req.url, true)
    res.setHeader('Access-Control-Allow-Origin', config.cors);

    if(req.method === 'POST') {
        store(res, req)
    } else if(reqUrl.query.id) {
        load(res,reqUrl.query.id)
    } else if(reqUrl.path === '/clean') {
        removeAll(res)
    } else if(reqUrl.path === '/status') {
        status(res)
    } else if(reqUrl.path === '/') {
        loadAll(res)
    } else {
        res.writeHead(404);
        res.end(formatResponse({error : "Function not found"}))
    }

})

function getStats(req,res) {
    
}

function loadAll(res) {
    var allValues = [];
    db.loadAll(function(error, datas) {
        if(error) {
            res.writeHead('500');
            res.end(formatResponse({error : error.toString()}))
        } else {
            res.end(formatResponse(datas))
        }
    })
}

function removeAll(res) {
   db.removeAll(function(error) {
       if(error) {
            res.writeHead('500');
            res.end(formatResponse({error : error.toString()}))
        } else {
            res.end(formatResponse({status : 'success'}))
        }
   })
}

function load(res, id) {
    var ids = id.split(',')
    db.load(ids, function(error, rows) {
        if(error) {
            res.writeHead('500');
            res.end(formatResponse({error : error.toString()}))
        } else {
            res.end(formatResponse(rows))
        }
    })
}

function status(res) {

    db.status(function(error, status) {
        if(error) {
            res.writeHead('500');
            res.end(formatResponse({error : error.toString()}))
        } else {
            res.end(formatResponse(status))
        }
    })
}

function store(res, req) {
    var fullBody = '';

    req.on('data', function(chunk) {
        // append the current chunk of data to the fullBody variable
        fullBody += chunk;
    });
    req.on('end', function() {

        var decodedBody = querystring.parse(fullBody);

        db.store(decodedBody.key, decodedBody.value, function(error) {
            if(error) {
                res.writeHead('500');
                res.end(formatResponse({error : error.toString()}))
            } else {
                res.end(formatResponse({status : 'success'}))
            }
        })
    })
}


function formatResponse(response) {
    if(config.isJSONP) {
        return config.JSONPCallback + '(' + JSON.stringify(response) + ');'
    } else {
        return JSON.stringify(response)
    }
}

var port = process.env.PORT || 8080
console.info("Listen on port : ", port)
nanoServ.listen(port)