const responseWithServerParams = (ctx, statusCode, response) => {
  ctx.meta.$statusCode = statusCode;
  return response;
};

const notfound = (ctx) => {
  return responseWithServerParams(ctx, 404, {
    status: 404,
    message: "The resource you're looking for was not found",
  });
};

const conflict = (ctx) => {
  return responseWithServerParams(ctx, 409, {
    status: 409,
    message: "User already exists",
  });
};

const error = (ctx) => {
  return responseWithServerParams(ctx, 500, {
    status: 500,
    message: "A server error just occured",
  });
};

const unauthorizedOperation = (ctx) => {
  return responseWithServerParams(ctx, 401, {
    status: 401,
    message: "You are not authorized to perform this operation",
  });
};

const ok = (ctx) => {
  return responseWithServerParams(ctx, 200, {
    status: 200,
    message: "Operation successful",
  });
};

const badRequest = (ctx) => {
  return responseWithServerParams(ctx, 400, {
    status: 400,
    message: "You made a bad request",
  });
};

const failedTransaction = (ctx)=>{
  return responseWithServerParams(ctx, 422, {
    status: 422,
    message: "Transaction failed",
  });
}

module.exports = {
  notfound,
  error,
  unauthorizedOperation,
  ok,
  conflict,
  badRequest,
  failedTransaction
};
