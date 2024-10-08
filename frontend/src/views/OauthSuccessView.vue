<script setup>
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMemberStore } from "@/stores/member";
import Swal from "sweetalert2";

const router = useRouter();
const route = useRoute();
const memberStore = useMemberStore();

onMounted(async () => {
  const accessToken = route.params.accessToken;
  // const expiresIn = route.params.expiresIn; // 필요 없다면 무시

  if (accessToken) {
    // 토큰을 세션 스토리지에 저장
    sessionStorage.setItem("accessToken", accessToken);

    // memberStore의 상태 업데이트
    memberStore.isLogin = true;
    memberStore.isLoginError = false;
    memberStore.isValidToken = true;

    // 사용자 정보 가져오기
    await memberStore.getUserInfo(accessToken);

    // 랜딩 페이지로 리디렉션
    router.replace("/");
  } else {
    // 토큰이 없을 경우 오류 처리
    Swal.fire("OAuth 인증 실패", "액세스 토큰을 찾을 수 없습니다", "error");

    router.push("/login"); // 로그인 페이지로 이동
  }
});
</script>

<template>
  <div>OAuth 인증 성공! 리디렉션 중...</div>
</template>

<style scoped></style>
