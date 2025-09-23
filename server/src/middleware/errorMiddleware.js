const notFound = (require, response, next) => {
  const error = new Error(`Not Found -${require.originalUrl}`);
  console.log(response.status(404));
  response.status(404);
  next(error);
};

const errorHandler = (err, require, response) => {
  const statusCode = response.statusCode === 200 ? 500 : response.statusCode;
  response.status(statusCode);
  response.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
module.exports = { notFound, errorHandler };
