"use strict";
const Joi = require("joi");
let { returnResponse, utils } = require("../common/index");
const {
  createTaskServices,
  listAllTask,
  changeTaskStatus,
} = require("../Services/taskServices");

async function createTask(req, res) {
  try {
    const projectSchema = Joi.object({
      hodId: Joi.string().required(),
      taskName: Joi.string().required(),
      assigned_person_id: Joi.string().required(),
      start: Joi.string().required(),
      end: Joi.string().required(),
      description: Joi.string().required(),
    });

    const queryParams = req.body;
    const data =
      typeof queryParams === "string" ? JSON.parse(queryParams) : queryParams;
    const { error, value } = await utils.joiValidation(projectSchema, data);
    if (error) {
      return returnResponse(res, 400, error, {});
    }
    let params = { reqBody: value };

    let result = await createTaskServices(params);

    return returnResponse(res, 200, "successfully created task.", { result });
  } catch (error) {
    return returnResponse(res, 400, error.message, {});
  }
}

async function taskList(req, res) {
  try {
    const projectSchema = Joi.object({
      userId: Joi.string().required(),
      date: Joi.string().required(),
      roll: Joi.string().required(),
      limit: Joi.string().default(10).optional(),
      offset: Joi.string().default(0).optional(),
    });

    const queryParams = req.query;
    const data =
      typeof queryParams === "string" ? JSON.parse(queryParams) : queryParams;
    const { error, value } = await utils.joiValidation(projectSchema, data);
    if (error) {
      return returnResponse(res, 400, error, {});
    }
    let params = { reqBody: value };

    let result = await listAllTask(params);

    return returnResponse(res, 200, "successfully created task.", {
      result: result.result,
      limit: result.limit,
      offset: result.offset,
      totalCount: result.totalCount,
    });
  } catch (error) {
    return returnResponse(res, 400, error.message, {});
  }
}

async function taskStatus(req, res) {
  try {
    const projectSchema = Joi.object({
      taskId: Joi.string().required(),
      status: Joi.string().required(),
    });

    const queryParams = req.body;
    const data =
      typeof queryParams === "string" ? JSON.parse(queryParams) : queryParams;
    const { error, value } = await utils.joiValidation(projectSchema, data);
    if (error) {
      return returnResponse(res, 400, error, {});
    }
    let params = { reqBody: value };

    let result = await changeTaskStatus(params);

    return returnResponse(res, 200, "successfully Submitted.", {
      result,
    });
  } catch (error) {
    return returnResponse(res, 400, error.message, {});
  }
}

module.exports = {
  createTask,
  taskList,
  taskStatus,
};
