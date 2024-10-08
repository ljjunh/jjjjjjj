<script setup>
import { defineProps, ref, watch, defineEmits } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";

const props = defineProps({
  guguns: {
    type: Array,
    default: () => [],
  },
});

const emits = defineEmits(["update:selected"]);
const selectedGugun = ref(null);

watch(
  selectedGugun,
  (newGugun) => {
    if (newGugun) {
      emits("update:selected", newGugun);
    }
  },
  { immediate: true }
);

// props.guguns 값이 변경될 때 selectedGugun를 첫 번째 항목으로 설정
watch(
  () => props.guguns,
  (newGuguns) => {
    if (newGuguns.length > 0) {
      selectedGugun.value = newGuguns[0];
    } else {
      selectedGugun.value = null;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="z-10 w-full">
    <Listbox v-model="selectedGugun">
      <div class="relative">
        <ListboxButton
          class="hover:bg-blue-200 hover:text-blue-800 relative w-full cursor-default bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-gray rounded-md"
        >
          <span class="block truncate">
            {{ selectedGugun ? selectedGugun.name : "시도를 먼저 골라주세요" }}
          </span>
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
              v-for="gugun in props.guguns"
              :key="gugun.id"
              :value="gugun"
              as="template"
            >
              <li
                :class="[
                  active ? 'bg-blue-200 text-blue-800' : 'text-gray-900',
                  'relative cursor-default select-none py-2 pl-10 pr-4',
                ]"
              >
                <span
                  :class="[
                    selected ? 'font-medium' : 'font-normal',
                    'block truncate',
                  ]"
                  >{{ gugun.name }}</span
                >
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
