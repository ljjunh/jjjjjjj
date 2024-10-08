<script setup>
import { ref, computed, defineEmits, defineProps } from 'vue';
import Swal from 'sweetalert2';

const props = defineProps({
  visible: Boolean,
  email: String,
});

const emit = defineEmits(['close', 'verified']);

const code1 = ref('');
const code2 = ref('');
const code3 = ref('');
const code4 = ref('');

const obfuscatedEmail = computed(() => {
  const [user, domain] = props.email.split('@');
  return `${user.slice(0, 2)}***@${domain}`;
});

const verifyCode = () => {
  const code = `${code1.value}${code2.value}${code3.value}${code4.value}`;
  emit('verified', code);
};

const resendCode = () => {
  Swal.fire({
    title: '인증 번호를 다시 전송했습니다.',
    imageUrl: '/rottie/basicSuccess.gif',
    imageWidth: 150,
    imageHeight: 150,
    imageAlt: 'Custom image',
  });
};
</script>

<template>
  <div class="modal-overlay" v-if="visible" @click="close">
    <div class="modal-container">
      <h2 class="text-center font-semibold text-3xl">
        이메일을 확인해주세요!!
      </h2>
      <p class="text-center mt-5 mb-5">
        여행담이 해당 메일 주소로 {{ obfuscatedEmail }} 코드를 보냈어요
      </p>
      <div
        class="code-inputs flex flex-row items-center justify-between mx-auto w-full max-w-xs"
      >
        <div class="w-16 h-16">
          <input
            class="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
            v-model="code1"
            maxlength="1"
          />
        </div>
        <div class="w-16 h-16">
          <input
            class="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
            v-model="code2"
            maxlength="1"
          />
        </div>
        <div class="w-16 h-16">
          <input
            class="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
            v-model="code3"
            maxlength="1"
          />
        </div>
        <div class="w-16 h-16">
          <input
            class="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
            v-model="code4"
            maxlength="1"
          />
        </div>
      </div>
      <div class="flex flex-col space-y-5 mt-5">
        <button
          class="rounded-xl outline-none py-3 bg-blue-700 border-none text-white text-sm shadow-sm"
          @click="verifyCode"
        >
          인증하기
        </button>
        <p class="text-center flex flex-col justify-center">
          코드를 받지 못하셨나요?
          <a class="text-lg items-center text-blue-600" @click="resendCode"
            >다시 보내기</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-container {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
}
</style>
