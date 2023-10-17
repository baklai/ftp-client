import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useAuth = defineStore('auth', () => {
  const token = ref(null);

  const loggedIn = computed(() => {
    return !!token.value;
  });

  function setAccessToken(value) {
    token.value = value;
  }

  function getAccessToken() {
    return token.value;
  }

  function resetAccessToken() {
    token.value = null;
  }

  return {
    token,
    loggedIn,
    setAccessToken,
    getAccessToken,
    resetAccessToken
  };
});
