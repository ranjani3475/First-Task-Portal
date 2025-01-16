"use strict";
const { constants, utils } = require("../common");
let { poolExecuteCommand } = require("../common/connection");

async function createTaskServices(params) {
  let { reqBody } = params;
  let { hodId, assigned_person_id, start, end, description, taskName } =
    reqBody;

  let checkStaffSql = `SELECT COUNT(*) AS count FROM ${constants.TABLE_TASK} WHERE assigned_person = ? 
  AND ((start <= ? AND end > ?) OR (start < ? AND end >= ?) OR (start >= ? AND end <= ?));
  `;
  let checkStaffvalue = [
    assigned_person_id,
    start,
    end,
    start,
    end,
    start,
    end,
  ];

  let [checkStaff] = await Promise.all([
    poolExecuteCommand(checkStaffSql, checkStaffvalue),
  ]);

  if (!checkStaff.success) {
    throw new Error("check staff Error:", checkStaff.error);
  }

  if (checkStaff.results[0].count > 0) {
    throw new Error("The Staff already has a task scheduled");
  }

  let taskId = utils.generateUUID();

  let createTaskSql = `insert into ${constants.TABLE_TASK} (task_id,assigned_person,created_by,start,end,description,status,task_name)
   values(?,?,?,?,?,?,?,?)`;

  let createTaskValue = [
    taskId,
    assigned_person_id,
    hodId,
    start,
    end,
    description,
    "Pending",
    taskName,
  ];

  let [createTask] = await Promise.all([
    poolExecuteCommand(createTaskSql, createTaskValue),
  ]);

  if (!createTask.success) {
    throw new Error("create task Error:", createTask.error);
  }

  return "success";
}

async function listAllTask(params) {
  let { reqBody } = params;
  let { userId, date, limit, offset, roll } = reqBody;

  let person = roll === "hod" ? "created_by" : "assigned_person";
  let person2 = "assigned_person";

  // Ensure the date is correctly formatted to YYYY-MM-DD (using native JS)
  let dateOnly = new Date(date).toISOString().split("T")[0]; // e.g., "2025-01-12"

  let taskSql = `
  SELECT t.task_id, t.task_name, u.username, t.start, t.end, t.description, t.status 
  FROM ${constants.TABLE_TASK} AS t
  LEFT JOIN ${constants.TABLE_USER} AS u 
    ON t.${person2} = u.user_id
  WHERE t.${person} = ? 
    AND (
      DATE(t.start) = ? 
      OR DATE(t.end) = ?
    )
  LIMIT ${limit} OFFSET ${offset}
  `;

  let taskCountSql = `
  SELECT count(*) as count 
  FROM ${constants.TABLE_TASK} AS t
  LEFT JOIN ${constants.TABLE_USER} AS u 
    ON t.${person} = u.user_id
  WHERE t.${person} = ? 
    AND (
      DATE(t.start) = ? 
      OR DATE(t.end) = ?
    )
  `;

  let taskValue = [
    userId,
    dateOnly,
    dateOnly, // Comparing just the date part
  ];

  let [task, count] = await Promise.all([
    poolExecuteCommand(taskSql, taskValue),
    poolExecuteCommand(taskCountSql, taskValue),
  ]);

  if (!task.success) {
    throw new Error("get Task List Error:", task.error);
  }

  if (!count.success) {
    throw new Error("get task count error:", count.error);
  }

  let result = {
    result: task.results,
    limit: limit,
    offset: offset,
    totalCount: count.results[0].count,
  };
  console.log(result);

  return result;
}

async function changeTaskStatus(params) {
  let { reqBody } = params;
  let { taskId, status } = reqBody;

  let updateStatusSql = `update ${constants.TABLE_TASK} set status=? where task_id=?`;

  let [updateTask] = await Promise.all([
    poolExecuteCommand(updateStatusSql, [status, taskId]),
  ]);

  if (!updateTask.success) {
    throw new Error("update task error:", updateTask.error);
  }

  return "success";
}

module.exports = {
  createTaskServices: createTaskServices,
  listAllTask: listAllTask,
  changeTaskStatus: changeTaskStatus,
};
