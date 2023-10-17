import { createRouter, createWebHashHistory } from 'vue-router';

import PrivateLayout from '@/layout/PrivateLayout.vue';
import PublicLayout from '@/layout/PublicLayout.vue';

import { useAuth } from '@/stores/auth';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        auth: true,
        layout: PrivateLayout,
        title: 'FTP Client',
        description: 'Web application of the file transfer protocol'
      },
      component: () => import('@/views/FTPClient.vue')
    },

    {
      path: '/connect',
      name: 'connect',
      meta: {
        layout: PublicLayout,
        title: 'FTP Client',
        description: 'Connect to file transfer server'
      },
      component: () => import('@/views/Connect.vue')
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      meta: {
        layout: PublicLayout
      },
      component: () => import('@/views/NotFound.vue')
    }
  ]
});

router.beforeEach((to, from) => {
  const { title, description } = to?.meta;
  if (title && description) {
    document.title = `${title} • ${description}`;
  } else {
    document.title = `FTP Client • Web application of the file transfer protocol`;
  }
  if (description) {
    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (metaDescriptionTag) {
      metaDescriptionTag.setAttribute('content', description);
    }
  }
  return;
});

router.beforeEach(async (to, from) => {
  const store = useAuth();
  if (to.name !== 'connect' && to?.meta?.auth && !store.loggedIn) {
    return { name: 'connect' };
  } else {
    return;
  }
});

export default router;
