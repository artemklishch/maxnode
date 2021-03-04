const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization"); // получаем данные из заголовка запроса
  if(!authHeader){
    const error = new Error("Not authenticated!");
    error.statusCode = 401;
    throw error;
  }
  const token = req.get("Authorization").split(" ")[1];
  let decodedToken; // это будет объект с данными от декодированного токена
  // наример, {
  //   "email": "test-1-@gmail.com",
  //   "userId": "602e98f32cfc096a30a39adc",
  //   "iat": 1613718913,
  //   "exp": 1613722513
  // }
  try {
    //   decodedToken = jwt.decode(token) // jwt.decode(token) декодирует токен
    decodedToken = jwt.verify(token, "supersomesecretsecret");
    // jwt.verify(token, 'supersomesecretsecret') декодирует токен и проверяет его
  } catch (err) {
    err.statusCode = 500;
    throw err; // ошибка летит в тот мидлевеар, к-й ее обрабатывает в файле app.js
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated!");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId; // userId передавался в токен в первом аргументе при залогинивании, при создании токена
  next();
};
