const dbConn = require('./AbstractSqlModel');

const CountrySql = (function(){

  function getCountries(callback){

    let pStatement = dbConn.prepare('SELECT NAME, SHORT_NAME as shortName FROM COUNTRIES ORDER BY NAME');
    pStatement.all([], callback);
    pStatement.finalize();
  };

  return {

    getCountries: getCountries
  }
}());

module.exports = CountrySql;
