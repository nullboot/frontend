// 上传单个文件的全流程
import * as API from "@/api";
import axios, { Canceler } from "axios";

export const upload = async (
  file: File,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  progressCallback: (loaded: number, total: number) => void = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  saveCanceler: (c: Canceler) => void = () => {},
) => {
  const size = file.size;
  const signRes = await API.fileUploadSign({ size });
  const req = signRes.signedRequest!;
  const formData = new FormData();
  if (req.extraFormData)
    Object.entries(req.extraFormData).forEach(([key, value]) => formData.append(key, value as string));
  formData.append(req.fileFieldName || "file", file);
  const url = new URL(req.url);
  // 向minio上传文件
  await axios.post(url.pathname, formData, {
    onUploadProgress: (progressEvent) => {
      if (progressCallback) progressCallback(progressEvent.loaded, progressEvent.total);
    },
    cancelToken: new axios.CancelToken(saveCanceler),
  });
  // 将文件上传成功后的信息发送给后端
  const doneRes = await API.fileUploadDone({
    uuid: req.uuid,
    size: file.size,
  });

  console.log(`Uploaded "${file.name}", info =`, doneRes);
  return doneRes;
};
