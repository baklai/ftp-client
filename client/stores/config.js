import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

export const useConfig = defineStore('config', () => {
  const scale = ref(12);
  const ripple = ref(true);
  const menuMode = ref('static');

  const staticMenuDesktopInactive = ref(false);
  const overlayMenuActive = ref(false);
  const profileSidebarVisible = ref(false);
  const configSidebarVisible = ref(false);
  const staticMenuMobileActive = ref(false);
  const menuHoverActive = ref(false);

  watch(scale, applyScale);
  watch(menuMode, onMenuToggle);

  const isSidebarActive = computed(() => overlayMenuActive.value || staticMenuMobileActive.value);

  function onMenuToggle() {
    if (menuMode.value === 'overlay') {
      overlayMenuActive.value = !overlayMenuActive.value;
    }
    if (window.innerWidth > 991) {
      staticMenuDesktopInactive.value = !staticMenuDesktopInactive.value;
    } else {
      staticMenuMobileActive.value = !staticMenuMobileActive.value;
    }
  }

  function applyScale() {
    document.documentElement.style.fontSize = scale.value + 'px';
  }

  return {
    ripple,
    menuMode,
    scale,
    staticMenuDesktopInactive,
    overlayMenuActive,
    profileSidebarVisible,
    configSidebarVisible,
    staticMenuMobileActive,
    menuHoverActive,
    applyScale,
    onMenuToggle,
    isSidebarActive
  };
});
