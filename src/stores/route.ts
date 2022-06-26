import { defineStore } from "pinia";
import { RouteRecordRaw } from "vue-router";
import router, { generateRouteTable } from "@/router";
import { filterRendering } from "@/router/redirect";

export const useRouteStore = defineStore("route", {
  state: () => {
    return {
      sidebarRoutes: [] as RouteRecordRaw[],
    };
  },
  actions: {
    generateSidebarRoutes() {
      const routeTable = generateRouteTable(); // 重新生成路由表
      for (const route of routeTable) {
        router.addRoute(route); // name相同的路由会覆盖
      }
      this.sidebarRoutes = filterRendering(routeTable[0].children!); // 更新store里的路由表，以更新侧栏
    },
  },
});
