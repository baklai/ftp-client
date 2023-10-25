<script setup>
import { useConfig } from '@/stores/config';

const $config = useConfig();
</script>

<template>
  <div
    class="bg-layout min-h-screen min-w-screen flex flex-column align-items-center justify-content-center"
  >
    <div class="w-min justify-content-center align-items-center">
      <div class="m-auto">
        <div class="flex flex-column align-items-center w-full py-8 px-5 sm:px-8">
          <div class="flex flex-column align-items-center">
            <h1 class="text-6xl font-bold mb-2">Not Found</h1>
            <span class="text-color-secondary mb-5"> Requested resource is not available </span>
            <img src="/img/404.webp" alt="Not found" width="400" class="mb-5" />
            <div class="text-center">
              <i class="pi pi-home text-blue-600 mr-2"></i>
              <RouterLink :to="{ name: 'home' }" class="text-blue-600">
                Back to home page
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-layout {
  background-image: url('/img/bg-layout.svg');
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
</style>
