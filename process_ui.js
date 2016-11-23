var path = require('path')
var fileDb = require(path.join(__dirname, 'dbs', 'file'))()


process.stdin.resume();

module.exports = function() {
    function exitHandler(options, err) {


        fileDb.close(function(error) {
            if(error) {
                console.error("Hu ow: file db cannot be saved : ALL IS LOST !")
            } else {
                console.log("Db file successfully saved. Exit now")
            }

            if (options.cleanup) console.log('clean');
            if (err) console.log(err.stack);
            if (options.exit) process.exit();
        })

    }

//do something when app is closing
    process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
    process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
}