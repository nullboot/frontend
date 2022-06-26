<template>
  <div class="course-overview">
    <el-row>
      <el-col>
        <el-card v-if="course">
          <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 10px">
            <el-breadcrumb-item :to="'/' + userStore.selectedRole.toLowerCase() + '/dashboard'">
              {{ userStore.selectedRole === "NEWBIE" ? "新人看板" : "导师培训" }}
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: coursePath }">课程：{{ course.title }}</el-breadcrumb-item>
          </el-breadcrumb>
          <h2>{{ course.title }}</h2>
          <markdown :source="course.description" style="margin-bottom: 10px" />
          <el-collapse>
            <el-collapse-item
              v-for="(section, idx) in course.sections"
              :key="idx"
              :name="idx"
              style="position: relative"
            >
              <template #title>
                <el-icon class="header-icon">
                  <component :is="section.type === 'video' ? 'videoPlay' : 'dataBoard'" />
                </el-icon>
                <el-tag :type="section.finished ? 'info' : ''" style="margin-right: 10px">
                  {{ section.finished ? "已完成" : "未完成" }}
                </el-tag>
                {{ section.title }}
                <el-button class="item-right" text @click.stop="clickDetail(idx)">开始学习</el-button>
              </template>
              <markdown :source="section.description" />
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import CourseForTraineeDto = Components.Schemas.CourseForTraineeDto;
import * as API from "@/api";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { APIError, showError } from "@/api/error";
import Markdown from "@/components/markdown.vue";
import { ArrowRight } from "@element-plus/icons-vue";

const userStore = useUserStore();
const router = useRouter();
const cid = Number(router.currentRoute.value.params.cid);
const course = ref<CourseForTraineeDto>(undefined as any);

// 在路由阶段确保角色是二者之一
const apiGetCourse = userStore.selectedRole === "TUTOR" ? API.tutorGetCourse : API.newbieGetCourse;
const pathPrefix = userStore.selectedRole === "TUTOR" ? "tutor" : "newbie";

const loadPage = () => {
  apiGetCourse({
    id: userStore.userId,
    courseId: cid,
  })
    .then((res) => {
      course.value = res.course!;
    })
    .catch((err) => {
      if (err instanceof APIError && err.message === "NO_SUCH_COURSE") {
        // 如果没有此课程，则404
        router.push({ path: "/404" });
      } else {
        showError(err);
      }
    });
};

const clickDetail = (sid: number) => {
  router.push({
    path: `/${pathPrefix}/course/${cid}/section/${sid}`,
  });
};

const coursePath = computed(() => location.pathname);

onMounted(() => {
  loadPage();
});
</script>

<style lang="scss" scoped>
.header-icon {
  margin-right: 10px;
}

.item-right {
  position: absolute;
  right: 60px;
}
</style>
