const model = require('./AbstractModel');
const recipeSql = require('./dbQueries/RecipeSql');
const food = require('./Food');
const util = require('../utils/Util');
const fs = require('fs');

const Recipe = (function(){

  const recipeImgPath = '../../imgBase/';
  const defaultImgFullPath = recipeImgPath + 'defaultRecipe.jpeg';

  function all(request, response){

    model.parseReqBody(request, response, function(reqBody){

      recipeSql.all((reqBody.fromRowNum || 0), function(error, recipes){

        if(error){ return model.sendErr(response, error, 'Recipe List Failed'); }

        model.sendResp(response, model.respMsg.setArrData(recipes));
      });
    });

  };

  function controlRecipeData(recipeData, callback){

    util.checkParamVal(recipeData, function(error){

      if(error){ return model.sendErr(response, error);}

      util.parseStringToArr((recipeData.foods || '').toLowerCase(), function(foodArr){

        recipeData.foods = util.arraySorter(foodArr);

        callback(recipeData);
      });
    });

  };

  function add(request, response){

    model.parseReqBody(request, response, function(reqBody){

        controlRecipeData(reqBody, function(controlledReqBody){

          recipeSql.add(controlledReqBody, function(error, recipeID){

            if(error){ return model.sendErr(response, error , 'Add Recipe Failed');  }

            food.add(controlledReqBody.foods, controlledReqBody.lang, function(error){

              if(error){ return model.sendErr(response, error, 'Add Foods Failed');}

              model.sendResp(response, model.respMsg.setData({id:recipeID}, "Recipe Posted"));
            });

          });
        });

    });
  };

  function foodsCtrl(foods, callback){

    if(foods.length < 2){

      callback(false, 'Foods Count Not Enough');
      return false;
    }

    for(let food of foods){

      if(food.name && food.name.trim()){

        continue;
      }else{

        callback(false, 'Found Empty Food Name');
        return false;
      }
    }

    callback(true);
  };

  function findByFoods(request, response){

    model.parseReqBody(request, response, function(reqBody){

      foodsCtrl((reqBody.foods || []), function(isFoodsDataOK, respTxt){

        if(isFoodsDataOK){

          let searchParams = {
            foods: reqBody.foods,
            findOnlyMatched: reqBody.findOnlyMatched || false,
            fromRowNum: reqBody.fromRowNum || 0
          };

          recipeSql.findByFoods(searchParams, function(error, recipes){

            if(error){return model.sendErr(response, error, 'Find Recipe Failed'); }

            model.sendResp(response, model.respMsg.setArrData(recipes));
          });

        }else{

          return model.sendErr(response, respTxt);
        }

      });
    });
  };

  function saveImg(imgData, imgName, callback){

    var imgFullPath = recipeImgPath + imgName + '.jpeg';

    if(!imgData.length || !imgName){

        callback('Save Image Failed');
        return false;
    }

    var stream = fs.createWriteStream(imgFullPath, {flags: 'a'});

    for(let bit of imgData){

      stream.write(bit, function(error){

        callback(error);
        return false;
      });
    }

    stream.end();

    callback();
  };

  function addImg(request, response){

    var imageData = [];

    request.on('data', function(dataChunk){

      imageData.push(dataChunk);

    }).on('error', function(error){

      return model.sendErr(response, error, 'Upload Image Failed');

    }).on('end', function(){

      var imgName = request.headers['x-recipe'];

      saveImg(imageData, imgName, function(error){

        if(error){ return model.sendErr(response, error); }

        model.sendResp(response, model.respMsg.setData({}, 'Image Uploaded'));
      });

    });

  };

  function getImg(request, response){

    model.getReqSearchParam(request, function(searchParam){

      var imgFullPath = recipeImgPath + searchParam + '.jpeg';
      fs.readFile(imgFullPath, function(error, imgData){

        if(error){

          fs.readFile(defaultImgFullPath, function(error, defaultImgData){

            if(error){ return model.sendErr(response, error, 'Open Image Failed'); }

            model.sendImgResp(response, defaultImgData);
          });

        }else{
          model.sendImgResp(response, imgData);
        }

      });
    });
  };

  return {

    all: all,
    add: add,
    findByFoods: findByFoods,
    addImg: addImg,
    getImg: getImg
  }

}());

module.exports = Recipe;
