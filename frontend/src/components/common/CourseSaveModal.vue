<script setup>
import { ref, computed, defineEmits, defineProps, watch } from 'vue';
import Swal from 'sweetalert2';

const props = defineProps({
  visible: Boolean,
  planData: Array, // 부모로부터 planData를 받음
});
console.log('visible : ', props.visible);
console.log('props : ', props);
const emit = defineEmits(['close', 'save']);
const title = ref('');
const description = ref('');

const closeModal = () => {
  emit('close');
};
const saveTripPlan = () => {
  console.log('여행 계획 저장하기');
  console.log('props plandata : ', props.planData);
  const schedules = props.planData.map((item, index) => ({
    spot: {
      contentId: item.contentId,
      contentTypeId: item.contentTypeId,
      title: item.title,
      addr1: item.addr1,
      addr2: item.addr2,
      tel: item.tel,
      zipcode: item.zipcode,
      img1: item.img1,
      img2: item.img2,
      sidoCode: item.sidoCode,
      gugunCode: item.gugunCode,
      latitude: item.latitude,
      longitude: item.longitude,
      description: item.description,
    },
    // },
    // scheduleId: 0, // 새로운 일정의 경우 기본값
    // courseId: 0,   // 새로운 코스의 경우 기본값
    // orderIndex: index // 순서를 유지하기 위해 index 사용
  }));
  emit('save', {
    title: title.value,
    description: description.value,
    schedules: schedules,
  });
  closeModal();
};

watch(
  () => props.visible,
  (newVal) => {
    if (!newVal) {
      title.value = '';
      description.value = '';
    }
  }
);
</script>

<template>
  <div class="modal-overlay" v-if="visible">
    <div class="modal-container">
      <h2 class="text-center font-semibold text-3xl">
        나의 여행 계획 저장하기
      </h2>
      <p class="text-center mt-5 mb-5">
        이름과 간단한 설명을 추가해서 여행 계획을 저장해 보세요!!
      </p>
      <div
        class="flex flex-col items-center justify-between mx-auto w-full max-w-xs"
      >
        <div class="w-full h-16 mb-3">
          <input
            class="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
            v-model="title"
            placeholder="여행 계획을 기억할 제목을 입력해주세요"
          />
        </div>
        <div class="w-full h-16">
          <input
            class="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
            v-model="description"
            placeholder="여행 게획을 간단하게 설명해주세요"
          />
        </div>
      </div>
      <div class="flex flex-col space-y-5 mt-5">
        <button
          class="rounded-xl outline-none py-3 bg-blue-700 border-none text-white text-sm shadow-sm"
          @click="saveTripPlan"
        >
          여행 게획 저장하기
        </button>
        <button
          @click="closeModal"
          class="rounded-xl outline-none border-none py-3 mt-4 bg-red-600 text-white text-sm shadow-sm"
        >
          닫기
        </button>
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
  z-index: 999;
}
.modal-container {
  background: white;
  padding: 3rem;
  border-radius: 0.5rem;
  text-align: center;
}
</style>
