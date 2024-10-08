<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useMemberStore } from '@/stores/member';
import Swal from 'sweetalert2';

const memberStore = useMemberStore();
const { getUserInfo } = memberStore;
const router = useRouter();
const token = sessionStorage.getItem('accessToken');
const nickname = ref('닉네임');
const email = ref('sgo722@naver.com');

const currentPassword = ref('');
const password = ref('');
const passwordConfirmation = ref('');

/** 비밀번호 보이게 / 보이지 않게 */
const showPrevPassword = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const togglePrevPasswordVisibility = () => {
  showPrevPassword.value = !showPrevPassword.value;
};
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// Todo 비밀번호 변경 api 로 바꿀 필요 있음
const handleUpdate = async () => {
  const user = {
    nickname: nickname.value,
    email: email.value,
    password: password.value,
  };

  try {
    const token = sessionStorage.getItem('accessToken');

    const response = await axios.put(
      'https://apiyeohaengdam.ttalkak.com/api/users/update_password',
      user,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    if (response.status === 200) {
      Swal.fire({
        title: '정보가 성공적으로 업데이트되었습니다.',
        imageUrl: '/rottie/basicUpdate.gif',
        imageWidth: 150,
        imageHeight: 150,
        imageAlt: 'Custom image',
      });
      router.replace('/');
    }
  } catch (error) {
    console.error('업데이트 에러:', error);
    Swal.fire(
      '정보 업데이트 중 문제가 발생했습니다!',
      '다시 시도 해주세요.',
      'error'
    );
  }
};
</script>

<template>
  <div class="w-full min-h-screen flex items-center justify-center">
    <div class="w-full h-screen flex items-center justify-center">
      <div
        class="w-full sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 h-full bg-white flex items-center justify-center"
      >
        <div class="w-full px-12">
          <h1
            class="text-center text-3xl font-bold tracking-wide text-gray-800"
          >
            패스워드 변경
          </h1>

          <form class="my-8 text-sm" @submit.prevent="handleUpdate">
            <div class="flex flex-col my-4">
              <label for="nickname" class="text-gray-700">닉네임</label>
              <input
                type="text"
                name="nickname"
                id="nickname"
                class="flex-1 p-2 pr-10 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
                v-model="nickname"
                required
              />
            </div>

            <div class="flex flex-col my-4">
              <label for="email" class="text-gray-700">이메일</label>
              <input
                type="email"
                name="email"
                id="email"
                class="flex-1 p-2 pr-10 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
                v-model="email"
                disabled
              />
            </div>

            <div class="flex flex-col my-4">
              <label for="currentPassword" class="text-gray-700"
                >기존 비밀번호</label
              >
              <div class="relative flex items-center mt-2">
                <input
                  :type="showPrevPassword ? 'text' : 'password'"
                  name="currentPassword"
                  id="currentPassword"
                  class="flex-1 p-2 pr-10 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
                  placeholder="Enter your current password"
                  v-model="currentPassword"
                  required
                />
                <button
                  @click="togglePrevPasswordVisibility"
                  type="button"
                  class="absolute right-2 bg-transparent flex items-center justify-center text-gray-700"
                >
                  <svg
                    :class="{ hidden: showPrevPassword }"
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
                    :class="{ hidden: !showPrevPassword }"
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
              <label for="password" class="text-gray-700"
                >변경할 비밀번호</label
              >
              <div class="relative flex items-center mt-2">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  name="password"
                  id="password"
                  class="flex-1 p-2 pr-10 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
                  placeholder="Enter your new password"
                  v-model="password"
                  required
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
                >변경할 비밀번호를 한번 더 입력해주세요</label
              >
              <div class="relative flex items-center mt-2">
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  name="password_confirmation"
                  id="password_confirmation"
                  class="flex-1 p-2 pr-10 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900"
                  placeholder="Enter your new password again"
                  v-model="passwordConfirmation"
                  required
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

            <div class="my-4 flex items-center justify-end space-x-4">
              <button
                class="bg-blue-600 hover:bg-blue-700 rounded-lg px-8 py-2 text-gray-100 hover:shadow-xl transition duration-150 uppercase w-full"
                type="submit"
              >
                수정
              </button>
            </div>
          </form>
        </div>
      </div>
      <div
        class="hidden lg:flex lg:w-1/2 xl:w-2/3 2xl:w-3/4 h-full bg-cover"
        style="
          background-image: url('https://source.unsplash.com/1600x900/?ocean');
        "
      >
        <div
          class="w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-30"
        >
          <div class="flex items-center justify-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 xl:h-20 xl:w-20 2xl:h-24 2xl:w-24 text-gray-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
              ></path>
            </svg>
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
            href="#"
            class="mt-6 bg-gray-100 hover:bg-gray-200 px-6 py-2 rounded text-sm uppercase text-gray-900 transition duration-150"
            title="Learn More"
            >Learn More</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
