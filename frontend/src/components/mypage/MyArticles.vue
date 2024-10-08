<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import MyPageSide from '@/components/common/MyPageSide.vue';
import BoardDetail from '@/components/board/BoardDetail.vue'; // 모달 컴포넌트 가져오기
import Pagination from '@/components/common/Pagination.vue';
import Swal from 'sweetalert2';

// 데이터 변수 설정
const articles = ref([]);
const selectedItem = ref(null);
const token = sessionStorage.getItem('accessToken'); // 토큰을 세션 스토리지에서 가져옵니다.
const comments = ref([]);
const isModalVisible = ref(false);
const currentPage = ref(1);
const totalElements = ref(1); // 전체 게시글 수
const pageSize = ref(10); // 페이지당 게시글 수
const totalPages = computed(() =>
  Math.ceil(totalElements.value / pageSize.value)
); // 총 페이지 수 계산

// 데이터 가져오기 함수
async function fetchArticles(page) {
  try {
    const response = await axios.get('https://apiyeohaengdam.ttalkak.com/api/articles', {
      headers: {
        Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰을 추가합니다.
      },
      params: {
        page,
        size: 10, // 페이지당 10개의 콘텐츠를 가져옴
      },
    });
    console.log(response);
    articles.value = response.data;
    totalElements.value = response.data[0].totalCount;
  } catch (error) {
    Swal.fire('게시글 불러오기 실패', '다시 로그인 해주세요.', 'error');
    console.error('Error fetching articles:', error);
  }
}

// 컴포넌트가 마운트될 때 데이터 가져오기
function updatePage(newPage) {
  currentPage.value = newPage;
  fetchArticles(newPage); // 페이지 변경 시 데이터 다시 로드
}
onMounted(() => {
  fetchArticles();
});

async function showModal(board) {
  try {
    // 상세 보기
    const articleResponse = await axios.get(
      `https://apiyeohaengdam.ttalkak.com/api/articles/${board.articleId}`
    );
    // 댓글 가져오기
    const commentsResponse = await axios.get(
      `https://apiyeohaengdam.ttalkak.com/api/comment/${board.articleId}`
    );
    selectedItem.value = articleResponse.data;
    comments.value = commentsResponse.data;
    console.log('게시글 상세 받은데이터 : ', articleResponse.data);
    console.log('게시글 상세 : ', selectedItem.value);
    console.log('댓글 : ', comments.value);
    isModalVisible.value = true;
  } catch (error) {
    console.error('Failed to fetch article details or comments:', error);
    Swal.fire('게시글 불러오기 실패', '다시 로그인 해주세요.', 'error');
  }
}

function closeModal() {
  isModalVisible.value = false;
}
</script>

<template>
  <div
    class="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]"
  >
    <MyPageSide />

    <div class="bg-white rounded-lg p-6 shadow-lg">
      <h2 class="text-2xl font-bold mb-4">내 글 목록</h2>

      <!-- 데이터 렌더링 -->
      <div class="grid grid-cols-1 gap-6">
        <div
          v-for="article in articles"
          :key="article.articleId"
          @click="showModal(article)"
          class="bg-[#F0F8FF] rounded-lg p-4 shadow-lg flex justify-between items-center"
        >
          <div>
            <h3 class="text-lg font-bold mb-2">{{ article.title }}</h3>
            <p class="text-gray-500 mb-4">{{ article.createdAt }}</p>
            <div class="text-gray-500 mb-4">
              <p>{{ article.content }}</p>
            </div>
            <a
              class="bg-[#00B8D4] hover:bg-[#0097A7] text-white font-bold py-2 px-4 rounded-lg transition-colors"
              @click="() => router.push(`/articles/${article.articleId}`)"
            >
              자세히 보기
            </a>
          </div>
          <div class="text-right">
            <p class="text-gray-500">조회수: {{ article.hit }}</p>
          </div>
        </div>
        <div class="flex justify-center">
          <Pagination
            :value="currentPage"
            :total-page-count="totalPages"
            :page-display-count="5"
            @change="updatePage"
          />
        </div>
      </div>
    </div>
  </div>
  <BoardDetail
    :item="selectedItem"
    :comments="comments"
    :visible="isModalVisible"
    @close="closeModal"
  />
</template>

<style scoped>
/* Add specific styles if needed */
</style>
