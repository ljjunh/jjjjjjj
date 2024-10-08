<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import EmailVerification from '@/components/common/EmailVerification.vue';
import CustomLoading from '@/components/common/CustomLoading.vue';
import Swal from 'sweetalert2';

/** 회원 가입 */
const email = ref('');
const isEmailConfirmed = ref(false);
const emailVerificationVisible = ref(false);
const isLoading = ref(false);
const router = useRouter();
const showModal = ref(false);
const resetPassword = ref('');

/** 이메일 체크 */
const emailCheck = async (emailInput) => {
  if (!email.value) {
    Swal.fire('이메일은 필수 항목입니다', '이메일을 입력해주세요.', 'error');
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
      Swal.fire(
        '이메일은 필수 항목입니다',
        '이메일 인증이 완료되지 않았습니다.',
        'error'
      );
    }
  } catch (error) {
    console.error('이메일 인증 오류:', error);
    Swal.fire(
      '이메일은 필수 항목입니다',
      '이메일 인증 중 오류가 발생했습니다',
      'error'
    );
  } finally {
    isLoading.value = false; // 로딩 상태 종료
  }
};

const resetPasswordFunction = async (email) => {
  try {
    const response = await axios.post(
      `https://apiyeohaengdam.ttalkak.com/api/users/reset/password`,
      {
        email: email.value,
      }
    );
    if (response.status === 200) {
      resetPassword.value = response.data;
      showModal.value = true;
    } else {
      Swal.fire('비밀번호 초기화 실패', '다시 시도해 주세요', 'error');
    }
  } catch (error) {
    console.error('비밀번호 초기화 오류:', error);
    Swal.fire(
      '입력하신 이메일 주소로 등록된 사용자가 없습니다',
      '이메일 주소를 다시 확인해주세요',
      'error'
    );
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
    if (response.status === 200) {
      emailVerificationVisible.value = false;
      isEmailConfirmed.value = true;
      Swal.fire({
        title: '이메일 인증이 완료되었습니다.',
        imageUrl: '/rottie/basicSuccess.gif',
        imageWidth: 150,
        imageHeight: 150,
        imageAlt: 'Custom image',
      });
      await resetPasswordFunction(email); // 비밀번호 초기화 요청 보내기
    } else {
      Swal.fire('잘못된 인증 코드입니다!', '다시 시도 해주세요.', 'error');
    }
  } catch (error) {
    console.error('이메일 인증 코드 확인 오류:', error);
    Swal.fire(
      '잘못된 인증 코드입니다!',
      '이메일 인증 코드 확인 중 오류가 발생했습니다.',
      'error'
    );
  }
};

const copyToClipboard = () => {
  navigator.clipboard
    .writeText(resetPassword.value)
    .then(() => {
      Swal.fire({
        title: '비밀번호가 복사되었습니다',
        imageUrl: '/rottie/basicSuccess.gif',
        imageWidth: 150,
        imageHeight: 150,
        imageAlt: 'Custom image',
      });
    })
    .catch((error) => {
      Swal.fire('비밀번호 복사 실패', '다시 시도해주세요', 'error');
      console.error('Error copying text: ', error);
    });
};
</script>

<template>
  <main
    class="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950"
  >
    <div
      class="mx-auto w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900"
    >
      <div class="space-y-2">
        <h1 class="text-2xl font-bold">비밀번호를 찾아드릴께요</h1>
        <p class="text-gray-500 dark:text-gray-400">
          당신의 이메일을 입력하고 비밀번호를 재설정하세요
        </p>
      </div>
      <form class="my-8 text-sm" @submit.prevent>
        <div>
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
      </form>
      <div class="text-center text-sm text-gray-500 dark:text-gray-400">
        <a
          class="font-medium underline hover:text-gray-900 dark:hover:text-gray-50"
          @click="router.push('/login')"
        >
          로그인 화면으로 돌아가기
        </a>
      </div>
    </div>
  </main>
  <EmailVerification
    :visible="emailVerificationVisible"
    :email="email"
    @verified="verifyEmailCode"
    @close="emailVerificationVisible = false"
  />
  <CustomLoading v-if="isLoading" />

  <!-- 모달 오버레이 -->
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <!-- 모달 컨텐츠 -->
    <div class="bg-white p-5 rounded shadow-lg w-1/3">
      <h2 class="text-xl mb-4">초기화된 비밀번호 입니다!</h2>
      <p>{{ resetPassword }}</p>
      <div class="mt-4 flex justify-end">
        <button
          @click="copyToClipboard"
          class="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          비밀번호 복사하기
        </button>
        <button
          @click="handleModalClose"
          class="bg-red-500 text-white px-4 py-2 rounded"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
