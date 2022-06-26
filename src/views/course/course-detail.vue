<template>
  <div class="course-detail">
    <el-row v-if="course">
      <el-col>
        <el-card v-if="section">
          <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 10px">
            <el-breadcrumb-item :to="'/' + userStore.selectedRole.toLowerCase() + '/dashboard'">
              新人看板
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: coursePath }">课程：{{ course.title }}</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: sectionPath }">第{{ sid + 1 }}章：{{ section.title }}</el-breadcrumb-item>
          </el-breadcrumb>
          <!--  PDF container  -->
          <div v-if="fileType === 'pdf'" class="pdf-container">
            <iframe :src="pdfDownloadLink" type="application/pdf" />
          </div>

          <!--  PPT container  -->
          <div v-else-if="fileType === 'ppt'" class="ppt-container">
            <iframe
              :src="`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(section.downloadLink)}`"
            />
          </div>

          <!--  video container  -->
          <div v-else-if="fileType === 'video'" class="video-container">
            <video controls ref="videoRef">
              <source :src="section.downloadLink" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <h3>详情</h3>
          <markdown :source="section.description" />

          <div class="file-container">
            <p>文件名：{{ section.filename }}</p>
            <el-button type="primary" @click="openUrl(section.downloadLink)" :disabled="!section.downloadLink">
              下载
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import CourseSectionForTraineeDto = Components.Schemas.CourseSectionForTraineeDto;
import { useRouter } from "vue-router";
import * as API from "@/api";
import { showError } from "@/api/error";
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";
import Markdown from "@/components/markdown.vue";
import { ElMessage } from "element-plus";
import { ArrowRight } from "@element-plus/icons-vue";

const router = useRouter();
const userStore = useUserStore();
const cid = Number(router.currentRoute.value.params.cid);
const sid = Number(router.currentRoute.value.params.sid);
const apiGetCourse = userStore.selectedRole === "TUTOR" ? API.tutorGetCourse : API.newbieGetCourse;
const apiSubmitSection =
  userStore.selectedRole === "TUTOR" ? API.tutorSubmitCourseSection : API.newbieSubmitCourseSection;
const course = ref<any>(undefined);
const section = ref<CourseSectionForTraineeDto>(undefined as any);

const loadPage = async () => {
  return apiGetCourse({
    id: userStore.userId,
    courseId: cid,
  })
    .then((res) => {
      course.value = res.course!;
      if (isNaN(sid) || sid < 0 || sid >= course.value.sections.length) {
        router.push({ path: "/404" });
        return;
      }
      const _section = course.value.sections[sid];
      // 强制使用https
      _section.downloadLink = _section.downloadLink.replace("http://", "https://");
      section.value = _section;
    })
    .catch(showError);
};

const fileType = computed(() => {
  if (!section.value) {
    return "";
  }
  // 如果不为空
  const ext = section.value.filename.split(".").pop();
  if (ext === "pdf") {
    return "pdf";
  } else if (["ppt", "pptx"].includes(ext as string)) {
    return "ppt";
  } else if (["mp4", "flv", "mov"].includes(ext as string)) {
    return "video";
  } else {
    return "unknown";
  }
});

const pdfDownloadLink = computed(() => {
  // 此处与Nginx配合，将下载链接转换为展示链接
  return section.value.downloadLink.replace("?", ".pdf?");
});

const finishSection = () => {
  apiSubmitSection({
    id: userStore.userId,
    courseId: cid,
    sectionId: sid,
  })
    .then(() => {
      ElMessage.success("本章已完成");
    })
    .catch(showError);
};

const videoRef = ref<HTMLVideoElement>(undefined as any);

onMounted(async () => {
  await loadPage();
  if (!section.value.finished) {
    if (fileType.value === "video") {
      // 如果是视频，则在播放完成后完成章节
      videoRef.value.onended = finishSection;
    } else {
      // 如果不是视频，则直接调用完成章节的接口
      finishSection();
    }
  }
});

const openUrl = (url: string) => {
  window.open(url);
};

const coursePath = computed(() => {
  return "/" + userStore.selectedRole.toLowerCase() + "/course/" + cid.toString();
});

const sectionPath = computed(() => location.pathname);
</script>

<style lang="scss" scoped>
.pdf-container iframe {
  display: block;
  height: 400px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  border: none;
  background-color: #5a5e66;
}

.ppt-container iframe {
  display: block;
  height: 400px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  border: none;
  background-color: #5a5e66;
}

.video-container video {
  display: block;
  height: 400px;
  margin-left: auto;
  margin-right: auto;
  border: none;
}

.file-container {
  margin-top: 20px;
}
</style>
