const sqlite = require('../../../node_modules/sqlite3').verbose();

let abstractSqlModel = (function(){

  let instance;

  function init(){
    console.log('DB connection established');
    return new sqlite.Database('../../chefrecipes.db').configure("busyTimeout", 2000);
  };

  function getInstance(){

    if(!instance){

      instance = init();
    }

    return instance;
  };

  return {

    getInstance: getInstance
  }

}());

module.exports = abstractSqlModel.getInstance();
