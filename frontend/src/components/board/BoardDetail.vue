<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue';
import BoardComment from '@/components/board/BoardComment.vue';
import { useMemberStore } from '@/stores/member';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const router = useRouter();
const memberStore = useMemberStore();
const isLogin = computed(() => memberStore.isLogin);
const userInfo = computed(() => memberStore.userInfo);

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  comments: {
    type: Array,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close']);
const newComment = ref('');
const localComments = ref([]);

const closeModal = () => {
  emit('close');
};

const placeholderText = computed(() => {
  return memberStore.isLogin ? '댓글을 작성해주세요' : '로그인을 해주세요';
});

const fetchComments = async () => {
  try {
    const response = await axios.get(
      `https://apiyeohaengdam.ttalkak.com/api/comment/${props.item.articleId}`
    );
    localComments.value = response.data; // localComments를 사용
  } catch (error) {
    Swal.fire('댓글 목록 불러오기 실패!', '다시 시도해주세요', 'error');
  }
};

const postComment = async () => {
  if (!memberStore.isLogin) {
    Swal.fire('로그인이 필요합니다!', '다시 시도해주세요', 'error');
    return;
  }

  const token = sessionStorage.getItem('accessToken');

  if (!token) {
    Swal.fire('토큰이 필요합니다!', '다시 로그인해주세요.', 'error');
    return;
  }

  try {
    await axios.post(
      'https://apiyeohaengdam.ttalkak.com/api/comment',
      {
        articleId: props.item.articleId,
        content: newComment.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 성공적으로 댓글이 등록되었을 때
    newComment.value = ''; // 댓글 입력란 초기화
    Swal.fire({
      title: '댓글이 등록되었습니다.',
      imageUrl: '/rottie/replySuccess.gif',
      imageWidth: 150,
      imageHeight: 150,
      imageAlt: 'Custom image',
    });
    fetchComments(); // 댓글 목록 다시 불러오기
  } catch (error) {
    console.error('댓글 등록 실패:', error);
    Swal.fire('댓글 등록에 실패했습니다!', '다시 시도해주세요', 'error');
  }
};

const editArticle = (articleId) => {
  if (userInfo.value.nickname === props.item.nickname) {
    router.push({ name: 'BoardEdit', params: { articleId } });
  } else {
    Swal.fire(
      '인증되지 않은 사용자입니다!',
      '본인이 작성한 글만 수정할 수 있습니다.',
      'error'
    );
  }
};

const deleteArticle = async () => {
  if (userInfo.value.nickname === props.item.nickname) {
    Swal.fire({
      title: '정말 삭제하시겠습니까?',
      text: '삭제하면 되돌릴 수 없습니다!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `https://apiyeohaengdam.ttalkak.com/api/articles/${props.item.articleId}`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem(
                  'accessToken'
                )}`,
              },
            }
          )
          .then(() => {
            Swal.fire('삭제 성공!', 'Your file has been deleted.', 'success');
            closeModal();
            router
              .replace({ name: 'List' })
              .then(() => window.location.reload());
          })
          .catch((error) => {
            console.error('Deletion failed:', error);
            Swal.fire('실패!', 'Could not delete the article.', 'error');
          });
      }
    });
  } else {
    Swal.fire(
      'Unauthorized!',
      'You are not the owner of this article.',
      'error'
    );
  }
};

// 모달이 열릴 때 댓글 목록을 불러오기
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      fetchComments();
    }
  }
);

function formatImgSrc(imgSrc) {
  if (!imgSrc || imgSrc.length === 0) {
    return 'https://source.unsplash.com/800x450/?nature'; // 기본 이미지 URL
  }
  // 객체의 storedName 속성을 사용하여 전체 URL 구성
  return imgSrc[0].storedName;
}
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
    @click="closeModal"
  >
    <div
      class="flex rounded-lg bg-white min-h-[70%] max-h-[95%] min-w-[65%] max-w-[90%]"
      @click.stop
    >
      <div
        class="relative text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl flex-3"
        role="dialog"
      >
        <div
          class="flex shrink-0 items-center justify-between p-4 text-2xl font-semibold leading-snug text-blue-gray-900 antialiased"
        >
          <div class="flex items-center gap-3">
            <img
              :alt="item.title"
              :src="
                item.profileImage ||
                'https://source.unsplash.com/800x450/?Beautifulgirl'
              "
              class="relative inline-block h-9 w-9 rounded-full object-cover object-center"
            />
            <div class="-mt-px flex flex-col">
              <p
                class="block text-xl font-medium leading-normal text-blue-gray-900 antialiased"
              >
                {{ item.title }}
              </p>
              <p class="block text-xs font-normal text-gray-700 antialiased">
                @{{ item.nickname }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-blue-gray-500 transition-all hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              @click="closeModal"
            >
              <span
                class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transform"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  class="h-5 w-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6.225 4.811a.75.75 0 011.06 0L12 9.525l4.715-4.714a.75.75 0 011.06 1.06L13.06 10.5l4.715 4.714a.75.75 0 01-1.06 1.06L12 11.525l-4.714 4.714a.75.75 0 01-1.06-1.06L10.94 10.5 6.225 5.775a.75.75 0 010-1.06z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
        <div
          class="relative border-t border-b border-t-blue-gray-100 border-b-blue-gray-100 text-base font-light leading-relaxed text-blue-gray-500 antialiased max-h-[75vh] overflow-y-auto"
        >
          <div
            :alt="item.title"
            :style="{
              backgroundImage: `url(${formatImgSrc(item.imageUrls)})`,
            }"
            class="w-auto min-h-[50vh] max-h-[50vh] object-cover bg-contain bg-no-repeat bg-center"
          />
        </div>

        <div class="p-4 text-blue-gray-500 overflow-auto max-h-[20vh]">
          <p>{{ item.content }}</p>
        </div>
        <div
          class="flex shrink-0 flex-wrap items-center justify-between p-4 text-blue-gray-500"
        >
          <div class="flex items-center gap-16">
            <div>
              <p
                class="block text-sm font-normal leading-normal text-gray-700 antialiased"
              >
                Views
              </p>
              <p
                class="block text-base font-medium leading-relaxed text-blue-gray-900 antialiased"
              >
                {{ item.hit }}
              </p>
            </div>
            <div>
              <p
                class="block text-sm font-normal leading-normal text-gray-700 antialiased"
              >
                Downloads
              </p>
              <p
                class="block text-base font-medium leading-relaxed text-blue-gray-900 antialiased"
              >
                553,031
              </p>
            </div>
          </div>
          <div class="flex gap-3">
            <button
              class="flex select-none items-center gap-3 rounded-lg border border-blue-gray-500 py-2 px-4 text-center align-middle text-xs font-bold uppercase text-blue-gray-500 transition-all hover:opacity-75 focus:ring focus:ring-blue-gray-200 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              @click="editArticle(item.articleId)"
            >
              수정하기
            </button>
            <button
              class="flex select-none items-center gap-3 rounded-lg border border-blue-gray-500 py-2 px-4 text-center align-middle text-xs font-bold uppercase text-blue-gray-500 transition-all hover:opacity-75 focus:ring focus:ring-blue-gray-200 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              @click="deleteArticle"
            >
              삭제하기
            </button>
          </div>
        </div>
      </div>
      <!-- 현재 접속한 사용자 부분 -->
      <div class="col-span-1 rounded-lg relative px-4 bg-white w-full flex-1">
        <header class="border-b border-grey-400">
          <a
            href="#"
            class="py-4 flex items-center text-sm outline-none focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out"
          >
            <!--TODO 프로필 이미지로 변경 필요-->
            <img
              v-if="memberStore.isLogin"
              :src="
                userInfo.profileImage ||
                'https://source.unsplash.com/800x450/?Beautifulgirl'
              "
              class="h-9 w-9 rounded-full object-cover"
              alt="user"
            />
            <p v-if="memberStore.isLogin" class="block mx-2 font-bold">
              {{ userInfo.nickname }}
            </p>
            <p v-else class="block mx-2 font-bold">로그인 해주세요</p>
          </a>
        </header>
        <!-- 댓글 -->
        <div class="mt-5">
          <div v-for="comment in localComments" :key="comment.commentId">
            <BoardComment :comment="comment" />
          </div>
        </div>
        <!-- 글 작성 부분 -->
        <div class="absolute bottom-0 left-0 right-0 pl-4">
          <div class="pt-4 pb-1 pr-3">
            <div class="flex items-start">
              <textarea
                class="w-full resize-none outline-none appearance-non"
                aria-label="댓글을 작성해주세요"
                :placeholder="placeholderText"
                v-model="newComment"
                autocomplete="off"
                autocorrect="off"
                style="height: 36px"
                :disabled="!memberStore.isLogin"
              ></textarea>
              <button
                class="mb-4 focus:outline-none border-none text-xl bg-transparent text-blue-600"
                @click="postComment"
              >
                >
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
