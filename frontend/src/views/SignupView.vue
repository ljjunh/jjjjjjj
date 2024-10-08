<script setup>
import { ref } from "vue";
import { joinUser } from "@/api/user";
import { useRouter } from "vue-router";
import axios from "axios";
import { showConfetti } from "@/util/confetti";
import EmailVerification from "@/components/common/EmailVerification.vue";
import CustomLoading from "@/components/common/CustomLoading.vue";
import Swal from "sweetalert2";
/** 회원 가입 */
const nickname = ref("");
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const isNicknameAvailable = ref(false);
const hasCheckedNickname = ref(false);
const isNicknameConfirmed = ref(false);
const isEmailConfirmed = ref(false);
const emailVerificationVisible = ref(false);
const isLoading = ref(false);
const router = useRouter();

const handleKakaoSignUp = async () => {
  window.location.href = `https://apiyeohaengdam.ttalkak.com/api/auth/oauth2/kakao`;
};

const handleNaverSignUp = async () => {
  window.location.href = `https://apiyeohaengdam.ttalkak.com/api/auth/oauth2/naver`;
};

/** 회원 가입 */
const handleSignUp = async () => {
  if (!hasCheckedNickname.value) {
    Swal.fire("회원 가입 오류!", "닉네임 중복체크를 해주세요!", "error");

    return;
  }
  if (!isEmailConfirmed.value) {
    Swal.fire("회원 가입 오류!", "이메일 인증을 완료해주세요!", "error");
    return;
  }
  if (password.value.length < 6) {
    Swal.fire(
      "비밀번호 오류!",
      "비밀번호는 최소 6자리 이상이어야 합니다",
      "error"
    );

    return;
  }
  if (password.value !== passwordConfirmation.value) {
    Swal.fire("비밀번호 오류!", "비밀번호가 일치하지 않습니다.", "error");

    return;
  }
  const user = {
    nickname: nickname.value,
    email: email.value,
    password: password.value,
  };
  console.log(user);
  const result = await joinUser(user);
  console.log("회원가입 결과:", result);

  if (result.success) {
    Swal.fire({
      title: "회원가입이 완료되었습니다.",
      imageUrl: "/rottie/basicSuccess.gif",
      imageWidth: 150,
      imageHeight: 150,
      imageAlt: "Custom image",
    });
    showConfetti();
    router.replace("/login");
  } else {
    alert("회원가입에 실패했습니다.");
  }
};

/** 비밀번호 보이게 / 보이지 않게 */
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

/** 닉네임 중복 체크 */
const nicknameCheck = async () => {
  if (!nickname.value) {
    Swal.fire("닉네임 중복 체크 오류!", "이메일을 입력해주세요!", "error");
    alert("이메일을 입력해주세요.");
    return;
  }
  try {
    const response = await axios.get(
      `https://apiyeohaengdam.ttalkak.com/api/users/check_nickname/${nickname.value}`
    );
    if (response.data.available) {
      const confirmUse = confirm(
        "사용 가능한 닉네임입니다. 이 닉네임을 사용하시겠습니까?"
      );
      if (confirmUse) {
        isNicknameAvailable.value = true;
        isNicknameConfirmed.value = true;
        hasCheckedNickname.value = true;
      }
    } else {
      Swal.fire("닉네임 중복!", "이미 사용 중인 닉네임입니다!", "error");
      isNicknameAvailable.value = false;
    }
  } catch (error) {
    console.error("닉네임 중복체크 오류:", error);
    Swal.fire("중복 체크 오류!", "중복 체크 중 오류가 발생했습니다.", "error");
  }
};

/** 이메일 체크 */
const emailCheck = async (emailInput) => {
  if (!email.value) {
    Swal.fire(
      "이메일을 입력해주세요!",
      "이메일은 필수로 입력되어야 하는 항목입니다",
      "error"
    );
    return;
  }
  isLoading.value = true;
  try {
    const response = await axios.post(
      `https://apiyeohaengdam.ttalkak.com/api/auth/checkEmail`,
      {
        email: email.value,
        emailInput,
      }
    );
    if (response.status === 200) {
      emailVerificationVisible.value = true;
    } else {
      alert("이메일 인증이 완료되지 않았습니다.");
    }
  } catch (error) {
    console.error("이메일 인증 오류:", error);
    Swal.fire(
      "잘못된 인증 코드입니다!",
      "이메일 인증 코드 확인 중 오류가 발생했습니다.",
      "error"
    );
  } finally {
    isLoading.value = false; // 로딩 상태 종료
  }
};

const verifyEmailCode = async (code) => {
  try {
    const response = await axios.post(
      `https://apiyeohaengdam.ttalkak.com/api/auth/checkCode`,
      {
        email: email.value,
        code: code,
      }
    );
    if (response.status == 200) {
      emailVerificationVisible.value = false;
      isEmailConfirmed.value = true;
      Swal.fire({
        title: "이메일 인증이 완료되었습니다",
        imageUrl: "/rottie/basicSuccess.gif",
        imageWidth: 150,
        imageHeight: 150,
        imageAlt: "Custom image",
      });
    } else {
      Swal.fire(
        "잘못된 인증 코드입니다!",
        "이메일 인증 코드 확인 중 오류가 발생했습니다.",
        "error"
      );
    }
  } catch (error) {
    console.error("이메일 인증 코드 확인 오류:", error);
    Swal.fire(
      "잘못된 인증 코드입니다!",
      "이메일 인증 코드 확인 중 오류가 발생했습니다.",
      "error"
    );
  }
};
</script>

<template>
  <div class="w-full min-h-screen flex items-center justify-center">
    <div class="w-full h-screen flex items-center justify-center">
      <div
        class="w-full sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-2/6 h-full bg-white flex items-center justify-center"
      >
        <div class="w-full px-12">
          <h2
            class="text-center text-2xl font-bold tracking-wide text-gray-800"
          >
            Sign Up
          </h2>
          <p class="text-center text-sm text-gray-600 mt-2">
            이미 계정이 있으신가요?
            <router-link
              :to="{ name: 'Login' }"
              class="text-blue-600 hover:text-blue-700 hover:underline"
              title="Sign In"
              >여기에서 로그인 하세요</router-link
            >
          </p>

          <form class="my-8 text-sm" @submit.prevent>
            <div class="flex flex-col my-4">
              <label for="nickname" class="text-gray-700">Nick Name</label>
              <div class="flex items-center mt-2">
                <input
                  type="text"
                  name="nickname"
                  id="nickname"
                  class="disabled:bg-regal-blue flex-grow p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
                  placeholder="Enter your nickname"
                  v-model="nickname"
                  :disabled="isNicknameConfirmed"
                />
                <button
                  class="ml-2 bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 text-gray-100 hover:shadow-xl transition duration-150 uppercase"
                  @click="nicknameCheck"
                >
                  중복 검사
                </button>
              </div>
            </div>

            <div class="flex flex-col my-4">
              <label for="email" class="text-gray-700">Email Address</label>
              <div class="flex items-center mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="disabled:bg-regal-blue flex-grow p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
                  placeholder="Enter your email"
                  v-model="email"
                  :disabled="isEmailConfirmed"
                />
                <button
                  class="ml-2 bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 text-gray-100 hover:shadow-xl transition duration-150 uppercase"
                  @click="emailCheck"
                >
                  이메일 인증
                </button>
              </div>
            </div>

            <div class="flex flex-col my-4">
              <label for="password" class="text-gray-700">Password</label>
              <div
                x-data="{ show: false }"
                class="relative flex items-center mt-2"
              >
                <input
                  :type="showPassword ? 'text' : 'password'"
                  name="password"
                  id="password"
                  class="flex-1 p-2 pr-10 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
                  placeholder="Enter your password"
                  v-model="password"
                />
                <button
                  @click="togglePasswordVisibility"
                  type="button"
                  class="absolute right-2 bg-transparent flex items-center justify-center text-gray-700"
                >
                  <svg
                    :class="{ hidden: showPassword }"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    ></path>
                  </svg>

                  <svg
                    :class="{ hidden: !showPassword }"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex flex-col my-4">
              <label for="password_confirmation" class="text-gray-700"
                >Password Confirmation</label
              >
              <div
                x-data="{ show: false }"
                class="relative flex items-center mt-2"
              >
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  name="password_confirmation"
                  id="password_confirmation"
                  class="flex-1 p-2 pr-10 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
                  placeholder="Enter your password again"
                  v-model="passwordConfirmation"
                />
                <button
                  @click="toggleConfirmPasswordVisibility"
                  type="button"
                  class="absolute right-2 bg-transparent flex items-center justify-center text-gray-700"
                >
                  <svg
                    :class="{ hidden: showConfirmPassword }"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    ></path>
                  </svg>

                  <svg
                    :class="{ hidden: !showConfirmPassword }"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex items-center">
              <input
                type="checkbox"
                name="remember_me"
                id="remember_me"
                class="mr-2 focus:ring-0 rounded"
              />
              <label for="remember_me" class="text-gray-700"
                >I accept the
                <a class="text-blue-600 hover:text-blue-700 hover:underline"
                  >terms</a
                >
                and
                <a class="text-blue-600 hover:text-blue-700 hover:underline"
                  >privacy policy</a
                ></label
              >
            </div>

            <div class="my-4 flex items-center justify-end space-x-4">
              <button
                class="bg-blue-600 hover:bg-blue-700 rounded-lg px-8 py-2 text-gray-100 hover:shadow-xl transition duration-150 uppercase w-full"
                @click="handleSignUp"
              >
                Sign Up
              </button>
            </div>
          </form>

          <div class="flex items-center justify-between">
            <div class="w-full h-[1px] bg-gray-300"></div>
            <span class="text-sm uppercase mx-6 text-gray-400">Or</span>
            <div class="w-full h-[1px] bg-gray-300"></div>
          </div>

          <div class="text-sm">
            <a
              class="flex items-center justify-center space-x-2 text-black my-2 py-2 rounded"
              @click="handleKakaoSignUp"
              :style="{ backgroundColor: '#FEE500' }"
            >
              <span>Sign up with kakao</span>
            </a>
            <a
              class="flex items-center justify-center space-x-2 text-white my-2 py-2 rounded"
              @click="handleNaverSignUp"
              :style="{ backgroundColor: '#03C75A' }"
            >
              <span>Sign up with naver</span>
            </a>
          </div>
        </div>
      </div>
      <div
        class="hidden lg:flex lg:w-1/2 xl:w-2/3 2xl:w-3/4 h-full bg-cover"
        style="background-image: url('/signimg.jpg')"
      >
        <div
          class="w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-30"
        >
          <div class="flex items-center justify-center space-x-2">
            <img
              src="/icons/island-svgrepo-com.svg"
              alt="Island SVG"
              class="h-16 w-16"
            />
            <h1
              class="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-100 tracking-wider"
            >
              여행담
            </h1>
          </div>
          <p class="text-gray-300 mt-4 px-16 text-center">
            지금 가입하고 여행 계획을 세워보세요
          </p>
          <a
            class="mt-6 bg-gray-100 hover:bg-gray-200 px-6 py-2 rounded text-sm uppercase text-gray-900 transition duration-150"
            title="Learn More"
            >Learn More</a
          >
        </div>
      </div>
    </div>
    <EmailVerification
      :visible="emailVerificationVisible"
      :email="email"
      @verified="verifyEmailCode"
      @close="emailVerificationVisible = false"
    />
    <CustomLoading v-if="isLoading" />
  </div>
</template>

<style scoped></style>
