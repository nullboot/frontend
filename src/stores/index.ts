import { useUserStore } from "@/stores/user";
import { useRouteStore } from "@/stores/route";

export function clearAllStore() {
  useUserStore().$reset();
  useRouteStore().$reset();
}
