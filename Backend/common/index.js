"use strict";
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");

const joiValidation = function (schema, data) {
  try {
    const options = {
      errors: {
        wrap: {
          label: false,
        },
      },
    };
    const { error, value } = schema.validate(data, options);
    return {
      error: error?.[0]?.message ?? error?.message ?? null,
      value: value,
    };
  } catch (error) {
    return { error: error.message, value: null };
  }
};

function returnResponse(res, statusCode, message = "", body = {}) {
  var returnResponse = {
    message: message,
    statusCode: statusCode,
    data: body,
    timeStamp: new Date().getTime(),
  };
  res.status(statusCode).json(returnResponse);
}

const utils = {
  joiValidation: joiValidation,
  generateUUID: () => {
    return uuidv4();
  },
};

let constants = {
  TABLE_USER: "users",
  TABLE_DEPARTMENT: "department",
  TABLE_ROLL: "roll",
  TABLE_TASK: "task",
};

module.exports = {
  utils: utils,
  returnResponse: returnResponse,
  joiValidation: joiValidation,
  constants: constants,
};
