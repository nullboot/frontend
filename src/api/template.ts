import { defineDynamicAPI } from "@/api/wrapper";

export const getTemplateById = defineDynamicAPI<
  Paths.TemplateControllerGetTemplate.PathParameters,
  void,
  Paths.TemplateControllerGetTemplate.Responses.$200
>("template/{type}/{id}", "get");

export const getTemplateAll = defineDynamicAPI<
  Paths.TemplateControllerGetTemplates.PathParameters,
  Paths.TemplateControllerGetTemplates.QueryParameters,
  Paths.TemplateControllerGetTemplates.Responses.$200
>("template/{type}", "get");

export const updateTemplate = defineDynamicAPI<
  Paths.TemplateControllerUpdateTemplate.PathParameters,
  Paths.TemplateControllerUpdateTemplate.RequestBody,
  Paths.TemplateControllerUpdateTemplate.Responses.$201
>("template/{type}/{id}", "post");
