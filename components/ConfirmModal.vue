<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('update:modelValue', false)"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
        <!-- Icon -->
        <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
          <span class="text-2xl">⚠️</span>
        </div>

        <!-- Content -->
        <div class="mt-3 text-center sm:mt-5">
          <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ message }}
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="button"
            class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:col-start-2"
            @click="$emit('confirm')"
            :disabled="loading"
          >
            {{ loading ? 'Suppression en cours...' : confirmText }}
          </button>
          <button
            type="button"
            class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:col-start-1 sm:mt-0"
            @click="$emit('update:modelValue', false)"
            :disabled="loading"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  title: string;
  message: string;
  confirmText?: string;
  loading?: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
}>();
</script> 