const model = require('./AbstractModel');
const foodSql = require('./dbQueries/FoodSql');
const util = require('../utils/Util');

const Food = (function(){

  function add(foods, lang, callback){

    foodSql.add(foods, lang, callback);
  };

  function find(request, response){

    model.parseReqBody(request, response, function(reqBody){

      util.checkParamVal(reqBody, function(error){

        if(error){return model.sendErr(response, error);}

        foodSql.find(reqBody, function(error, foods){

          if(error){return model.sendErr(response, error, 'Find Food Failed');}

          model.sendResp(response, model.respMsg.setArrData(foods));
        });

      });
    });
  };

  return{

    add: add,
    find: find
  }

}());

module.exports = Food;
