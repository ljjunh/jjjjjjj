<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';

const router = useRouter();
const route = useRoute();
const title = ref('');
const description = ref('');
const images = ref([]);
const handleFileChange = (event) => {
  images.value = Array.from(event.target.files).map((file) => ({
    url: URL.createObjectURL(file),
    file, // 원본 파일 객체를 저장
    name: file.name,
    preview: ['jpg', 'jpeg', 'png', 'gif'].includes(
      file.name.split('.').pop().toLowerCase()
    ),
    size:
      file.size > 1024
        ? file.size > 1048576
          ? Math.round(file.size / 1048576) + 'mb'
          : Math.round(file.size / 1024) + 'kb'
        : file.size + 'b',
  }));
};
const isEditMode = ref(false);

const props = defineProps({
  articleId: String, // 라우터에서 받은 게시글 ID
});

const removeImage = (index) => {
  images.value.splice(index, 1);
};

const postArticle = async () => {
  const token = sessionStorage.getItem('accessToken');
  if (!token) {
    Swal.fire('로그인이 필요합니다!', '다시 로그인 해주세요.', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('content', description.value);
  images.value.forEach((image) => {
    formData.append('images', image.file);
    console.log('images : ', image.file);
    console.log('images : ' + image.file);
  });

  try {
    await axios.post('https://apiyeohaengdam.ttalkak.com/api/articles', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    Swal.fire({
      title: '게시글이 등록되었습니다.',
      imageUrl: '/rottie/basicUpdate.gif',
      imageWidth: 150,
      imageHeight: 150,
      imageAlt: 'Custom image',
    });
    router.replace({ name: 'List' }); // 게시글 등록 후 이동할 경로
  } catch (error) {
    console.error('게시글 등록 실패:', error);
    Swal.fire('게시글 등록에 실패했습니다!', '다시 시도해주세요', 'error');
  }
};

// 게시글을 저장하는 함수
const saveArticle = async () => {
  if (props.articleId) {
    await updateArticle();
  } else {
    await postArticle();
  }
};

// 게시글 데이터를 불러오는 함수
async function fetchArticleData() {
  try {
    const response = await axios.get(
      `https://apiyeohaengdam.ttalkak.com/api/articles/${props.articleId}`
    );
    title.value = response.data.title;
    description.value = response.data.content;
    // 이미지 데이터 처리 방식에 따라 추가 구현 필요
  } catch (error) {
    Swal.fire('게시글 불러오기에 실패했습니다!', '다시 시도해주세요', 'error');
  }
}

// 게시글을 업데이트하는 함수
const updateArticle = async () => {
  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('content', description.value);
  // 이미지와 관련된 추가 로직 필요
  try {
    await axios.patch(
      `https://apiyeohaengdam.ttalkak.com/api/articles/${props.articleId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
      }
    );
    Swal.fire({
      title: '게시글이 업데이트되었습니다.',
      imageUrl: '/rottie/basicUpdate.gif',
      imageWidth: 150,
      imageHeight: 150,
      imageAlt: 'Custom image',
    });
    router.push('/'); // 업데이트 후 이동할 경로
  } catch (error) {
    console.error('게시글 업데이트 실패:', error);
    Swal.fire('게시글 업데이트에 실패했습니다!', '다시 시도해주세요', 'error');
  }
};
onMounted(() => {
  if (route.params.articleId) {
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
      New Post
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

      <!-- icons -->
      <div class="icons flex text-gray-500 mt-5">
        <label id="select-image">
          <svg
            class="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
          <input
            hidden
            type="file"
            multiple
            @change="handleFileChange"
            x-ref="fileInput"
          />
        </label>
        <div class="count ml-auto text-gray-400 text-xs font-semibold">
          0/300
        </div>
      </div>

      <!-- Preview image here -->
      <div id="preview" class="my-4 flex">
        <template v-for="(image, index) in images" :key="index">
          <div class="relative w-32 h-32 object-cover rounded">
            <div
              v-if="image.preview"
              class="relative w-32 h-32 object-cover rounded"
            >
              <img :src="image.url" class="w-32 h-32 object-cover rounded" />
              <button
                @click="removeImage(index)"
                class="w-6 h-6 absolute text-center flex items-center top-0 right-0 m-2 text-white text-lg bg-red-500 hover:text-red-700 hover:bg-gray-100 rounded-full p-1"
              >
                <span class="mx-auto">×</span>
              </button>
              <div x-text="image.size" class="text-xs text-center p-2"></div>
            </div>
            <!-- 이미지 미리보기가 없을 경우 -->
            <div v-else class="relative w-32 h-32 object-cover rounded">
              <!-- <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 fill-white stroke-indigo-500" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg> -->
              <svg
                class="fill-current w-32 h-32 ml-auto pt-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
              </svg>
              <button
                @click="removeImage(index)"
                class="w-6 h-6 absolute text-center flex items-center top-0 right-0 m-2 text-white text-lg bg-red-500 hover:text-red-700 hover:bg-gray-100 rounded-full p-1"
              >
                <span class="mx-auto">×</span>
              </button>
              <div x-text="image.size" class="text-xs text-center p-2"></div>
            </div>
          </div>
        </template>
      </div>
      <!-- Buttons -->
      <div class="buttons flex justify-end">
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
