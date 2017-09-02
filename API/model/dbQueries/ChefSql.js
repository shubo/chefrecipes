const dbConn = require('./AbstractSqlModel');
const util = require('../../utils/Util');

const ChefSql = (function(){

  function register(regData, callback){

    const registerQuery = 'INSERT INTO CHEF(ID, USER_NAME, PASS, DEGREE) VALUES(?,?,?,?)'
    let pStatement = dbConn.prepare(registerQuery);

    pStatement.run([util.IDGenerator(), regData.userName, regData.pass, regData.degree], function(error){

      callback(error, {userName: regData.userName, pass: regData.pass, degree: regData.degree});
    });
    pStatement.finalize();
  };

  return {

    register: register
  }

}());

module.exports = ChefSql;
