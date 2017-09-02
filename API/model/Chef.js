const model = require('./AbstractModel');
const chefSql = require('./dbQueries/ChefSql');
const util = require('../utils/Util');
const auth = require('../controller/Auth');

var Chef = (function(){

  function register(request, response){

    model.parseReqBody(request, response, function(reqBody){

      util.checkParamVal(reqBody, function(error){

        if(error){ return model.sendErr(response, error);}

        const userData = {userName: reqBody.userName, degree: reqBody.degree};
        const tokenExp = Math.floor(Date.now() / 1000) + (10); //10sec

        auth.createToken({exp: tokenExp, data: userData}, function(error, token){

          if(error){ return model.sendErr(response, error);}

          chefSql.register(reqBody, function(error, chefData){

            if(error){ return model.sendErr(response, error);}

            model.sendResp(response, model.respMsg.setData(chefData), token);
          });
        });

      });

    });
  };

  function login(request, response){

    model.parseReqBody(request, response, function(reqBody){

      util.checkParamVal(reqBody, function(error){

        if(error){ return model.sendErr(response, error); }

        chefSql.login(reqBody, function(){

        });
      });
    });
  };

  return{
    register: register,
    login: login
  }

}());

module.exports = Chef;
