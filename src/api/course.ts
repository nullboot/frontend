import { defineAPI, defineDynamicAPI } from "@/api/wrapper";

export const createCourse = defineAPI<
  Paths.CourseControllerCreateCourse.RequestBody,
  Paths.CourseControllerCreateCourse.Responses.$201
>("course/new", "post");

export const getCourseById = defineDynamicAPI<
  Paths.CourseControllerGetCourse.PathParameters,
  void,
  Paths.CourseControllerGetCourse.Responses.$200
>("course/{id}", "get");

export const updateCourseById = defineDynamicAPI<
  Paths.CourseControllerUpdateCourse.PathParameters,
  Paths.CourseControllerUpdateCourse.RequestBody,
  Paths.CourseControllerUpdateCourse.Responses.$201
>("course/{id}", "post");

export const deleteCourseById = defineDynamicAPI<
  Paths.CourseControllerDeleteCourse.PathParameters,
  void,
  Paths.CourseControllerDeleteCourse.Responses.$200
>("course/{id}", "delete");

export const getAllCourses = defineAPI<
  Paths.CourseControllerGetCourses.QueryParameters,
  Paths.CourseControllerGetCourses.Responses.$200
>("course", "get");

export const createCourseSection = defineAPI<
  Paths.CourseControllerCreateCourseSection.RequestBody,
  Paths.CourseControllerCreateCourseSection.Responses.$201
>("course/section/new", "post");

export const getCourseSectionById = defineDynamicAPI<
  Paths.CourseControllerGetCourseSection.PathParameters,
  void,
  Paths.CourseControllerGetCourseSection.Responses.$200
>("course/section/{id}", "get");

export const updateCourseSectionById = defineDynamicAPI<
  Paths.CourseControllerUpdateCourseSection.PathParameters,
  Paths.CourseControllerUpdateCourseSection.RequestBody,
  Paths.CourseControllerUpdateCourseSection.Responses.$201
>("course/section/{id}", "post");

export const deleteCourseSectionById = defineDynamicAPI<
  Paths.CourseControllerDeleteCourseSection.PathParameters,
  void,
  Paths.CourseControllerDeleteCourseSection.Responses.$200
>("course/section/{id}", "delete");

export const getAllCourseSections = defineAPI<
  Paths.CourseControllerGetCourseSections.QueryParameters,
  Paths.CourseControllerGetCourseSections.Responses.$200
>("course/section", "get");
