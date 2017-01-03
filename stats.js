module.exports = function(){
	var totalLoad = 0;
	var loads = [];
	var requestAnswered = 0;
	return {
		getStats : function () {
			return [totalLoad, loads, requestAnswered]
		}
	}
}