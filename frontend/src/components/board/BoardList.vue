<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useBoardStore } from '@/stores/board';
import { useMemberStore } from '@/stores/member';
import BoardCard from '@/components/board/BoardCard.vue';
import Pagination from '@/components/common/Pagination.vue';
import BoardDetail from '@/components/board/BoardDetail.vue'; // 모달 컴포넌트 가져오기
import Swal from 'sweetalert2';

const boardStore = useBoardStore();
const currentPage = ref(1);
const totalElements = ref(0); // 전체 게시글 수
const pageSize = ref(8); // 페이지당 게시글 수
const totalPages = computed(() =>
  Math.ceil(totalElements.value / pageSize.value)
); // 총 페이지 수 계산
const isModalVisible = ref(false);
const selectedItem = ref(null);
const memberStore = useMemberStore();
const isLogin = computed(() => memberStore.isLogin);
const comments = ref([]);
const boardList = ref([]);
const searchKeyword = ref(''); // 검색어 상태 추가
const isDropdownOpen = ref(false); // 드롭다운 상태 추가
const sortBy = ref('updated_at');

async function fetchBoardList(page, keyword = '', sortBy = 'updated_at') {
  try {
    const response = await axios.get(
      `https://apiyeohaengdam.ttalkak.com/api/articles/list`,
      {
        params: {
          page,
          size: 8, // 페이지당 10개의 콘텐츠를 가져옴
          keyword, // 검색어 포함
          sortBy,
        },
      }
    );
    boardList.value = response.data;
    totalElements.value = response.data[0].totalCount; // 전체 게시글 수 설정
  } catch (error) {
    Swal.fire('게시글 불러오기에 실패했습니다', '다시 시도 해주세요.', 'error');
  }
}

function updatePage(newPage) {
  currentPage.value = newPage;
  fetchBoardList(newPage, searchKeyword.value, sortBy.value); // 페이지 변경 시 검색어와 함께 데이터 다시 로드
}

async function showModal(board) {
  try {
    const articleResponse = await axios.get(
      `https://apiyeohaengdam.ttalkak.com/api/articles/${board.articleId}`
    );
    const commentsResponse = await axios.get(
      `https://apiyeohaengdam.ttalkak.com/api/comment/${board.articleId}`
    );
    selectedItem.value = articleResponse.data;
    comments.value = commentsResponse.data;
    isModalVisible.value = true;
  } catch (error) {
    Swal.fire('게시글 불러오기에 실패했습니다', '다시 시도 해주세요.', 'error');
  }
}

function closeModal() {
  isModalVisible.value = false;
}

function handleSearchInput(event) {
  searchKeyword.value = event.target.value;
  fetchBoardList(currentPage.value, searchKeyword.value, sortBy.value); // 검색어 입력 시 데이터 다시 로드
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function selectSort(order) {
  console.log(order);
  // 정렬 기준을 적용하는 로직을 여기에 추가하세요.
  sortBy.value = order;
  fetchBoardList(currentPage.value, searchKeyword.value, sortBy.value); // 정렬 기준 변경 시 데이터 다시 로드
  isDropdownOpen.value = false;
}

onMounted(() => {
  fetchBoardList(currentPage.value); // 컴포넌트 마운트 시 데이터 로드
});
</script>
<template>
  <div class="relative min-h-screen">
    <div class="bg-cover w-full flex justify-center items-center">
      <div
        class="w-full bg-white bg-opacity-40 backdrop-filter backdrop-blur-lg"
      >
        <div class="w-full flex justify-end px-2 mt-2 gap-x-3">
          <div class="relative inline-block text-left">
            <button
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 shrink-0 bg-gradient-to-r from-[#4299e1] to-[#3182ce] text-white hover:from-[#3182ce] hover:to-[#4299e1] transition-colors duration-300"
              type="button"
              id="sortButton"
              aria-haspopup="true"
              aria-expanded="false"
              @click="toggleDropdown"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4 mr-2"
              >
                <path d="m21 16-4 4-4-4"></path>
                <path d="M17 20V4"></path>
                <path d="m3 8 4-4 4 4"></path>
                <path d="M7 4v16"></path>
              </svg>
              정렬
            </button>
            <div
              v-show="isDropdownOpen"
              class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="sortButton"
              tabindex="-1"
            >
              <div class="py-1" role="none">
                <a
                  href="#"
                  class="text-gray-700 block px-4 py-2 text-sm"
                  role="menuitem"
                  tabindex="-1"
                  @click="selectSort('created_at')"
                >
                  업로드 일
                </a>
                <a
                  href="#"
                  class="text-gray-700 block px-4 py-2 text-sm"
                  role="menuitem"
                  tabindex="-1"
                  @click="selectSort('updated_at')"
                >
                  최신 순
                </a>
                <a
                  href="#"
                  class="text-gray-700 block px-4 py-2 text-sm"
                  role="menuitem"
                  tabindex="-1"
                  @click="selectSort('hit')"
                >
                  조회수 순
                </a>
              </div>
            </div>
          </div>
          <div class="relative w-1/2 max-w-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input
              class="flex h-10 px-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full bg-white shadow-none appearance-none pl-8 pr-4 py-2 rounded-md border border-gray-300 focus:border-[#4299e1] focus:ring-[#4299e1] dark:bg-gray-950 dark:border-gray-700 dark:focus:border-[#4299e1] dark:focus:ring-[#4299e1]"
              placeholder="상품 검색"
              type="search"
              @input="handleSearchInput"
            />
          </div>
        </div>
        <div
          class="w-12/12 mx-auto rounded-2xl bg-white mt-1 p-5 bg-opacity-40 backdrop-filter backdrop-blur-lg"
        >
          <div
            class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 text-center px-3 mx-auto"
          >
            <BoardCard
              v-for="board in boardList"
              :key="board.articleId"
              :board="board"
              @click="showModal(board)"
            />
          </div>
          <div class="flex justify-end">
            <router-link
              v-if="isLogin"
              :to="{ name: 'BoardEditor' }"
              class="flex items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            >
              글 작성하기
            </router-link>
            <div
              v-else
              class="flex items-center py-3 px-5 text-base font-medium text-center text-gray-700 rounded-lg bg-gray-300"
            >
              글을 작성하려면 로그인 해주세요
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
  </div>
</template>

<style scoped>
/* 추가적인 스타일링을 여기에 추가할 수 있습니다 */
</style>
