<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  course: Object,
});
const router = useRouter();

const navigateToDetail = () => {
  router.push({
    name: 'CourseDetail',
    params: { courseId: props.course.courseId },
    query: {
      title: props.course.title,
      description: props.course.description,
    },
  });
};
</script>

<template>
  <div class="grid grid-cols-1 gap-10">
    <div class="bg-[#F0F8FF] rounded-lg p-4 shadow-lg mb-5">
      <h3 class="text-lg font-bold mb-2">{{ course.title }}</h3>
      <div class="text-gray-500 mb-4">
        <p>
          {{ course.description }}
        </p>
      </div>
      <button
        class="bg-[#00B8D4] hover:bg-[#0097A7] text-white font-bold py-2 px-4 rounded-lg transition-colors"
        @click="navigateToDetail"
      >
        자세히 보기
      </button>
    </div>
  </div>
</template>

<style scoped></style>
