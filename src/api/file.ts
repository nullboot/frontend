import { defineAPI } from "@/api/wrapper";
import FileInfoDto = Components.Schemas.FileInfoDto;
import axios from "axios";

export const fileUploadSign = defineAPI<
  Paths.FileControllerSignFileUpload.RequestBody,
  Paths.FileControllerSignFileUpload.Responses.$201
>("/file/upload/sign", "post");

export const fileUploadDone = defineAPI<
  Paths.FileControllerDoneFileUpload.RequestBody,
  Paths.FileControllerDoneFileUpload.Responses.$201
>("/file/upload/done", "post");

export const fileDownload = (fileInfo: FileInfoDto) => {
  const url = new URL(fileInfo.downloadLink);
  return axios.get(url.pathname, { responseType: "blob", params: url.searchParams });
};

export const saveAs = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
