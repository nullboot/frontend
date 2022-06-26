import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useUserStore } from "@/stores/user";

const Layout = () => import(/* webpackChunkName: "layout" */ "@/layout/index.vue");

// 依赖Layout的固定路由
const constantRoutes: Array<RouteRecordRaw> = [];

// 不依赖Layout的路由
const rootRoutes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: () => import(/* webpackChunkName: "login" */ "@/views/login/login.vue"),
    meta: {
      name: "登录页面",
      needLogin: false, // 是否需要登录，无此项则默认需要
    },
  },
  {
    path: "/about",
    name: "about",
    component: () => import(/* webpackChunkName: "about" */ "@/views/about.vue"),
    meta: {
      name: "关于页面",
      needLogin: false,
    },
  },
  {
    path: "/user/:id/edit",
    name: "userEdit",
    component: () => import("@/views/user/user-edit-page.vue"),
    meta: {
      name: "用户修改页面",
    },
  },
  {
    path: "/root-page",
    name: "rootPage",
    component: () => import("@/views/root/root-page.vue"), //鉴权在跳转时进行
    meta: {
      onlyRoot: true, // 仅允许root访问
      name: "系统管理员页面",
    },
  },
  {
    path: "/root/file-upload",
    name: "fileUploadForRoot",
    component: () => import("@/views/root/file-upload.vue"),
    meta: {
      onlyRoot: true,
      name: "文件上传页面",
    },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/404.vue"),
    meta: {
      needLogin: false,
      name: "404",
    },
  },
  {
    path: "/missing-role-page",
    name: "Missing Role Page",
    component: () => import("@/views/missing-role-page.vue"),
    meta: {
      name: "角色缺失页面",
    },
  },
];

// 角色相关路由
const newbieRoutes: Array<RouteRecordRaw> = [
  {
    path: "/newbie/dashboard", // 如果不加斜线，那么只修改路径的最后一位
    name: "newbie-dashboard",
    component: () => import("@/views/training/dashboard.vue"),
    meta: {
      name: "新人看板",
      icon: "HomeFilled",
    },
  },
  {
    path: "/newbie/take-exam/:eid",
    name: "takeExam",
    component: () => import("@/views/exam/take-exam.vue"),
    meta: {
      isRendering: false,
      name: "新人考试",
    },
  },
  {
    path: "/newbie/course/:cid",
    name: "courseOverview",
    component: () => import("@/views/course/course-overview.vue"),
    meta: {
      isRendering: false,
      name: "新人课程",
    },
  },
  {
    path: "/newbie/course/:cid/section/:sid",
    name: "courseDetail",
    component: () => import("@/views/course/course-detail.vue"),
    meta: {
      isRendering: false,
      name: "新人课程详情",
    },
  },
];

const tutorRoutes: Array<RouteRecordRaw> = [
  {
    path: "/tutor/dashboard",
    name: "tutorDashboard",
    component: () => import("@/views/tutor/tutor-dashboard.vue"),
    meta: {
      name: "带新看板",
      icon: "dataAnalysis",
    },
  },
  {
    path: "/tutor/take-exam/:eid",
    name: "takeExamTutor",
    component: () => import("@/views/exam/take-exam.vue"),
    meta: {
      isRendering: false,
      name: "导师考试",
    },
  },
  {
    path: "/tutor/course/:cid",
    name: "courseOverviewTutor",
    component: () => import("@/views/course/course-overview.vue"),
    meta: {
      isRendering: false,
      name: "导师课程",
    },
  },
  {
    path: "/tutor/course/:cid/section/:sid",
    name: "courseDetailTutor",
    component: () => import("@/views/course/course-detail.vue"),
    meta: {
      isRendering: false,
      name: "导师课程详情",
    },
  },
  {
    path: "/tutor/training-dashboard",
    name: "tutorTrainingDashboard",
    component: () => import("@/views/training/dashboard.vue"),
    meta: {
      name: "导师培训",
      icon: "DataBoard",
    },
  },
];

const hrbpRoutes: Array<RouteRecordRaw> = [
  {
    path: "/hrbp/tutor-list",
    name: "hrbpTutorList",
    component: () => import("@/views/hrbp/tutor-list.vue"),
    meta: {
      name: "导师列表",
      icon: "Tickets",
    },
  },
];

const adminRoutes: Array<RouteRecordRaw> = [
  {
    path: "/admin/newbie-list",
    name: "adminNewbieList",
    component: () => import("@/views/admin/newbie-list.vue"),
    meta: {
      name: "新人列表",
      icon: "Tickets",
    },
  },
  {
    path: "/admin/tutor-list",
    name: "adminTutorList",
    component: () => import("@/views/admin/tutor-list.vue"),
    meta: {
      name: "导师列表",
      icon: "Tickets",
    },
  },
  {
    path: "/admin/tutor-candidate-list",
    name: "adminTutorCandidateList",
    component: () => import("@/views/admin/tutor-candidate-list.vue"),
    meta: {
      name: "提名导师",
      icon: "Tickets",
    },
  },
  {
    path: "/admin/template-list",
    name: "adminTemplateList",
    component: () => import("@/views/admin/template-list/template-list.vue"),
    meta: {
      name: "管理模板",
      icon: "List",
    },
  },
  {
    path: "/admin/data-show",
    name: "adminDataShow",
    component: () => import("@/views/admin/data-show/data-show.vue"),
    meta: {
      name: "查看数据",
      icon: "dataAnalysis",
    },
  },
  {
    path: "/admin/tutor/:tid/dashboard",
    name: "adminTutorDashboard",
    component: () => import("@/views/tutor/tutor-dashboard.vue"),
    meta: {
      isRendering: false,
      name: "管理员查看导师",
    },
  },
  {
    path: "/admin/newbie/:nid/dashboard",
    name: "adminNewbieDashboard",
    component: () => import("@/views/training/dashboard.vue"),
    meta: {
      isRendering: false,
      name: "管理员查看新人",
    },
  },
];

function generateConstantRouteTable() {
  const rootRouteItem: RouteRecordRaw = {
    path: "/",
    name: "root",
    component: Layout,
    redirect: "/dashboard",
    children: constantRoutes,
  };
  const tempRoutes: Array<RouteRecordRaw> = [rootRouteItem];
  return tempRoutes.concat(rootRoutes);
}

export function generateRouteTable() {
  const roles = useUserStore().roles;
  let extentRoutes: Array<RouteRecordRaw> = [];
  if (roles.includes("NEWBIE")) {
    extentRoutes = extentRoutes.concat(newbieRoutes);
  }
  if (roles.includes("TUTOR")) {
    extentRoutes = extentRoutes.concat(tutorRoutes);
  }
  if (roles.includes("ADMIN")) {
    extentRoutes = extentRoutes.concat(adminRoutes);
  }
  if (roles.includes("HRBP")) {
    extentRoutes = extentRoutes.concat(hrbpRoutes);
  }
  const tempRoutes = generateConstantRouteTable();
  tempRoutes[0].children = extentRoutes.concat(tempRoutes[0].children!);
  return tempRoutes;
}

export function getFirstRouteForSelectedRole() {
  const userStore = useUserStore();
  switch (userStore.selectedRole) {
    case "NEWBIE":
      return newbieRoutes[0].path;
    case "TUTOR":
      return tutorRoutes[0].path;
    case "HRBP":
      return hrbpRoutes[0].path;
    case "ADMIN":
      return adminRoutes[0].path;
    default:
      return "/missing-role-page";
  }
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: generateConstantRouteTable(),
});

export default router;
