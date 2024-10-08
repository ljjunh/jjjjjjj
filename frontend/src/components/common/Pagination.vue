<template>
  <div class="pagination">
    <button
      :disabled="previousButtonDisabled"
      @click="previous"
      class="btn prev"
    >
      이전
    </button>
    <ul class="page-list">
      <li
        v-for="page in pageList"
        :key="page"
        :class="{ active: page === value }"
        @click="change(page)"
      >
        {{ page }}
      </li>
    </ul>
    <button
      :disabled="nextButtonDisabled"
      @click="next"
      class="btn next"
    >
      다음
    </button>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  props: {
    value: {
      type: Number,
      default: 1,
    },
    totalPageCount: {
      type: Number,
      default: 5,
    },
    pageDisplayCount: {
      type: Number,
      default: 5,
    },
  },
  setup(props, { emit }) {
    const buttonDisplay = computed(() => props.totalPageCount > 5);
    const currentPageGroup = computed(() => Math.ceil(props.value / props.pageDisplayCount));
    const lastPageNumber = computed(() => {
      const lastNumber = currentPageGroup.value * props.pageDisplayCount;
      return lastNumber > props.totalPageCount ? props.totalPageCount : lastNumber;
    });
    const firstPageNumber = computed(() => {
      if (lastPageNumber.value === props.totalPageCount) {
        const multipleOfPageDisplayCount = lastPageNumber.value % props.pageDisplayCount === 0;
        return multipleOfPageDisplayCount
          ? lastPageNumber.value - props.pageDisplayCount + 1
          : lastPageNumber.value - (lastPageNumber.value % props.pageDisplayCount) + 1;
      }
      return lastPageNumber.value - (props.pageDisplayCount - 1);
    });
    const pageList = computed(() => {
      const list = [];
      for (let i = firstPageNumber.value; i <= lastPageNumber.value; i++) {
        list.push(i);
      }
      return list;
    });
    const nextButtonDisabled = computed(() => lastPageNumber.value >= props.totalPageCount);
    const previousButtonDisabled = computed(() => firstPageNumber.value <= 1);
    const change = (clickNumber) => {
      if (clickNumber === props.value) return false;
      emit('change', clickNumber);
    };
    const previous = () => {
      emit('change', firstPageNumber.value - props.pageDisplayCount);
    };
    const next = () => {
      emit('change', lastPageNumber.value + 1);
    };
    return {
      next,
      previous,
      change,
      pageList,
      buttonDisplay,
      nextButtonDisabled,
      previousButtonDisabled,
      firstPageNumber,
      lastPageNumber,
      currentPageGroup,
    };
  },
};
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
}
.page-list {
  display: flex;
  list-style: none;
  padding: 0;
}
.page-list li {
  margin: 0 5px;
  cursor: pointer;
}
.page-list li.active {
  font-weight: bold;
}
.btn {
  cursor: pointer;
  padding: 5px 10px;
}
.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
