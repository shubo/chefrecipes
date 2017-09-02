const dbConn = require('./AbstractSqlModel');
const util = require('../../utils/Util');

const recipeSql = (function(){

  function all(fromRowNum, callback){

    let pStatement = dbConn.prepare('SELECT ID, NAME, COMPOSITION, HOW_TO, FOODS FROM RECIPE '+
    ' ORDER BY NAME LIMIT 15 OFFSET ?');

    pStatement.all([fromRowNum], callback);
    pStatement.finalize();
  };

  function add(recipe, callback){

    let pStatement = dbConn.prepare('INSERT INTO RECIPE(ID, NAME, COMPOSITION, HOW_TO, FOODS) VALUES(?,?,?,?,?)');

    let recipeID = util.IDGenerator();

    pStatement.run([recipeID, recipe.name, recipe.composition, recipe.howTo, recipe.foods.toString()], function(error){

      callback(error, recipeID);
    });
    pStatement.finalize();
  };

  function filterRecipesByFoods(recipes, searchParams, callback){

    let workingCopyRecipes = recipes.slice();

    for(let recipe of workingCopyRecipes){

      let recipeFoodArr = recipe.foods.split(',');

      let foodArr = [];
      for(let food of searchParams.foods){
        foodArr.push(food.name.trim());
      }

      if(!searchParams.findOnlyMatched){

        for(let food of foodArr){

          if(recipeFoodArr.indexOf(food) === -1){

            recipes.splice(recipes.indexOf(recipe), 1);
            break;
          }
        }

      }else if(recipeFoodArr.length === foodArr.length){

        for(let food of foodArr){

          if(recipeFoodArr.indexOf(food) === -1){
            recipes.splice(recipes.indexOf(recipe), 1);
            break;
          }
        }

      }else{

        recipes.splice(recipes.indexOf(recipe), 1);
      }
    }

    callback(undefined, recipes);
  };

  function findByFoods(searchParams, callback){

    let pStatement = dbConn.prepare('SELECT ID, NAME, COMPOSITION, HOW_TO, FOODS FROM RECIPE '+
    ' WHERE FOODS LIKE ? ORDER BY NAME LIMIT 15 OFFSET ?');

    pStatement.all(['%'+searchParams.foods[0].name+'%', searchParams.fromRowNum], function(error, recipes){

      if(error) {callback(error); return false;}

      filterRecipesByFoods(recipes, searchParams, callback);
    });

    pStatement.finalize();
  };

  return{

    all: all,
    add: add,
    findByFoods: findByFoods
  }

}());

module.exports = recipeSql;
