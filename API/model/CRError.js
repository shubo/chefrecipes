const model = require('./AbstractModel');

const CRError = (function(){

  function notAuth(request, response){
    model.sendResp(response, model.respMsg.setError('NOT AUTHORIZED'));
  };

  function notFound(request, response){
    model.sendResp(response, model.respMsg.setError('URL NOT FOUND'));
  };

  return {

    notAuth: notAuth,
    notFound: notFound
  }
}());

module.exports = CRError;
