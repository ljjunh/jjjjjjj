<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';

const router = useRouter();
const route = useRoute();
const title = ref('');
const description = ref('');
const isEditMode = ref(false);

const props = defineProps({
  noticeId: String, // 라우터에서 받은 게시글 ID
});

const postArticle = async () => {
  const token = sessionStorage.getItem('accessToken');
  if (!token) {
    Swal.fire('로그인이 필요합니다!', '다시 로그인 해주세요.', 'error');
    return;
  }

  const articleData = {
    title: title.value,
    content: description.value,
  };

  try {
    await axios.post('https://apiyeohaengdam.ttalkak.com/api/notice', articleData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    Swal.fire({
      title: '공지사항이 등록되었습니다.',
      imageUrl: '/rottie/basicSuccess.gif',
      imageWidth: 150,
      imageHeight: 150,
      imageAlt: 'Custom image',
    });
    router.replace({ name: 'Notice' }); // 게시글 등록 후 이동할 경로
  } catch (error) {
    console.error('공지사항 등록 실패:', error);
    Swal.fire(
      '공지사항 등록에 실패했습니다!',
      '다시 로그인 해주세요.',
      'error'
    );
  }
};

// 게시글을 저장하는 함수
const saveArticle = async () => {
  if (props.noticeId) {
    await updateArticle();
  } else {
    await postArticle();
  }
};

// 게시글 데이터를 불러오는 함수
async function fetchArticleData() {
  try {
    const response = await axios.get(
      `https://apiyeohaengdam.ttalkak.com/api/notice/${props.noticeId}`
    );
    console.log('data : ', response.data);
    title.value = response.data.title;
    description.value = response.data.content;
  } catch (error) {
    Swal.fire('공지사항 불러오기 실패!', '다시 시도 해주세요.', 'error');
  }
}

// 게시글을 업데이트하는 함수
const updateArticle = async () => {
  const articleData = {
    title: title.value,
    content: description.value,
  };
  try {
    await axios.patch(
      `https://apiyeohaengdam.ttalkak.com/api/notice/${props.noticeId}`,
      articleData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    Swal.fire({
      title: '공지사항이 업데이트되었습니다.',
      imageUrl: '/rottie/basicUpdate.gif',
      imageWidth: 150,
      imageHeight: 150,
      imageAlt: 'Custom image',
    });
    router.push({ name: 'Notice' }); // 업데이트 후 이동할 경로
  } catch (error) {
    console.error('공지사항 업데이트 실패:', error);
    Swal.fire(
      '공지사항 업데이트에 실패했습니다!',
      '다시 시도해주세요.',
      'error'
    );
  }
};
onMounted(() => {
  if (route.params.noticeId) {
    isEditMode.value = true;
    fetchArticleData();
  } else {
    isEditMode.value = false;
  }
});
</script>

<template>
  <div class="bg-white shadow p-4 py-8" x-data="{ images: [] }">
    <div
      class="heading text-center font-bold text-2xl m-5 text-gray-800 bg-white"
    >
      공지사항 작성
    </div>
    <div
      class="mt-5 editor mx-auto w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-2xl"
    >
      <input
        v-model="title"
        class="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"
        spellcheck="false"
        placeholder="Title"
        type="text"
      />
      <textarea
        v-model="description"
        class="description bg-gray-100 sec p-3 h-60 border border-gray-300 outline-none"
        spellcheck="false"
        placeholder="Describe everything about this post here"
      ></textarea>

      <!-- Buttons -->
      <div class="buttons flex justify-end mt-5">
        <div
          @click="saveArticle"
          class="btn border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-gray-200 ml-2 bg-indigo-500"
        >
          {{ isEditMode.valueOf ? 'Update' : 'Post' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
