<script setup>
import { useConfig } from '@/stores/config';

const $config = useConfig();
</script>

<template>
  <Button
    text
    plain
    rounded
    :icon="$config.isDarkTheme ? 'pi pi-sun' : 'pi pi-moon'"
    v-tooltip.bottom="$config.isDarkTheme ? 'Theme Light' : 'Theme Dark'"
    @click="$config.isDarkTheme ? ($config.theme = 'light') : ($config.theme = 'dark')"
  />
</template>
