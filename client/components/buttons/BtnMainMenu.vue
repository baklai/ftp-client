<script setup>
import { ref } from 'vue';

const refMenu = ref();

const toggle = event => {
  refMenu.value.toggle(event);
};
</script>

<template>
  <Button
    text
    plain
    rounded
    icon="pi pi-th-large"
    iconClass="text-3xl"
    class="w-3rem h-3rem text-4xl hover:text-color mx-2"
    v-tooltip.bottom="'Main menu'"
    @click="toggle"
  />

  <Menu ref="refMenu" popup :model="[]" class="w-20rem py-2 px-4">
    <template #start>
      <div class="flex my-4 align-items-center">
        <div class="flex align-items-center justify-content-center mr-2">
          <Avatar class="mr-2" size="large" image="/img/logo.png" />
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

      <Panel header="Current connection" class="mb-4">
        <p><span class="text-primary font-bold">FTP Host</span>: {{ $app.connection.host }}</p>
        <p><span class="text-primary font-bold">FTP Port</span>: {{ $app.connection.port }}</p>
        <p><span class="text-primary font-bold">FTP User</span>: {{ $app.connection.user }}</p>
      </Panel>

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

    <template #item="{ label, item, props }">
      <a :href="item.url" v-bind="props.action">
        <span v-bind="props.icon" />
        <span v-bind="props.label">{{ label }}</span>
      </a>
    </template>
  </Menu>
</template>
