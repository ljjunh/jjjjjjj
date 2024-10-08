<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import router from "@/router";
import client from "@/api/client";
import { useAuthStore } from "@/stores/auth";
import { useMemberStore } from "@/stores/member";
import Swal from "sweetalert2";

const memberStore = useMemberStore();
const authStore = useAuthStore();
const email = ref("");
const password = ref("");

const { isLogin, isLoginError } = storeToRefs(memberStore);
const { userLogin, getUserInfo } = memberStore;

const loginUser = ref({
  email: "",
  password: "",
});

/** 로그인 함수 */
const login = async () => {
  await userLogin(loginUser.value);
  let token = sessionStorage.getItem("accessToken");
  console.log(token);
  console.log("isLogin: " + isLogin.value);
  if (isLogin.value) {
    getUserInfo(token);
    router.replace("/");
  } else {
    Swal.fire("로그인 실패", "아이디와 비밀번호를 확인해주세요", "error");
    alert("아이디와 비밀번호를 확인해주세요");
  }
};

const handleKakaoLogin = async () => {
  window.location.href = `https://apiyeohaengdam.ttalkak.com/api/auth/oauth2/kakao`;
};

const handleNaverLogin = async () => {
  window.location.href = `https://apiyeohaengdam.ttalkak.com/api/auth/oauth2/naver`;
};
</script>

<template>
  <!--new form-->
  <div class="h-screen flex">
    <!-- 이미지 섹션 -->
    <div
      class="hidden lg:flex w-full lg:w-1/2 justify-around items-center login_img_section"
    >
      <div class="text-center space-y-6">
        <h1 class="text-white text-4xl font-bold">여행담</h1>
        <p class="text-white text-lg">여행 계획을 세워보세요</p>
        <button
          @click="router.push('/signup')"
          class="bg-white text-blue-600 font-bold py-2 px-4 rounded-xl transition-all duration-500 hover:bg-indigo-700 hover:text-white"
        >
          회원 가입 하기
        </button>
      </div>
    </div>
    <!-- 로그인 폼 섹션 -->
    <div class="flex w-full lg:w-1/2 justify-center items-center bg-white">
      <form
        @submit.prevent="login"
        class="bg-white rounded-lg shadow-xl p-5 w-full max-w-md"
      >
        <h1 class="text-gray-800 font-bold text-2xl mb-1">Hello Again!</h1>
        <p class="text-sm font-normal text-gray-600 mb-8">Welcome Back</p>
        <div class="flex items-center border-2 py-2 px-3 rounded-xl mb-6">
          <input
            v-model="loginUser.email"
            type="email"
            name="email"
            placeholder="Email"
            class="w-full outline-none border-none pl-2"
            required
          />
        </div>
        <div class="flex items-center border-2 py-2 px-3 rounded-xl mb-8">
          <input
            v-model="loginUser.password"
            type="password"
            name="password"
            placeholder="Password"
            class="w-full outline-none border-none pl-2"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 py-2 rounded-xl text-white font-semibold hover:bg-blue-700"
        >
          Login
        </button>
        <div class="flex relative mt-3 w-full h-11 gap-x-3">
          <button
            class="w-full h-full bg-contain bg-no-repeat bg-center z-10"
            :style="{
              backgroundImage: `url(/icons/naverLoginIcon_green.png)`,
              backgroundSize: 'cover',
            }"
            @click="handleNaverLogin"
          ></button>

          <button
            class="w-full h-full bg-contain bg-no-repeat bg-center z-10"
            :style="{
              backgroundImage: `url(/icons/kakao_login_large_narrow.png)`,
              backgroundSize: 'cover',
            }"
            @click="handleKakaoLogin"
          ></button>
        </div>
        <div class="flex justify-between mt-4 text-sm">
          <router-link :to="{ name: 'FindPwd' }" class="hover:text-blue-500"
            >비밀번호를 잊으셨나요?</router-link
          >
          <router-link :to="{ name: 'Signup' }" class="hover:text-blue-500"
            >아직 회원이 아니신가요?</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>

<style>
.login_img_section {
  background: linear-gradient(rgba(2, 2, 2, 0.7), rgba(0, 0, 0, 0.7)),
    url("/signimg.jpg") center center;
}
</style>
