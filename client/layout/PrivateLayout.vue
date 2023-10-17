<script setup>
import { ref, computed, watchEffect } from 'vue';

import AppTopbar from '@/components/AppTopbar.vue';
import AppSidebar from '@/components/AppSidebar.vue';
import BtnConfig from '@/components/buttons/BtnConfig.vue';

import { useConfig } from '@/stores/config';

const $config = useConfig();

const outsideClickListener = ref(null);

const containerClass = computed(() => {
  return {
    'layout-theme-light': $config.theme === 'light',
    'layout-theme-dark': $config.theme === 'dark',
    'layout-overlay': $config.menuMode === 'overlay',
    'layout-static': $config.menuMode === 'static',
    'layout-static-inactive': $config.staticMenuDesktopInactive && $config.menuMode === 'static',
    'layout-overlay-active': $config.overlayMenuActive,
    'layout-mobile-active': $config.staticMenuMobileActive,
    'p-input-filled': $config.inputStyle === 'filled',
    'p-ripple-disabled': !$config.ripple
  };
});

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = event => {
      if (isOutsideClicked(event)) {
        $config.overlayMenuActive = false;
        $config.staticMenuMobileActive = false;
        $config.menuHoverActive = false;
      }
    };
    document.addEventListener('click', outsideClickListener.value);
  }
};

const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener);
    outsideClickListener.value = null;
  }
};

const isOutsideClicked = event => {
  const sidebarEl = document.querySelector('.layout-sidebar');
  const topbarEl = document.querySelector('.layout-menu-button');
  return !(
    sidebarEl.isSameNode(event.target) ||
    sidebarEl.contains(event.target) ||
    topbarEl.isSameNode(event.target) ||
    topbarEl.contains(event.target)
  );
};

watchEffect(() => {
  if ($config.isSidebarActive) {
    bindOutsideClickListener();
  } else {
    unbindOutsideClickListener();
  }
});
</script>

<template>
  <div class="layout-wrapper disabled-selected-html" :class="containerClass">
    <div class="layout-sidebar surface-50">
      <AppSidebar />
    </div>

    <div class="layout-main-container">
      <AppTopbar />
      <div class="layout-main overflow-auto">
        <div class="grid grid-nogutter" style="height: calc(100vh - 9rem)">
          <RouterView />
        </div>
      </div>
    </div>
    <BtnConfig />
  </div>

  <ConfirmDialog :style="{ minWidth: '350px' }">
    <template #message="slotProps">
      <div class="flex align-items-center justify-content-start confirmation-content">
        <i class="text-4xl mr-3" :class="slotProps.message.icon" />
        <span class="font-medium">{{ slotProps.message.message }} </span>
      </div>
    </template>
  </ConfirmDialog>
</template>

<style scoped>
.disabled-selected-html {
  -webkit-user-select: 'none';
  -moz-user-select: 'none';
  -ms-user-select: 'none';
  -o-user-select: 'none';
  user-select: 'none';
}
</style>
