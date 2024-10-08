<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import MyPageSide from '@/components/common/MyPageSide.vue';
import CourseCard from './Course/CourseCard.vue';
import Swal from 'sweetalert2';

const router = useRouter();
const courses = ref([]);

onMounted(async () => {
  try {
    const token = sessionStorage.getItem('accessToken');
    const response = await axios.get('https://apiyeohaengdam.ttalkak.com/api/course', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    courses.value = response.data;
  } catch (error) {
    Swal.fire('계획 정보 불러오기 실패', '다시 로그인 해주세요.', 'error');
    console.error('Error fetching courses:', error);
  }
});
</script>

<template>
  <div
    class="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]"
  >
    <MyPageSide />

    <div class="bg-white rounded-lg p-6 shadow-lg">
      <h2 class="text-2xl font-bold mb-4">내 여행 경로</h2>
      <div v-if="courses.length === 0">여행 경로가 없습니다.</div>
      <div v-else>
        <CourseCard
          v-for="course in courses"
          :key="course.id"
          :course="course"
        />
      </div>
    </div>
  </div>
</template>

<style></style>
