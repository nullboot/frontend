import { defineAPI, defineDynamicAPI } from "@/api/wrapper";

export const getCityTagList = defineAPI<void, Paths.TagControllerGetCities.Responses.$200>("tag/city", "get");
export const getDivisionTagList = defineAPI<void, Paths.TagControllerGetDivisions.Responses.$200>(
  "tag/division",
  "get",
);

export const getUserCityTag = defineDynamicAPI<
  Paths.TagControllerGetCity.PathParameters,
  void,
  Paths.TagControllerGetCity.Responses.$200
>("tag/city/{id}", "get");

export const getUserDivisionTag = defineDynamicAPI<
  Paths.TagControllerGetDivision.PathParameters,
  void,
  Paths.TagControllerGetDivision.Responses.$200
>("tag/division/{id}", "get");

export const addDivision = defineAPI<
  Paths.TagControllerCreateDivision.RequestBody,
  Paths.TagControllerCreateDivision.Responses.$201
>("tag/division/new", "post");

export const deleteDivision = defineDynamicAPI<
  Paths.TagControllerDeleteDivision.PathParameters,
  void,
  Paths.TagControllerDeleteDivision.Responses.$200
>("tag/division/{id}", "delete");

export const addCity = defineAPI<
  Paths.TagControllerCreateCity.RequestBody,
  Paths.TagControllerCreateCity.Responses.$201
>("tag/city/new", "post");

export const deleteCity = defineDynamicAPI<
  Paths.TagControllerDeleteCity.PathParameters,
  void,
  Paths.TagControllerDeleteCity.Responses.$200
>("tag/city/{id}", "delete");
