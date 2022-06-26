<template>
  <div class="uploadBox">
    <el-button style="margin-right: 10px" @click="chooseFile" size="small" type="success">选择文件</el-button>
    <input type="file" multiple v-show="false" ref="domFileSelector" @change="getFile" />
    <el-button
      v-if="fileList.length > 0"
      style="margin-right: 10px"
      @click="uploadAll"
      size="small"
      type="success"
      :disabled="isLoading"
      >上传
    </el-button>
    <ul class="uploadFileList">
      <li v-for="(item, index) of fileList" :key="index">
        <span class="subString">{{ item.name }}</span>
        <span>({{ (item.size / 1024 / 1024).toFixed(2) }}M)</span>
        <span>{{ uploadPercentage[index].toFixed(2) }}%</span>
        <div class="floatRight" style="float: right">
          <el-icon>
            <close style="cursor: pointer" @click="deleteFileInList(index)" />
          </el-icon>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { upload } from "@/utils/file-upload";

const domFileSelector = ref<HTMLInputElement>();
const fileList = ref<Array<File>>([]);
const uploadPercentage = ref<number[]>([]);

const isLoading = ref(false);

// 上传所有文件
const uploadAll = async () => {
  isLoading.value = true;
  for (const [index, file] of fileList.value.entries()) {
    try {
      await upload(file, (loaded, total) => {
        uploadPercentage.value[index] = (loaded / total) * 100;
      });
      ElMessage.success(`${file.name}上传成功`);
    } catch (e) {
      console.error(e);
      ElMessage.error(`${file.name}上传失败`);
    }
  }
  isLoading.value = false;
};

const chooseFile = () => {
  domFileSelector.value?.click();
};

const getFile = () => {
  const files = domFileSelector.value!.files!;
  let isValid = true;
  for (const item of files) {
    if (item.size / 1024 / 1024 > 256) {
      ElMessage.error(`${item.name} 的大小超过了256MB`);
      isValid = false;
      break;
    }
  }
  if (isValid) {
    const fileListAppend = [];
    for (const item of files) {
      fileListAppend.push(item);
    }
    fileList.value = fileList.value.concat(fileListAppend);
    uploadPercentage.value = uploadPercentage.value.concat(new Array(fileListAppend.length).fill(0));
  }
};

const deleteFileInList = (index: number) => {
  fileList.value.splice(index, 1);
  uploadPercentage.value.splice(index, 1);
};
</script>
<style lang="scss" scoped>
.uploadBox {
  color: #000000;
  padding: 10px;
  width: 90%;

  .uploadFileList {
    width: 100%;

    li {
      height: 22px;
      line-height: 22px;
      margin: 10px 0;

      span {
        margin-right: 10px;
        vertical-align: top;
      }

      .subString {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 53%;
        display: inline-block;
      }

      i {
        margin: 5px 5px 0 0;
      }

      .el-icon-close,
      .el-icon-upload-success {
        float: right;
      }

      .upload-success {
        color: green;
      }

      .upload-fail {
        color: red;
      }
    }

    li:hover {
      background-color: #f5f7fa;
    }

    li:first-child {
      margin-top: 10px;
    }
  }
}
</style>
