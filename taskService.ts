// import { Task } from "./task.js";
const { conection } = require("./db.js");

export const getAll = async (): Promise<Task[]> => {
  return await conection.getRepository(Task).find();
};

export const create = async (task: Task): Promise<Task> => {
  return await conection.getRepository(Task).save(task);
};

export const updateOne = async (id: string): Promise<any> => {
  return await conection
    .getRepository(Task)
    .update({ id }, { completed: true });
};