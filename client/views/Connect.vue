<script setup>
import { inject, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';

const $app = inject('app');

const toast = useToast();

const { values, errors, handleSubmit, resetForm, defineComponentBinds } = useForm({
  validationSchema: yup.object({
    host: yup.string().required('Value is required'),
    port: yup.number().required('Value is required'),
    user: yup.string().required('Value is required'),
    password: yup.string().required('Value is required')
  }),
  initialValues: {
    host: 'localhost',
    port: 21,
    user: '',
    password: ''
  }
});

const host = defineComponentBinds('host');
const port = defineComponentBinds('port');
const user = defineComponentBinds('user');
const password = defineComponentBinds('password');

const onSignin = handleSubmit(async (values, { resetForm }) => {
  try {
    await $app.signin(values);
    toast.add({
      severity: 'success',
      summary: 'Information',
      detail: 'Authorization passed',
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: err.message,
      life: 3000
    });
  }
});

onMounted(() => {
  resetForm();
});
</script>

<template>
  <div class="flex h-screen">
    <div class="w-full lg:w-4 h-full px-6 py-6 flex flex-column justify-content-between">
      <img src="/img/logo.png" class="mt-4 mx-auto w-8rem h-8rem" alt="logo" />
      <div class="flex flex-column align-items-center gap-4">
        <div class="mb-3 text-center">
          <h2 class="text-6xl font-bold">
            <span class="text-2xl font-bold text-color-secondary">connect to</span> <br />
            FTP Server
          </h2>
        </div>
        <form @submit.prevent="onSignin" class="p-fluid w-25rem">
          <div class="formgrid grid">
            <div class="field col-12 xl:col-8">
              <label for="host" class="text-900 text-xl font-medium">
                {{ 'Host' }}
              </label>
              <span class="p-input-icon-left">
                <i class="pi pi-globe" />
                <InputText
                  id="host"
                  v-bind="host"
                  placeholder="Host"
                  :class="{ 'p-invalid': !!errors?.host }"
                  aria-describedby="host-help"
                />
              </span>
              <small id="host-help" class="p-error" v-if="errors?.host">
                {{ errors.host }}
              </small>
            </div>

            <div class="field col-12 xl:col-4">
              <label for="port" class="text-900 text-xl font-medium">
                {{ 'Port' }}
              </label>
              <span class="p-input-icon-left">
                <i class="pi pi-globe" />
                <InputText
                  id="port"
                  v-bind="port"
                  placeholder="Port"
                  :class="{ 'p-invalid': !!errors?.port }"
                  aria-describedby="port-help"
                />
              </span>
              <small id="port-help" class="p-error" v-if="errors?.port">
                {{ errors.port }}
              </small>
            </div>
          </div>

          <div class="field mb-4">
            <label for="user" class="text-900 text-xl font-medium">
              {{ 'User' }}
            </label>
            <span class="p-input-icon-left">
              <i class="pi pi-user" />
              <InputText
                id="user"
                v-bind="user"
                placeholder="User"
                :class="{ 'p-invalid': !!errors?.user }"
                aria-describedby="user-help"
              />
            </span>
            <small id="user-help" class="p-error" v-if="errors?.user">
              {{ errors.user }}
            </small>
          </div>

          <div class="field mb-4">
            <label for="password" class="text-900 text-xl font-medium">
              {{ 'Password' }}
            </label>
            <Password
              toggleMask
              inputId="password"
              v-bind="password"
              placeholder="Password"
              promptLabel="Choose a password"
              weakLabel="Too simple"
              mediumLabel="Average complexity"
              strongLabel="Complex password"
              :class="{ 'p-invalid': !!errors?.password }"
              aria-describedby="password-help"
            >
            </Password>
            <small id="password-help" class="p-error" v-if="errors?.password">
              {{ errors.password }}
            </small>
          </div>

          <div class="field">
            <Button
              type="submit"
              icon="pi pi-sign-in"
              class="block w-full text-center font-bold hover:text-color"
              label="CONTINUE"
              aria-describedby="submit-help"
            />
          </div>
        </form>
      </div>
      <p class="text-center text-color-secondary font-semibold">
        A problem?
        <a
          target="_blank"
          href="https://github.com/baklai/ftp-client/issues"
          class="text-primary hover:underline cursor-pointer font-medium"
        >
          Click here
        </a>
        and let us help you.
      </p>
    </div>
    <div
      class="bg-layout w-8 hidden lg:flex flex-column justify-content-between align-items-center px-6 py-6 bg-cover bg-norepeat"
    >
      <div class="mt-auto mb-auto">
        <span class="block text-white text-7xl font-semibold">
          <img src="/img/logo.png" class="w-3rem h-3rem" alt="logo" /> FTP Client
        </span>
        <span class="block text-color-secondary text-3xl max-w-30rem mt-4">
          File Transfer Protocol, is a standard network protocol used to transfer files from one
          host to another over a TCP-based network, typically the Internet.
        </span>
      </div>
      <div class="flex align-items-center gap-5">
        <p class="text-white font-semibold">
          {{ $app?.copyright }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-layout {
  background-image: url('/img/bg-layout.svg');
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
::v-deep(.p-input-icon-right > svg) {
  right: 0.8rem;
  cursor: pointer;
}
</style>
