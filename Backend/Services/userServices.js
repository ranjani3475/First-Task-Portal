"use strict";

const { constants } = require("../common");
let { poolExecuteCommand } = require("../common/connection");

async function demo(params) {
  let { reqBody } = params;
  let { userName, password } = reqBody;

  let validateUserSql = `select count(*) as count from ${constants.TABLE_USER} where username=? and password=?`;

  let [validateUser] = await Promise.all([
    poolExecuteCommand(validateUserSql, [userName, password]),
  ]);

  if (!validateUser.success) {
    throw new Error("Get User Error", validateUser.error);
  }

  if (validateUser.results[0].count === 0) {
    throw new Error("User Not Found");
  }
  let getUserInfoSql = `select u.username,u.user_id,d.department_code,d.department_id,r.roll_id,r.roll_name from ${constants.TABLE_USER} as u 
            left join ${constants.TABLE_DEPARTMENT} as d on u.department_id= d.department_id
            left join ${constants.TABLE_ROLL} as r on u.roll_id = r.roll_id where username=?`;

  let [getUserInfo] = await Promise.all([
    poolExecuteCommand(getUserInfoSql, [userName]),
  ]);

  if (!getUserInfo.success) {
    throw new Error("Get User Info Error: ", getUserInfo.error);
  }
  return getUserInfo.results[0];
}

async function getUser(params) {
  let { reqBody } = params;
  let { userId } = reqBody;

  let getUserIdsSql = `select user_id,username from ${constants.TABLE_USER} where hod_id=?`;

  let [getUserIds] = await Promise.all([
    poolExecuteCommand(getUserIdsSql, [userId]),
  ]);

  if (!getUserIds.success) {
    throw new Error("Get User Error", getUserIds.error);
  }

  return getUserIds.results;
}

module.exports = {
  demo: demo,
  getUser: getUser,
};
