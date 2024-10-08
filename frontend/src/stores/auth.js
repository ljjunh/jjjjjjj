import { defineStore } from "pinia";
import router from "@/router";
import client from "@/api/client";

/** TODO : 삭제 필요 */
export const useAuthStore = defineStore("auth", {
  state: () => {
    // 세션 스토리지에서 사용자 데이터 로드
    const savedSession = sessionStorage.getItem("memberDto");
    const userData = savedSession ? JSON.parse(savedSession) : null;

    return {
      isLoggedIn: !!userData,
      user: userData,
    };
  },
  actions: {
    login(userData) {
      this.isLoggedIn = true;
      this.user = userData;
      sessionStorage.setItem("memberDto", JSON.stringify(userData));
    },
    async logout() {
      try {
        await client.get("/member/logout");
        sessionStorage.removeItem("memberDto");
        this.isLoggedIn = false;
        this.user = null;
        router.push({ name: "Landing" });
      } catch (error) {
        console.error("로그아웃 에러: ", error);
      }
    },
  },
});
