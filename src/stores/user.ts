import { defineStore } from "pinia";
import { APIError } from "@/api/error";
import { getUserProfile } from "@/api/user";
import { cookieGetId } from "@/utils/cookies";

interface Tag {
  id: number;
  name: string;
}

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      userId: 0,
      username: "",
      realname: "",
      email: "",
      isPublicEmail: false,
      isRoot: false,
      roles: [] as ("NEWBIE" | "TUTOR" | "HRBP" | "ADMIN")[],
      selectedRole: "" as "NEWBIE" | "TUTOR" | "HRBP" | "ADMIN",
      division: null as Tag | null,
      city: null as Tag | null,
    };
  },
  actions: {
    getProfile() {
      const localId = cookieGetId();
      // If the profile is already loaded, do nothing
      if (this.userId === localId) return Promise.resolve();
      // Else load the profile from backend
      return getUserProfile({ id: localId }).then((res) => {
        // 检查用户id是否匹配
        if (res.profile?.id !== localId) {
          throw new APIError("MISMATCHED_ID", { local: localId, remote: res.profile?.id });
        }
        // 储存信息
        this.$patch({
          userId: res.profile.id,
          username: res.profile.username,
          realname: res.profile.realname,
          email: res.profile.email,
          isPublicEmail: res.profile.publicEmail,
          isRoot: res.profile.isRoot,
          roles: res.profile.roles,
          division: res.profile.division,
          city: res.profile.city,
        });
        // 设定默认角色
        this.$patch({ selectedRole: res.profile.roles[0] });
      });
    },
  },
});
