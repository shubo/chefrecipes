const jwt = require('../../node_modules/jsonwebtoken');

const Auth = (function(){

  const key = 'quvvet elmdedir bashqacur hec kes, hec kese ustunluk eyleye bilmez blet';

  function checkAuthorization(request, callback){

    const token = request.headers['x-token'];

    jwt.verify(token, key, {algorithms: ['HS512']}, callback);
  };

  function createToken(data, callback){

    jwt.sign(data, key, {algorithm: 'HS512'},  callback);
  };

  return {

    checkAuthorization: checkAuthorization,
    createToken: createToken
  }

}());

module.exports = Auth;
