# KEY VALUE Mini server 

## Description

kv-mini host is a super simple node application for storing & retreiving small dataset.


## Usage

GET /?id=key

GET /delete

GET /status

POST {key : key, value : value}

GET /


## Configuration


{
    "envName" : {
        "cors" : "protocol:corsName:port"
    }
}

## Changelog
    

    0.0.2 add CORS config / add config data to status