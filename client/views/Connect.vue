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
  <div class="flex flex-column align-items-center justify-content-center">
    <div class="w-min justify-content-center align-items-center w-30rem">
      <div class="flex flex-column surface-card border-round-lg p-5">
        <div class="flex justify-content-center">
          <div class="justify-content-start">
            <p class="uppercase font-bold text-7xl m-0 text-color" translate="no" lang="en">
              FTP CLIENT
            </p>
          </div>
        </div>
        <div class="text-center mb-4">
          <p class="text-600 font-medium">Sign In to the application to continue</p>
        </div>
        <form @submit.prevent="onSignin" class="p-fluid w-full">
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

          <Divider />

          <div class="field">
            <Button
              text
              plain
              outlined
              type="submit"
              icon="pi pi-sign-in"
              class="block w-full p-3 text-xl text-center hover:text-color"
              label="Connect to FTP Server"
              aria-describedby="submit-help"
            />
          </div>
        </form>
      </div>
      <p class="text-center text-500 my-2">
        {{ $app?.copyright }}
      </p>
    </div>
  </div>
</template>

<style scoped>
::v-deep(.p-input-icon-right > svg) {
  right: 0.8rem;
  cursor: pointer;
}
</style>
