import { ref, inject } from 'vue';
import { defineStore } from 'pinia';

export const useClient = defineStore('client', () => {
  const $axios = inject('axios');

  async function update(params) {
    try {
      return await $axios.get('/', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function download(params) {
    try {
      return await $axios.get('/download', { params, responseType: 'blob' });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function uploadFile(payload) {
    try {
      return await $axios.post('/upload/file', payload, {
        headers: {
          'Content-Type': `multipart/form-data;`
        }
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function uploadFolder({ ...payload }) {
    try {
      return await $axios.post('/upload/folder', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function rename({ ...payload }) {
    try {
      return await $axios.put('/', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function remove(params) {
    try {
      return await $axios.delete('/', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return {
    update,
    download,
    uploadFile,
    uploadFolder,
    rename,
    remove
  };
});
