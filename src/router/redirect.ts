import NProgress from "nprogress";
import { RouteRecordRaw } from "vue-router";
import router, { getFirstRouteForSelectedRole } from "@/router/index";
import { useUserStore } from "@/stores/user";
import { useRouteStore } from "@/stores/route";
import { cookieGetId, cookieGetToken } from "@/utils/cookies";

NProgress.configure({ showSpinner: false });

function hasLogin() {
  return cookieGetToken() && !isNaN(cookieGetId());
}

export function filterRendering(routes: RouteRecordRaw[]) {
  const userStore = useUserStore();
  let urlFilter = "";
  switch (userStore.selectedRole) {
    case "NEWBIE":
      urlFilter = "/newbie/";
      break;
    case "TUTOR":
      urlFilter = "/tutor/";
      break;
    case "ADMIN":
      urlFilter = "/admin/";
      break;
    case "HRBP":
      urlFilter = "/hrbp/";
      break;
  }
  return routes.filter((route) => (route.meta?.isRendering ?? true) && route.path.startsWith(urlFilter));
}

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const routeStore = useRouteStore();
  NProgress.start();
  if (hasLogin()) {
    if (to.path === "/login") {
      // 如果已经登陆，并尝试访问/login，则跳转到主页
      next({ path: "/" });
    } else if (to.meta.onlyRoot ?? false) {
      await userStore.getProfile(); // 先获取用户信息
      if (userStore.isRoot) {
        next();
      } else {
        next({ path: "/" });
      }
    } else if (routeStore.sidebarRoutes.length > 0) {
      if (to.path.startsWith("/newbie/")) {
        userStore.$patch({
          selectedRole: "NEWBIE",
        });
      } else if (to.path.startsWith("/admin/")) {
        userStore.$patch({
          selectedRole: "ADMIN",
        });
      } else if (to.path.startsWith("/tutor/")) {
        userStore.$patch({
          selectedRole: "TUTOR",
        });
      } else if (to.path.startsWith("/hrbp/")) {
        userStore.$patch({
          selectedRole: "HRBP",
        });
      }
      routeStore.generateSidebarRoutes();
      if (to.path == "/dashboard") {
        next({ path: getFirstRouteForSelectedRole() });
      } else if (to.matched.length === 0) {
        next({ path: "/404" });
      } else {
        next();
      }
    } else {
      await userStore.getProfile(); // 先获取用户信息
      userStore.$patch({
        selectedRole: userStore.roles[0],
      });
      routeStore.generateSidebarRoutes();
      next({ ...to, replace: true }); // 重新导航一次，并且删除此次记录
    }
  } else {
    // 如果没有token
    if (to.meta.needLogin ?? true) {
      // 如果下一个页面需要登陆
      next({ path: "/login" });
    } else {
      // 不需要登陆
      next();
    }
  }
});

router.afterEach((to) => {
  if (to.meta.name) {
    document.title = to.meta.name as string;
  }
  NProgress.done();
});
