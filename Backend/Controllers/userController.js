"use strict";
const Joi = require("joi");
let { returnResponse, utils } = require("../common/index");
const { demo, getUser } = require("../Services/userServices");

async function validateUser(req, res) {
  try {
    const projectSchema = Joi.object({
      userName: Joi.string().required(),
      password: Joi.string().required(),
    });

    const queryParams = req.body;
    const data =
      typeof queryParams === "string" ? JSON.parse(queryParams) : queryParams;
    const { error, value } = await utils.joiValidation(projectSchema, data);
    if (error) {
      return returnResponse(res, 400, error, {});
    }
    let params = { reqBody: value };

    let result = await demo(params);

    return returnResponse(res, 200, "success", { result });
  } catch (error) {
    return returnResponse(res, 400, error.message, {});
  }
}

async function getUserByHod(req, res) {
  try {
    const Schema = Joi.object({
      userId: Joi.string().required(),
    });
    const queryParams = req.query;
    const data =
      typeof queryParams === "string" ? JSON.parse(queryParams) : queryParams;
    const { error, value } = await utils.joiValidation(Schema, data);
    if (error) {
      return returnResponse(res, 400, error, {});
    }
    let params = { reqBody: value };

    let result = await getUser(params);

    return returnResponse(res, 200, "success", { result });
  } catch (error) {
    return returnResponse(res, 400, error.message, {});
  }
}

module.exports = {
  validateUser,
  getUserByHod,
};
