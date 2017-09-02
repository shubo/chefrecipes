const dbConn = require('./AbstractSqlModel');
const util = require('../../utils/Util');


const FoodSql = (function(){

  function checkExistedFoods(foods, lang, callback){

    let foodCheckSql = util.psSqlGen('SELECT NAME FROM FOOD WHERE LANG = ? AND NAME IN ', foods.length);
    let pStatement = dbConn.prepare(foodCheckSql);

    let params = [lang, ...foods];

    pStatement.all(params, callback);
    pStatement.finalize();
  };

  function add(foods, lang, callback){

    checkExistedFoods(foods, lang, function(error, existedFoods){

      if(error){ callback(error); return false; }

      for(let existedFood of existedFoods){
        foods.splice( foods.indexOf(existedFood.name), 1 );
      }

      let pStatement = dbConn.prepare('INSERT INTO FOOD(ID, NAME, LANG) VALUES(?,?,?)');

      for(let food of foods){

        pStatement.run([util.IDGenerator(), food, lang], function(error){

          if(error){callback(error); return false;}
        });
      }

      pStatement.finalize(callback);
    })
  };

  function find(foodProp, callback){

    let pStatement = dbConn.prepare('SELECT ID, NAME FROM FOOD WHERE LANG = ? AND (NAME LIKE ? OR NAME LIKE ? )');
    pStatement.all([ foodProp.lang, '% '+foodProp.name+'%', foodProp.name+'%'], callback);
    pStatement.finalize();
  };

  return{

    add: add,
    find: find
  }

}());

module.exports = FoodSql;
