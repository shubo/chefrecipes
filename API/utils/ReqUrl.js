const url = require('url');
const auth = require('../controller/Auth');

const ReqUrl = (function(){

  const APP_NAME = 'chefrecipes';

  const SECURED_URLS = ['/chef/login', '/recipe/add', '/recipe/img/add'];

  const POST_URLS = ['/recipes', '/recipes/by/foods', '/food',
  '/user/favs', '/chef/register', '/country/list', ...SECURED_URLS];

  const GET_URLS = ['/recipe/img'];

  function getAPIAction(request, callback){

    const urlJson = url.parse(request.url, true);

    console.log('REQ:[%s]: %s', new Date().toUTCString(), urlJson.path);

    const pathName = urlJson['pathname'];
    const appName = pathName.substring(1, pathName.indexOf('/', 1));

    var toIndex = pathName.length;
    var fromIndex = pathName.indexOf("/", 1);

    if(pathName.charAt(pathName.length - 1) === '/'){

      toIndex = pathName.length - 1;
    }

    const apiAct = pathName.substring(fromIndex, toIndex);

    if(request.method === 'POST' && appName === APP_NAME ){

      if(SECURED_URLS.indexOf(apiAct) !== -1){

        auth.checkAuthorization(request, function(error, token){

          if(error || !token){

            console.log('Error:[%s]: %s', new Date().toUTCString(), error);
            callback('NOT AUTHORIZED');
            return false;
          }

          request.headers.userData = token.data;

          callback(POST_URLS.indexOf(apiAct) !== -1)? apiAct : '';
        });

      }else{

        callback((POST_URLS.indexOf(apiAct) !== -1)? apiAct : '');
      }

    }else if(request.method === 'GET' && appName === APP_NAME ){

      callback((GET_URLS.indexOf(apiAct) !== -1)? apiAct : '');

    }else{

      callback('');
    }
  }

  function getURLParam(request, callback){

    const urlJson = url.parse(request.url, true);
    callback((urlJson.query || {}));
  };

  function getRequestBody(request, callback){

    var requestBody = [];

    request.on('data', function(data){

        requestBody.push(data);

    }).on('error', function(error){

        callback(error);

    }).on('end', function(){

      let reqBodyParam = Buffer.concat(requestBody).toString();
      console.log('REQ BODY:[%s]: %s ', new Date().toUTCString() , reqBodyParam);

      try {

        let result = JSON.parse(reqBodyParam || '{}');

        if(typeof result === 'object'){

          callback(undefined, result);

        }else{

          callback('Request Body Parse Failed');
        }
      }catch (e){

        callback(e);
      }

    });
  };

  function getRequestSearchParam(request, callback){

    const urlJson = url.parse(request.url);

    callback(urlJson['query']);
  };

  return {

    getAPIAction: getAPIAction,
    getURLParam: getURLParam,
    getRequestBody: getRequestBody,
    getRequestSearchParam: getRequestSearchParam
  }

}());

module.exports = ReqUrl;
