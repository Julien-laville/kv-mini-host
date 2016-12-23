var isSuccess = true;

/* volatile */
    var dbv = require('../dbs/volatil')()
    dbv.store("key_test", "value", function (status) {
        
    })

    dbv.status(function (status) {

    })
/* file */
    var dbF = require('../dbs/file')()
    dbF.store("key_test", "value", function (status) {

    })

    dbF.status(function (status) {

    })

/* db */
    var db = require('../dbs/db')()
    db.store("key_test", "value", function (status) {

    })

    db.status(function (status) {

    })

if(isSuccess) {
    process.exit()
} else {
    process.exit(34) // error
}

