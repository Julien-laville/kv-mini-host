![Build status](https://travis-ci.org/Julien-laville/kv-mini-host.svg?branch=master)
[![GitHub release](https://img.shields.io/github/release/julien-laville/kv-mini-host.svg)]()
# KEY VALUE Mini server 

## Description

kv-mini host is a super simple node application for storing & retreiving small dataset.


## Usage

GET /?id=key or /?id=\[hey1,key2\]

GET /clean

GET /status

POST / {key : key, value : value}




## Configuration
```javascript

{
    "envName" : {
        "cors" : "protocol:corsName:port",
        "persistMethod" : "file | volatile | [db]",
        "isJSONP" : true | [false]
    }
}
```

## Changelog
    0.0.4   generic config require
            add tests
    

    0.0.3   add alternative persist method
            add multi key get
            add jsonp handling
            delete -> clean

    0.0.2   add CORS config / add config data to status
