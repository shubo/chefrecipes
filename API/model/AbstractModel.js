
var reqUrl = require('../utils/ReqUrl');
var responseMsg = require('../utils/ResponseMsg');

var abstractModel = (function(){

  function sendResp(response, msg, token){

    response.writeHead(200, {
      "Content-Type":"application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, x-recipe, x-token",
      "x-token": token || ''
    });
    response.end(JSON.stringify(msg));
  };

  function sendImgResp(response, imgData){

    response.writeHead(200, {'Content-Type': 'image/jpeg'});
    response.end(imgData);
  };

  function sendErr(response, sysError, manualError){

    console.log('Error:[%s]: %s', new Date().toUTCString(), sysError);
    sendResp(response, responseMsg.setError(manualError || sysError) );
    return false;
  };

  function parseReqBody(request, response, callback){

    reqUrl.getRequestBody(request, function(error, reqBody){

      if(error){return sendErr(response, error); }

      callback(reqBody);
    });
  };

  return {

    sendResp: sendResp,
    sendImgResp: sendImgResp,
    parseReqBody: parseReqBody,
    getReqSearchParam: reqUrl.getRequestSearchParam,
    respMsg: responseMsg,
    sendErr: sendErr
  }

}());

module.exports = abstractModel;
