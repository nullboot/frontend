import { defineAPI, defineDynamicAPI } from "@/api/wrapper";

export const getTaskById = defineDynamicAPI<
  Paths.TaskControllerGetTask.PathParameters,
  void,
  Paths.TaskControllerGetTask.Responses.$200
>("task/{id}", "get");

export const updateTaskById = defineDynamicAPI<
  Paths.TaskControllerUpdateTask.PathParameters,
  Paths.TaskControllerUpdateTask.RequestBody,
  Paths.TaskControllerUpdateTask.Responses.$201
>("task/{id}", "post");

export const deleteTaskById = defineDynamicAPI<
  Paths.TaskControllerDeleteTask.PathParameters,
  void,
  Paths.TaskControllerDeleteTask.Responses.$200
>("task/{id}", "delete");

export const createTask = defineAPI<
  Paths.TaskControllerCreateTask.RequestBody,
  Paths.TaskControllerCreateTask.Responses.$201
>("task/new", "post");

export const getAllTasks = defineAPI<
  Paths.TaskControllerGetTasks.QueryParameters,
  Paths.TaskControllerGetTasks.Responses.$200
>("task", "get");
