<script setup>
import { ref, defineEmits, watch } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";

const contents = ref([
  { id: 12, name: "관광지" },
  { id: 14, name: "문화시설" },
  { id: 15, name: "축제공연행사" },
  { id: 25, name: "여행코스" },
  { id: 28, name: "레포츠" },
  { id: 32, name: "숙박" },
  { id: 38, name: "쇼핑" },
  { id: 39, name: "음식점" },
]);

const selectedContent = ref(contents.value[0]);
const emits = defineEmits(["update:selected"]);

watch(
  selectedContent,
  (newContent) => {
    emits("update:selected", newContent);
  },
  { immediate: true }
);
</script>

<template>
  <div class="z-10 w-full">
    <Listbox v-model="selectedContent">
      <div class="relative">
        <ListboxButton
          class="hover:bg-blue-200 hover:text-blue-800 relative w-full cursor-default bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-gray rounded-md"
        >
          <span class="block truncate">{{ selectedContent.name }}</span>
          <span
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <ChevronUpDownIcon
              class="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="content in contents"
              :key="content.id"
              :value="content"
              as="template"
            >
              <li
                :class="{
                  'bg-blue-200 text-blue-800': active,
                  'text-gray-900': !active,
                  'relative cursor-default select-none py-2 pl-10 pr-4': true,
                }"
              >
                <span
                  :class="{
                    'font-medium': selected,
                    'font-normal': !selected,
                    'block truncate': true,
                  }"
                >
                  {{ content.name }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<style scoped></style>
