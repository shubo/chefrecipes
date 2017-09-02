const reqUrl = require('../utils/ReqUrl');
const crError = require('../model/CRError');
const recipe = require('../model/Recipe');
const food = require('../model/Food');
const user = require('../model/User');
const chef = require('../model/Chef');
const country = require('../model/Country');

const SecuredUrlMapping = (function(){

  function forward(request, response){

    reqUrl.getAPIAction(request, function(apiAct){

      switch (apiAct) {

        case '/chef/register':
          chef.register(request, response);
        break;

        case '/chef/login':
          chef.login(request, response);
        break;

        case '/recipes':
          recipe.all(request, response);
        break;

        case '/recipe/add':
          recipe.add(request, response);
        break;

        case '/recipe/img/add':
          recipe.addImg(request, response);
        break;

        case '/recipe/img':
          recipe.getImg(request, response);
        break;

        case '/recipes/by/foods':
          recipe.findByFoods(request, response);
        break;

        case '/food':
          food.find(request, response);
        break;

        case '/user/favs':
          user.favs(request, response);
        break;

        case '/country/list':
          country.list(request, response);
        break;

        case 'NOT AUTHORIZED':
          crError.notAuth(request, response);
        break;

        default:
          crError.notFound(request, response);
      }

    });
  };

  return {

    forward: forward
  }

}());

module.exports = SecuredUrlMapping;
