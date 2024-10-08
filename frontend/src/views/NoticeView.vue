<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import TableRow from "@/components/notice/TableRow.vue";
import NoticeDetail from "@/components/notice/NoticeDetail.vue";
import { useMemberStore } from "@/stores/member";
import Pagination from "@/components/common/Pagination.vue";
import Swal from "sweetalert2";

const memberStore = useMemberStore();
const rows = ref([]);
const selectedItem = ref(null);
const isModalVisible = ref(false);
const currentPage = ref(1);
const totalElements = ref(0);
const pageSize = ref(10);
const searchKeyword = ref(""); // 검색어 상태 추가
const totalPages = computed(() =>
  Math.ceil(totalElements.value / pageSize.value)
);

const handleRowClick = (item) => {
  selectedItem.value = item;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

async function fetchNotices(page) {
  try {
    const response = await axios.get("https://apiyeohaengdam.ttalkak.com/api/notice/list", {
      params: {
        page,
        size: 10,
        keyword: searchKeyword.value, // 검색어 포함
      },
    });
    console.log(response);
    rows.value = response.data;
    totalElements.value = response.data[0].totalCount;
  } catch (error) {
    Swal.fire("공지사항 불러오기 실패!", "다시 로그인 해주세요", "error");
  }
}

function updatePage(newPage) {
  currentPage.value = newPage;
  fetchNotices(newPage); // 페이지 변경 시 데이터 다시 로드
}

function handleSearchInput(event) {
  searchKeyword.value = event.target.value;
  fetchNotices(currentPage.value); // 검색어 입력 시 데이터 다시 로드
}

onMounted(() => {
  fetchNotices(currentPage.value); // 컴포넌트 마운트 시 데이터 로드
});
</script>

<template>
  <div class="bg-white pb-4 px-4 rounded-md w-full">
    <div class="flex justify-between w-full pt-6">
      <p class="ml-3 text-2xl">공지 사항</p>
      <svg
        width="14"
        height="4"
        viewBox="0 0 14 4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.4">
          <circle cx="2.19796" cy="1.80139" r="1.38611" fill="#222222" />
          <circle cx="11.9013" cy="1.80115" r="1.38611" fill="#222222" />
          <circle cx="7.04991" cy="1.80115" r="1.38611" fill="#222222" />
        </g>
      </svg>
    </div>
    <div class="w-full flex justify-end px-2 mt-2 gap-x-3">
      <router-link
        :to="{ name: 'NoticeEditor' }"
        v-if="memberStore.isAdmin"
        class="flex items-center justify-center px-5 text-white rounded-lg bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
      >
        공지사항 작성
      </router-link>
      <div class="w-full sm:w-64 inline-block relative">
        <input
          type="text"
          name="search"
          class="leading-snug border border-gray-300 block w-full appearance-none bg-gray-100 text-sm text-gray-600 py-1 px-4 pl-8 rounded-lg"
          placeholder="제목을 입력하세요"
          @input="handleSearchInput"
        />
        <div
          class="pointer-events-none absolute pl-3 inset-y-0 left-0 flex items-center px-2 text-gray-300"
        >
          <svg
            class="fill-current h-3 w-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 511.999 511.999"
          >
            <path
              d="M508.874 478.708L360.142 329.976c28.21-34.827 45.191-79.103 45.191-127.309C405.333 90.917 314.416 0 202.666 0S0 90.917 0 202.667s90.917 202.667 202.667 202.667c48.206 0 92.482-16.982 127.309-45.191l148.732 148.732c4.167 4.165 10.919 4.165 15.086 0l15.081-15.082c4.165-4.166 4.165-10.92-.001-15.085zM202.667 362.667c-88.229 0-160-71.771-160-160s71.771-160 160-160 160 71.771 160 160-71.771 160-160 160z"
            />
          </svg>
        </div>
      </div>
    </div>
    <div class="overflow-x-auto mt-6">
      <table class="table-auto border-collapse w-full">
        <thead>
          <tr
            class="rounded-lg text-sm font-medium text-gray-700 text-left"
            style="font-size: 0.9674rem"
          >
            <th
              class="px-4 py-2 bg-gray-200 first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg"
            >
              제 목
            </th>
            <th class="px-4 py-2 bg-gray-200">작성자</th>
            <th class="px-4 py-2 bg-gray-200">날짜</th>
          </tr>
        </thead>
        <tbody class="text-sm font-normal text-gray-700">
          <TableRow
            v-for="(row, index) in rows"
            :key="index"
            :item="row"
            @row-click="handleRowClick"
          />
        </tbody>
      </table>
    </div>
    <div class="flex justify-center mt-5">
      <Pagination
        :value="currentPage"
        :total-page-count="totalPages"
        :page-display-count="5"
        @change="updatePage"
      />
    </div>
  </div>

  <NoticeDetail
    :item="selectedItem"
    :visible="isModalVisible"
    @close="closeModal"
  />
</template>

<style scoped></style>
