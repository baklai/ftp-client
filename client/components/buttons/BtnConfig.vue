<script setup>
import { ref } from 'vue';

import AppConfig from '@/components/AppConfig.vue';

const visible = ref(false);
</script>

<template>
  <button
    type="button"
    class="layout-config-button p-link"
    v-tooltip.left="'Options'"
    @click="visible = !visible"
  >
    <i class="pi pi-cog"></i>
  </button>

  <AppConfig v-model:visible="visible" />
</template>

<style scoped>
.p-link {
  text-align: center;
  background-color: var(--text-color-secondary);
}
</style>
