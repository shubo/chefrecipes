
var ResponseMsg = (function(){

	var msg = {"data": [], "text":"", "status":""};

	var settingJSONData = function(jsonData, text){

		return {"data": [jsonData], "text": text, "status":"OK"};
	};

	var settingArrayData = function(arrayData, text){

		return {"data": arrayData, "text": text, "status":"OK"};
	};

	var settingError = function(errorText){

		return {"data": [], "text": errorText, "status":"ERROR"};
	};

	return{

		setData: settingJSONData,
		setArrData: settingArrayData,
		setError: settingError
	}

}());

module.exports = ResponseMsg;
