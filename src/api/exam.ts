import { defineAPI, defineDynamicAPI, wrapRequest } from "@/api/wrapper";

export const createExam = defineAPI<
  Paths.ExamControllerCreateExam.RequestBody,
  Paths.ExamControllerCreateExam.Responses.$201
>("exam/new", "post");

export const getExamById = defineDynamicAPI<
  Paths.ExamControllerGetExam.PathParameters,
  void,
  Paths.ExamControllerGetExam.Responses.$200
>("exam/{id}", "get");

export const updateExamById = defineDynamicAPI<
  Paths.ExamControllerUpdateExam.PathParameters,
  Paths.ExamControllerUpdateExam.RequestBody,
  Paths.ExamControllerUpdateExam.Responses.$201
>("exam/{id}", "post");

export const deleteExamById = defineDynamicAPI<
  Paths.ExamControllerDeleteExam.PathParameters,
  void,
  Paths.ExamControllerDeleteExam.Responses.$200
>("exam/{id}", "delete");

export const getAllExams = defineAPI<
  Paths.ExamControllerGetExams.QueryParameters,
  Paths.ExamControllerGetExams.Responses.$200
>("exam", "get");

export const parseExamProblems = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return wrapRequest<Paths.ExamControllerParseExamCsvFile.Responses.$201>({
    url: "/exam/parse",
    method: "post",
    data: formData,
  });
};

export const getExamTemplate = () =>
  wrapRequest({
    url: "/exam/template",
    method: "get",
    responseType: "blob",
  });
