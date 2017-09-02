const dbConn = require('./AbstractSqlModel');
const util = require('../../utils/Util');

const UserSql = (function(){

  function favs(favs, callback){

    var favsSql = util.psSqlGen('SELECT ID, NAME, COMPOSITION, HOW_TO, FOODS FROM RECIPE WHERE ID IN', (favs.length || 1));
    var pStatement = dbConn.prepare(favsSql);
    pStatement.all(favs, callback);
    pStatement.finalize();
  };

  return{
    favs: favs
  }
}());

module.exports = UserSql;
