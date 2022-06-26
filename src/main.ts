import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import "@/router/redirect";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElIconModules from "@element-plus/icons-vue";
import "nprogress/nprogress.css";
import "@/styles/index.scss";

// custom components
import markdown from "@/components/markdown.vue";
import gavatar from "@/components/gavatar.vue";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia).use(router).use(ElementPlus);

// 注册图标
for (const iconName in ElIconModules) {
  app.component(iconName, ElIconModules[iconName as keyof typeof ElIconModules]);
}

// 注册组件
app.component("markdown", markdown);
app.component("gavatar", gavatar);

// 关闭数据收集
// window.HELP_IMPROVE_VIDEOJS = false;

// 启动应用
app.mount("#app");
