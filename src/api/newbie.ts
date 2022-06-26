import { defineAPI, defineDynamicAPI } from "@/api/wrapper";

export const newbieGetProfile = defineDynamicAPI<
  Paths.NewbieControllerGetNewbieProfile.PathParameters,
  void,
  Paths.NewbieControllerGetNewbieProfile.Responses.$200
>("newbie/{id}/profile", "get");

export const newbieGetExam = defineDynamicAPI<
  Paths.NewbieTrainingControllerGetNewbieExam.PathParameters,
  void,
  Paths.NewbieTrainingControllerGetNewbieExam.Responses.$200
>("newbie/{id}/training/exam/{examId}", "get");

export const newbieSubmitExam = defineDynamicAPI<
  Paths.NewbieTrainingControllerSubmitNewbieExam.PathParameters,
  Paths.NewbieTrainingControllerSubmitNewbieExam.RequestBody,
  Paths.NewbieTrainingControllerSubmitNewbieExam.Responses.$201
>("newbie/{id}/training/exam/{examId}", "post");

export const newbieGetTask = defineDynamicAPI<
  Paths.NewbieTrainingControllerGetNewbieTask.PathParameters,
  void,
  Paths.NewbieTrainingControllerGetNewbieTask.Responses.$200
>("newbie/{id}/training/task/{taskId}", "get");

export const newbieSubmitTask = defineDynamicAPI<
  Paths.NewbieTrainingControllerSubmitNewbieTask.PathParameters,
  void,
  Paths.NewbieTrainingControllerSubmitNewbieTask.Responses.$201
>("newbie/{id}/training/task/{taskId}", "post");

export const newbieGetCourse = defineDynamicAPI<
  Paths.NewbieTrainingControllerGetNewbieCourse.PathParameters,
  void,
  Paths.NewbieTrainingControllerGetNewbieCourse.Responses.$200
>("newbie/{id}/training/course/{courseId}", "get");

export const newbieGetDataShow = defineAPI<
  Paths.NewbieControllerGetNewbieDataShow.QueryParameters,
  Paths.NewbieControllerGetNewbieDataShow.Responses.$200
>("newbie/data-show", "get");

export const newbieSubmitCourseSection = defineDynamicAPI<
  Paths.NewbieTrainingControllerSubmitNewbieCourseSection.PathParameters,
  void,
  Paths.NewbieTrainingControllerSubmitNewbieCourseSection.Responses.$201
>("newbie/{id}/training/course/{courseId}/section/{sectionId}", "post");

export const newbieGetTemplate = defineDynamicAPI<
  Paths.NewbieControllerGetNewbieTemplate.PathParameters,
  void,
  Paths.NewbieControllerGetNewbieTemplate.Responses.$200
>("newbie/{id}/template", "get");

export const newbieUpdateTemplate = defineDynamicAPI<
  Paths.NewbieControllerUpdateNewbieTemplate.PathParameters,
  Paths.NewbieControllerUpdateNewbieTemplate.RequestBody,
  Paths.NewbieControllerUpdateNewbieTemplate.Responses.$201
>("newbie/{id}/template", "post");

export const newbieUpdateComment = defineDynamicAPI<
  Paths.NewbieCommentControllerUpdateNewbieComment.PathParameters,
  Paths.NewbieCommentControllerUpdateNewbieComment.RequestBody,
  Paths.NewbieCommentControllerUpdateNewbieComment.Responses.$201
>("newbie/{id}/comment", "post");

export const newbieGetComment = defineDynamicAPI<
  Paths.NewbieCommentControllerGetNewbieComment.PathParameters,
  Paths.NewbieCommentControllerGetNewbieComment.QueryParameters,
  Paths.NewbieCommentControllerGetNewbieComment.Responses.$200
>("newbie/{id}/comment", "get");

export const getNewbieList = defineAPI<
  Paths.NewbieControllerGetNewbies.QueryParameters,
  Paths.NewbieControllerGetNewbies.Responses.$200
>("newbie", "get");

export const assignTutor = defineDynamicAPI<
  Paths.NewbieControllerAssignNewbieTutor.PathParameters,
  Paths.NewbieControllerAssignNewbieTutor.RequestBody,
  Paths.NewbieControllerAssignNewbieTutor.Responses.$201
>("newbie/{id}/tutor", "post");
