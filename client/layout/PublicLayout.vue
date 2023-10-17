<template>
  <main
    class="bg-layout flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
  >
    <RouterView />
  </main>
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
