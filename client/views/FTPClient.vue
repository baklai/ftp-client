<script setup lang="jsx">
import { ref, computed, inject, onMounted } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { Clipboard } from 'v-clipboard';

import ContextMenu from 'primevue/contextmenu';
import Breadcrumb from 'primevue/breadcrumb';
import FileUpload from 'primevue/fileupload';
import Badge from 'primevue/badge';

import { dateTimeToStr, byteToStr } from '@/service/DataFilters';
import { useClient } from '@/stores/client';

const axios = inject('axios');

const toast = useToast();
const confirm = useConfirm();

const ftp = useClient();

const home = ref({ icon: 'pi pi-folder-open' });
const breadcrumb = ref([]);
const ftpFiles = ref([]);
const files = ref([]);
const selectedRowData = ref();
const newValue = ref(null);
const loading = ref(false);
const uploading = ref(false);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const lockedRowBack = computed(() => [
  {
    name: null,
    size: null,
    type: 0,
    modifiedAt: null
  }
]);

const refContextMenu = ref();

const ctxMenuOptions = computed(() => {
  if (!selectedRowData.value?.type) return [];

  if (selectedRowData.value?.type === 1) {
    return [
      {
        label: 'Download file',
        icon: 'pi pi-download',
        command: () => download(selectedRowData.value.name)
      },
      {
        label: 'Copy file link',
        icon: 'pi pi-copy',
        command: () => copyLink(selectedRowData.value.name)
      },
      {
        label: 'Rename file',
        icon: 'pi pi-file-edit',
        command: () => rename(selectedRowData.value.name)
      },
      { separator: true },
      {
        label: 'Delete file',
        icon: 'pi pi-trash',
        command: () => remove(selectedRowData.value.name, selectedRowData.value.type)
      }
    ];
  }

  if (selectedRowData.value?.type === 2) {
    return [
      {
        label: 'Open folder',
        icon: 'pi pi-folder-open',
        command: () => update(selectedRowData.value.name)
      },
      {
        label: 'Rename folder',
        icon: 'pi pi-file-edit',
        command: () => rename(selectedRowData.value.name)
      },
      { separator: true },
      {
        label: 'Delete folder',
        icon: 'pi pi-trash',
        command: () => remove(selectedRowData.value.name, selectedRowData.value.type)
      }
    ];
  }

  return [];
});

const onRowContextMenu = event => {
  if (selectedRowData.value?.type === 0) return;
  refContextMenu.value.show(event.originalEvent);
};

const goToBack = async () => {
  if (breadcrumb.value.length) {
    breadcrumb.value.pop();
  }

  await update();
};

const update = async path => {
  try {
    loading.value = true;
    if (path) {
      breadcrumb.value.push({ label: path });
    }
    ftpFiles.value = await ftp.update({ path: breadcrumb.value.map(item => item.label).join('/') });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Record not updated',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const rename = async value => {
  newValue.value = value;
  confirm.require({
    group: 'prompt-rename',
    header: 'Rename',
    message: value,
    icon: 'pi pi-question-circle',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      try {
        await ftp.rename({
          path: `/${breadcrumb.value.map(item => item.label).join('/')}/${value}`,
          newPath: `/${breadcrumb.value.map(item => item.label).join('/')}/${newValue.value}`
        });
        toast.add({
          severity: 'success',
          summary: 'Information',
          detail: 'Record is renamed',
          life: 3000
        });
      } catch (err) {
        toast.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Record not renamed',
          life: 3000
        });
      } finally {
        newValue.value = null;
        await update();
      }
    },
    reject: () => {
      newValue.value = null;
      toast.add({
        severity: 'info',
        summary: 'Information',
        detail: 'Record rename not confirmed',
        life: 3000
      });
    }
  });
};

const remove = async (name, type) => {
  confirm.require({
    message: 'Do you want to delete this record?',
    header: 'HD Confirm delete record',
    icon: 'pi pi-info-circle text-yellow-500',
    acceptIcon: 'pi pi-check',
    acceptClass: 'p-button-danger',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      try {
        await ftp.remove({
          path: `/${breadcrumb.value.map(item => item.label).join('/')}/${name}`,
          type
        });
        toast.add({
          severity: 'success',
          summary: 'Information',
          detail: 'Record is removed',
          life: 3000
        });
      } catch (err) {
        toast.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Record not removed',
          life: 3000
        });
      } finally {
        await update();
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Information',
        detail: 'Record deletion not confirmed',
        life: 3000
      });
    }
  });
};

const download = async filename => {
  try {
    uploading.value = true;

    const file = await ftp.download({
      path: breadcrumb.value.map(item => item.label).join('/'),
      filename: filename
    });

    const blob = new Blob([file]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElemen('a');
    link.style.display = 'none';
    link.href = url;
    link.download = filename;
    link.click();

    toast.add({
      severity: 'info',
      summary: 'Information',
      detail: 'FTP File download',
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'File not downloaded',
      life: 3000
    });
  } finally {
    uploading.value = false;
  }
};

const uploadFile = async event => {
  try {
    uploading.value = true;
    await Promise.all(
      event.files.map(file => {
        const bodyFormData = new FormData();
        bodyFormData.append('path', `/${breadcrumb.value.map(item => item.label).join('/')}`);
        bodyFormData.append('file', file);
        return ftp.uploadFile(bodyFormData);
      })
    );
    toast.add({
      severity: 'success',
      summary: 'Information',
      detail: 'File is uploaded',
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'File not uploaded',
      life: 3000
    });
  } finally {
    uploading.value = false;
    await update();
  }
};

const uploadFolder = async () => {
  const newFolderName = 'New Folder';
  try {
    await ftp.uploadFolder({
      path: `/${breadcrumb.value.map(item => item.label).join('/')}/${newFolderName}`
    });
    toast.add({
      severity: 'success',
      summary: 'Information',
      detail: 'Folder is created',
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Folder not created',
      life: 3000
    });
  } finally {
    await update();
  }
};

const copyLink = async filename => {
  if (!filename) return;
  try {
    const link =
      `${axios.defaults.baseURL}/ftp/download?` +
      `path=${breadcrumb.value.map(item => item.label).join('/')}` +
      '&' +
      `filename=${filename}`;
    const encodedLink = link.replaceAll(' ', '+');
    await Clipboard.copy(encodedLink);
    toast.add({
      severity: 'info',
      summary: 'Information',
      detail: `Link copied to clipboard`,
      life: 3000
    });
  } catch (err) {
    console.error(err);
  }
};

const filterFileIcon = filename => {
  if (
    filename.includes('.exe') ||
    filename.includes('.msi') ||
    filename.includes('.cmd') ||
    filename.includes('.bat') ||
    filename.includes('.vbs')
  ) {
    return 'pi pi-microsoft';
  }

  if (
    filename.includes('.zip') ||
    filename.includes('.rar') ||
    filename.includes('.cab') ||
    filename.includes('.7z') ||
    filename.includes('.gz')
  ) {
    return 'pi pi-box';
  }

  if (filename.includes('.pdf')) return 'pi pi-file-pdf';

  if (filename.includes('.doc') || filename.includes('.docx') || filename.includes('.odt')) {
    return 'pi pi-file-word';
  }

  if (filename.includes('.xls') || filename.includes('.xlsx') || filename.includes('.ods')) {
    return 'pi pi-file-excel';
  }

  if (filename.includes('.jpg') || filename.includes('.png') || filename.includes('.jpeg')) {
    return 'pi pi-image';
  }

  if (filename.includes('.avi') || filename.includes('.mp4')) {
    return 'pi pi-video';
  }

  return 'pi pi-file';
};

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
  removeFileCallback(index);
};

const onSelectedFiles = event => {
  files.value = event.files;
};

const uploadEvent = callback => {
  callback();
};

onMounted(async () => {
  await update();
});
</script>

<template>
  <div class="col-12">
    <div class="flex h-full">
      <div class="flex w-full overflow-x-auto">
        <ConfirmDialog group="prompt-rename" :pt="{ headertitle: 'mr-4' }">
          <template #message="slotProps">
            <span class="p-input-icon-left w-30rem">
              <i class="pi pi-file-edit" />
              <InputText v-model="newValue" placeholder="Enter new name" class="w-full" />
            </span>
          </template>
        </ConfirmDialog>

        <ContextMenu ref="refContextMenu" :model="ctxMenuOptions">
          <template #item="{ label, item, props }">
            <a :href="item.url" v-bind="props.action">
              <span v-bind="props.icon" />
              <span v-bind="props.label">{{ label }}</span>
            </a>
          </template>
        </ContextMenu>

        <DataTable
          rowHover
          sortable
          scrollable
          contextMenu
          removableSort
          :value="ftpFiles"
          :loading="loading"
          sortField="type"
          :sortOrder="-1"
          sortMode="single"
          scrollHeight="flex"
          responsiveLayout="scroll"
          columnResizeMode="expand"
          v-model:filters="filters"
          :globalFilterFields="['name']"
          v-model:contextMenuSelection="selectedRowData"
          :frozenValue="breadcrumb?.length ? lockedRowBack : null"
          style="height: calc(100vh - 6rem); width: 100%"
          @rowContextmenu="onRowContextMenu"
          class="text-lg"
        >
          <template #header>
            <div class="flex flex-wrap gap-4 mb-2 align-items-center justify-content-between">
              <div class="flex flex-wrap gap-2 align-items-center">
                <i class="mr-2 hidden sm:block">
                  <Avatar class="mr-2" size="xlarge" icon="pi pi-cloud-upload" />
                </i>
                <div>
                  <h3 class="text-color m-0">
                    {{ $route?.meta?.title }}
                  </h3>
                  <p class="text-color-secondary">
                    {{ $route?.meta?.description }}
                  </p>
                </div>
              </div>
              <div
                class="flex flex-wrap gap-2 align-items-center justify-content-between sm:w-max w-full"
              >
                <div class="flex flex-wrap align-items-center justify-content-between">
                  <span class="p-input-icon-left p-input-icon-right sm:w-max w-full">
                    <i class="pi pi-search" />
                    <InputText
                      id="name"
                      class="sm:w-max w-full"
                      :placeholder="'Search'"
                      v-model="filters['global'].value"
                    />
                    <i
                      v-show="!!filters['global'].value"
                      class="pi pi-times cursor-pointer hover:text-color"
                      v-tooltip.bottom="'Clear filter'"
                      @click="filters['global'].value = null"
                    />
                  </span>
                </div>
                <div class="flex gap-2 sm:w-max w-full justify-content-between"></div>
              </div>
            </div>

            <FileUpload
              multiple
              customUpload
              :auto="false"
              name="files[]"
              @select="onSelectedFiles"
              @uploader="uploadFile"
            >
              <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                <div class="flex justify-content-between flex-wrap w-full">
                  <div class="flex gap-2 align-items-center justify-content-center">
                    <Button
                      icon="pi pi-plus"
                      :label="'Choose'"
                      class="font-bold"
                      @click="chooseCallback()"
                    />

                    <Button
                      icon="pi pi-cloud-upload"
                      :label="'Upload'"
                      class="font-bold"
                      :disabled="!files || files.length === 0"
                      @click="uploadEven(uploadCallback)"
                    />

                    <Button
                      icon="pi pi-times"
                      :label="'Cancel'"
                      class="font-bold"
                      :disabled="!files || files.length === 0"
                      @click="clearCallback()"
                    />
                  </div>

                  <div class="flex gap-2 align-items-center justify-content-center">
                    <Button
                      icon="pi pi-folder"
                      class="font-bold"
                      :label="'Create folder'"
                      @click="uploadFolder()"
                    />

                    <Button
                      text
                      plain
                      rounded
                      icon="pi pi-sync"
                      iconClass="text-2xl"
                      class="p-button-lg mx-2 hover:text-primary h-3rem w-3rem"
                      v-tooltip.bottom="'Update records'"
                      @click="update()"
                    />
                  </div>
                </div>
              </template>

              <template #content="{ files, removeFileCallback }">
                <div
                  v-for="(file, index) of files"
                  :key="file.name + file.type + file.size"
                  class="p-fileupload-file"
                >
                  <i
                    :class="filterFileIcon(file.name)"
                    class="text-3xl p-fileupload-file-thumbnail p-2 mr-2"
                  />

                  <div class="p-fileupload-file-details">
                    <div class="p-fileupload-file-name font-bold">{{ file.name }}</div>
                    <span class="p-fileupload-file-size">{{ byteToStr(file.size) }}</span>
                    <Badge :value="'Pending'" severity="warning" />
                  </div>

                  <div class="p-fileupload-file-actions">
                    <Button
                      text
                      rounded
                      icon="pi pi-times"
                      severity="danger"
                      @click="onRemoveTemplatingFile(file, removeFileCallback, index)"
                    />
                  </div>
                </div>
              </template>

              <template #empty>
                <p>{{ 'Drag and drop files to here to upload' }}</p>
              </template>
            </FileUpload>

            <ProgressBar mode="indeterminate" class="h-0.5rem w-full mt-2" v-show="uploading" />
          </template>

          <template #loading>
            <i class="pi pi-spin pi-spinner text-4xl mr-4"></i>
            <span> {{ 'Loading records data. Please wait' }}.</span>
          </template>

          <template #empty>
            <div
              v-if="!loading && ftpFiles?.length === 0"
              class="flex flex-column justify-content-center p-datatable-loading-overlay p-component-overlay z-0"
            >
              <i class="pi pi-folder-open text-8xl text-color-secondary" />
              <h5>{{ 'No files found in folder' }}</h5>
            </div>
          </template>

          <Column
            sortable
            field="name"
            :header="'Name'"
            :style="{ minWidth: '45%' }"
            headerClass="font-bold text-center uppercase"
          >
            <template #body="{ data }">
              <div
                class="flex flex-row flex-wrap"
                :class="data.type !== 1 ? 'cursor-pointer' : ''"
                @click="data.type === 2 ? update(data.name) : data.type === 0 ? goToBack() : false"
              >
                <div class="flex align-items-center justify-content-center mr-4">
                  <i
                    class="pi pi-folder-open text-2xl font-bold text-color-secondary"
                    v-if="data.type === 0"
                  />
                  <i :class="filterFileIcon(data.name)" class="text-xl" v-if="data.type === 1" />
                  <i
                    class="pi pi-folder text-2xl font-bold text-yellow-500"
                    v-if="data.type === 2"
                  />
                </div>
                <div class="flex align-items-center justify-content-center">
                  <span class="text-xl font-bold text-color-secondary" v-if="data.type === 0">
                    {{ breadcrumb?.length ? breadcrumb[breadcrumb?.length - 1].label : '' }}
                  </span>
                  <span class="text-xl" v-if="data.type === 1">
                    {{ data.name }}
                  </span>
                  <span class="text-xl font-bold" v-if="data.type === 2">
                    {{ data.name }}
                  </span>
                </div>
              </div>
            </template>
          </Column>

          <Column
            sortable
            field="size"
            :header="'Size'"
            :style="{ minWidth: '15%' }"
            headerClass="font-bold text-center uppercase"
          >
            <template #body="{ data }">
              <span class="text-color-secondary">
                {{ data.size && data.type !== 2 ? byteToStr(data.size) : '' }}
              </span>
            </template>
          </Column>

          <Column
            sortable
            field="type"
            :header="'Type'"
            :style="{ minWidth: '10%' }"
            headerClass="font-bold text-center uppercase"
          >
            <template #body="{ data }">
              <span class="text-color-secondary" v-if="data.type === 0"> </span>
              <span class="text-color-secondary" v-if="data.type === 1">
                {{ 'File' }}
              </span>
              <span class="text-color-secondary" v-if="data.type === 2">
                {{ 'Folder' }}
              </span>
            </template>
          </Column>

          <Column
            sortable
            field="modifiedAt"
            :header="'Modified time'"
            :style="{ minWidth: '10%' }"
            headerClass="font-bold text-center uppercase"
          >
            <template #body="{ data }">
              <span class="text-color-secondary">
                {{ data?.modifiedAt ? dateTimeToStr(data.modifiedAt) : data?.rawModifiedAt }}
              </span>
            </template>
          </Column>

          <Column
            field="options"
            :header="null"
            :style="{ minWidth: '15%' }"
            headerClass="font-bold text-center uppercase"
          >
            <template #body="{ data }">
              <div class="flex justify-content-end flex-wrap">
                <Button
                  text
                  plain
                  rounded
                  icon="pi pi-download"
                  iconClass="text-xl"
                  class="p-button-lg mx-2 text-green-500 h-2rem w-2rem"
                  v-tooltip.bottom="'Download file'"
                  @click="download(data.name)"
                  v-if="data.type === 1"
                />

                <Button
                  text
                  plain
                  rounded
                  icon="pi pi-copy"
                  iconClass="text-xl"
                  class="p-button-lg mx-2 text-primary h-2rem w-2rem"
                  v-tooltip.bottom="'Copy file link'"
                  @click="copyLink(data.name)"
                  v-if="data.type === 1"
                />

                <Button
                  text
                  plain
                  rounded
                  icon="pi pi-file-edit"
                  iconClass="text-xl"
                  class="p-button-lg mx-2 text-yellow-500 h-2rem w-2rem"
                  v-tooltip.bottom="'Rename file'"
                  @click="rename(data.name)"
                  v-if="data.type === 1"
                />

                <Button
                  text
                  plain
                  rounded
                  icon="pi pi-trash"
                  iconClass="text-xl"
                  class="p-button-lg mx-2 text-red-500 h-2rem w-2rem"
                  v-tooltip.bottom="data.type === 1 ? 'Remove file' : 'Remove folder'"
                  @click="remove(data.name, data.type)"
                  v-if="data.type === 1"
                />
              </div>
            </template>
          </Column>

          <template #footer>
            <Breadcrumb :home="home" :model="breadcrumb" class="py-3">
              <template #item="{ label, item, props }">
                <router-link v-if="item.route" v-slot="routerProps" :to="item.route" custom>
                  <a :href="routerProps.href" v-bind="props.action">
                    <span v-bind="props.icon" />
                    <span v-bind="props.label">{{ label }}</span>
                  </a>
                </router-link>
                <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                  <span v-if="item.icon" v-bind="props.icon" />
                  <span v-bind="props.label">{{ label }}</span>
                </a>
              </template>
            </Breadcrumb>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
::v-deep(.p-datatable-header) {
  background: var(--surface-card);
  padding: 0.75rem 0rem;
}

::v-deep(.p-datatable-footer) {
  border: none;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

::v-deep(.p-datatable .p-datatable-thead > tr > th) {
  background: var(--surface-card);
}

::v-deep(.p-datatable .p-datatable-tbody > tr) {
  background: var(--surface-card);
}

::v-deep(.p-component-overlay) {
  background-color: transparent;
}

::v-deep(tr.p-datatable-emptymessage > td) {
  border: none;
}

::v-deep(tr.p-datatable-emptymessage:hover) {
  background: none !important;
}

::v-deep(.p-datatable .p-datatable-tbody > tr:not(.p-highlight):hover) {
  background: var(--surface-ground);
}

::v-deep(.p-datatable .p-datatable-tbody > tr:not(.p-highlight):focus) {
  background-color: var(--surface-ground);
}

::v-deep(.p-datatable.p-datatable-lg .p-datatable-tbody > tr > td) {
  padding: 0.3rem 0.3rem;
}
</style>
