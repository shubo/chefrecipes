var model = require('./AbstractModel');
var userSql = require('./dbQueries/UserSql');

var User = (function(){

  function favs(request, response){

    model.parseReqBody(request, response, function(reqBody){

      userSql.favs((reqBody.favs || []), function(error, favRecipes){

        if(error){return model.sendErr(response, error, 'Favorite List Failed');}

        model.sendResp(response, model.respMsg.setArrData(favRecipes));
      });
    });
  };

  return{
    favs: favs
  }
}());

module.exports = User;
