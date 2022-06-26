import { defineAPI, defineDynamicAPI } from "@/api/wrapper";

export const tutorGetProfile = defineDynamicAPI<
  Paths.TutorControllerGetTutorProfile.PathParameters,
  void,
  Paths.TutorControllerGetTutorProfile.Responses.$200
>("tutor/{id}/profile", "get");

export const tutorGetNewbieList = defineAPI<
  Paths.NewbieControllerGetNewbies.QueryParameters,
  Paths.NewbieControllerGetNewbies.Responses.$200
>("newbie", "get");

export const tutorGetCourse = defineDynamicAPI<
  Paths.TutorTrainingControllerGetTutorCourse.PathParameters,
  void,
  Paths.TutorTrainingControllerGetTutorCourse.Responses.$200
>("tutor/{id}/training/course/{courseId}", "get");

export const tutorSubmitCourseSection = defineDynamicAPI<
  Paths.TutorTrainingControllerSubmitTutorCourseSection.PathParameters,
  void,
  Paths.TutorTrainingControllerSubmitTutorCourseSection.Responses.$201
>("tutor/{id}/training/course/{courseId}/section/{sectionId}", "post");

export const tutorGetDataShow = defineAPI<
  Paths.TutorControllerGetTutorDataShow.QueryParameters,
  Paths.TutorControllerGetTutorDataShow.Responses.$200
>("tutor/data-show", "get");

export const tutorGetExam = defineDynamicAPI<
  Paths.TutorTrainingControllerGetTutorExam.PathParameters,
  void,
  Paths.TutorTrainingControllerGetTutorExam.Responses.$200
>("tutor/{id}/training/exam/{examId}", "get");

export const tutorGetTask = defineDynamicAPI<
  Paths.TutorTrainingControllerGetTutorTask.PathParameters,
  void,
  Paths.TutorTrainingControllerGetTutorTask.Responses.$200
>("tutor/{id}/training/task/{taskId}", "get");

export const tutorSubmitTask = defineDynamicAPI<
  Paths.TutorTrainingControllerSubmitTutorTask.PathParameters,
  void,
  Paths.TutorTrainingControllerSubmitTutorTask.Responses.$201
>("tutor/{id}/training/task/{taskId}", "post");

export const tutorSubmitExam = defineDynamicAPI<
  Paths.TutorTrainingControllerSubmitTutorExam.PathParameters,
  Paths.TutorTrainingControllerSubmitTutorExam.RequestBody,
  Paths.TutorTrainingControllerSubmitTutorExam.Responses.$201
>("tutor/{id}/training/exam/{examId}", "post");

export const tutorGetAward = defineDynamicAPI<
  Paths.TutorControllerGetAwardsOfTutor.PathParameters,
  void,
  Paths.TutorControllerGetAwardsOfTutor.Responses.$200
>("tutor/{id}/award", "get");

export const tutorGiveAward = defineDynamicAPI<
  Paths.TutorControllerGiveAwardToTutor.PathParameters,
  Paths.TutorControllerGiveAwardToTutor.RequestBody,
  Paths.TutorControllerGiveAwardToTutor.Responses.$201
>("tutor/{id}/award", "post");

export const getTutorList = defineAPI<
  Paths.TutorControllerGetTutors.QueryParameters,
  Paths.TutorControllerGetTutors.Responses.$200
>("tutor", "get");

export const approveTutor = defineDynamicAPI<
  Paths.TutorControllerApproveTutor.PathParameters,
  Paths.TutorControllerApproveTutor.RequestBody,
  Paths.TutorControllerApproveTutor.Responses.$201
>("tutor/{id}/approve", "post");

export const nominateTutor = defineDynamicAPI<
  Paths.TutorControllerNominateTutor.PathParameters,
  void,
  Paths.TutorControllerNominateTutor.Responses.$201
>("tutor/{id}/nominate", "post");
