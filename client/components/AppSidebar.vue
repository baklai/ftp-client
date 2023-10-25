<script setup></script>

<template>
  <div class="flex justify-content-start py-2">
    <div class="flex align-items-center justify-content-center mr-2">
      <Avatar class="mr-2" size="xlarge" image="/img/logo.png" />
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
    <Panel header="Current connection" class="mb-4">
      <p><span class="text-primary font-bold">FTP Host</span>: {{ $app.connection.host }}</p>
      <p><span class="text-primary font-bold">FTP Port</span>: {{ $app.connection.port }}</p>
      <p><span class="text-primary font-bold">FTP User</span>: {{ $app.connection.user }}</p>
    </Panel>
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
