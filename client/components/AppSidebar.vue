<script setup></script>

<template>
  <div class="flex justify-content-start py-2">
    <div class="flex align-items-center justify-content-center mr-2">
      <Avatar class="mr-2" size="xlarge" icon="pi pi-cloud-upload" />
    </div>
    <div class="flex align-items-center justify-content-center">
      <div>
        <span class="text-2xl">{{ $route?.meta?.title }}</span>
        <p class="text-sm text-color-secondary m-0">
          {{ $route?.meta?.description }}
        </p>
      </div>
    </div>
  </div>

  <Divider />

  <div class="sidebar-menu overflow-y-scroll w-full text-base my-4">
    <span class="text-xl">
      FTP, which stands for File Transfer Protocol, is a standard network protocol used to transfer
      files from one host to another over a TCP-based network, typically the Internet. It was first
      developed in the early 1970s and has since become one of the most widely used methods for
      sharing files and managing data on remote servers.
    </span>
  </div>

  <Button
    text
    plain
    raised
    outlined
    size="large"
    class="w-full"
    label="Disconnect"
    icon="pi pi-sign-out"
    @click="$app.signout()"
  />
</template>

<style scoped>
.sidebar-menu {
  height: calc(100vh - 14rem);
  scrollbar-width: none;
}
</style>
