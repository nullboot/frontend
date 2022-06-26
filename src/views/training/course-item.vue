<template>
  <div class="root-div">
    <el-row>
      <el-col :span="6" class="course-pic-wrapper">
        <img class="course-pic" src="@/assets/course-pic.jpg" alt="course-pic" style="margin-left: 10px" />
      </el-col>
      <el-col :span="18">
        <div class="course-item" v-if="courseDetail?.title" @click="gotoCourse">
          <div class="header">
            <span class="title">
              {{ courseDetail.title }}
            </span>
            <el-tag v-if="courseDetail.isOptional" type="primary">选修</el-tag>
            <el-tag v-else type="success">必修</el-tag>
            <el-tag type="info">{{ `Day ${courseDetail.day}` }}</el-tag>
            <editable-tags :tags="courseDetail.tags" :editable="false" />
          </div>
          <markdown :source="courseDetail.description" class="description" />
          <el-progress :percentage="progress" :status="status">
            共 {{ finished }} / {{ courseDetail.sections.length }} 部分
          </el-progress>
        </div>
      </el-col>
    </el-row>
    <el-divider />
  </div>
</template>

<script lang="ts" setup>
import * as API from "@/api";
import { useUserStore } from "@/stores/user";
import { computed, onMounted, ref } from "vue";
import Markdown from "@/components/markdown.vue";
import router from "@/router";
import { formatString } from "@/utils/string";
import EditableTags from "@/components/editable-tags.vue";
import { useRouter } from "vue-router";
// eslint-disable-next-line no-undef
import CourseForTraineeDto = Components.Schemas.CourseForTraineeDto;

const props = defineProps({
  courseId: {
    type: Number,
    required: true,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const apiGetCourse =
  !props.readOnly && useUserStore().selectedRole == "TUTOR" ? API.tutorGetCourse : API.newbieGetCourse;

const nid = Number(useRouter().currentRoute.value.params.nid);
const apiID = props.readOnly ? nid : useUserStore().userId;

const courseDetail = ref<CourseForTraineeDto>();

const fetchCourseDetail = () => {
  apiGetCourse({ id: apiID, courseId: props.courseId }).then((res) => {
    courseDetail.value = res.course;
  });
};

const finished = computed(() => {
  let res = 0;
  courseDetail.value!.sections.forEach((section) => (res += section.finished ? 1 : 0));
  return res;
});

const progress = computed(() => {
  if (!courseDetail.value?.sections) return 0;
  return (finished.value * 100) / courseDetail.value!.sections.length;
});

const status = computed(() => {
  if (finished.value === courseDetail.value!.sections.length) return "success";
  return "";
});

const gotoCourse = () => {
  if (props.readOnly) {
    return;
  }
  if (useUserStore().selectedRole == "NEWBIE") {
    router.push(formatString("/newbie/course/{courseId}", { courseId: props.courseId }));
  } else {
    router.push(formatString("/tutor/course/{courseId}", { courseId: props.courseId }));
  }
};

onMounted(() => {
  fetchCourseDetail();
});
</script>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 0;
}
.course-pic-wrapper {
  display: block;
  margin: auto;
}
.course-pic {
  width: 100%;
}
.course-item {
  padding: 10px 20px 10px 20px;
  cursor: pointer;

  .header {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;

    .el-tag + .title {
      margin-left: 10px;
    }

    .title + .el-tag {
      margin-left: 10px;
    }

    .el-tag + .el-tag {
      margin-left: 5px;
    }

    .title {
      font-size: 1.5rem;
    }
  }

  .description {
    margin-top: 10px;
    margin-bottom: 20px;
    padding-left: 10px;
    padding-right: 10px;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
}
</style>
