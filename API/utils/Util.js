
const Util = (function(){

  function arraySorter(array){

    return array.sort(function(a, b){

      return a.localeCompare(b);
    });
  };

  function IDGenerator(){
    return (new Date().valueOf() + Math.floor(Math.random() * 100000)).toString(16) ;
  };

  function checkParamVal(obj, callback){

    const values = Object.values(obj);
    let emptyValCount = 0;

    for(let val of values){

      emptyValCount += ( !val || !val.trim())? 1 : 0 ;
    }

    const result = (emptyValCount > 0) ? 'Found Empty Value' : undefined;
    callback(result);
  };

  function psSqlGen(query, paramsCount){

    query += '(';
    for(let i = 0; i < paramsCount; i++){
      query += 'LOWER(?),';
    }
    query = query.substring(0, query.lastIndexOf(',')) + ')';
    return query;
  };

  function parseStringToArr(string, callback){

    let arr = string.split(',');
    let arrLength = arr.length;

    for(let i = 0; i < arrLength; i++){

      arr[i] = arr[i].trim();

      if(arr[i] === ''){ arr.splice(i, 1); }
    }

    callback(arr);
  };

  return{
    arraySorter: arraySorter,
    IDGenerator: IDGenerator,
    checkParamVal: checkParamVal,
    psSqlGen: psSqlGen,
    parseStringToArr: parseStringToArr
  }
}());

module.exports = Util;
