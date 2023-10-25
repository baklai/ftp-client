<script setup>
import { ref } from 'vue';

import AppTopbar from '@/components/AppTopbar.vue';
import AppSidebar from '@/components/AppSidebar.vue';
</script>

<template>
  <component :is="$route.meta.layout">
    <slot />
  </component>

  <Toast position="top-right" class="z-100" />
</template>
