const model = require('./AbstractModel');
const countrySql = require('./dbQueries/CountrySql');

const Country = (function(){

  function list(request, response){

    countrySql.getCountries(function(error, countries){

      if(error){ return model.sendErr(response, error);}

      model.sendResp(response, model.respMsg.setArrData(countries));
    });
  };

  return {
    list: list
  }
}());

module.exports = Country;
