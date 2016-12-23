var path = require("path")
module.exports = function() {
    var env = process.env.environment || 'dev'
    return  require(path.join(__dirname,"config.json"))[process.env.environment]
}()