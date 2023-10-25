import { useAuth } from '@/stores/auth';

export default {
  install: async (app, options) => {
    const { $router, $axios, $toast, $error } = app.config.globalProperties;

    const store = useAuth();

    app.config.globalProperties.$app = {
      ...options,

      connection: {
        host: null,
        port: null,
        user: null
      },

      get loggedIn() {
        return !!store?.token;
      },

      async signin({ host, port, user, password }) {
        try {
          const { accessToken } = await $axios.post('/connect', { host, port, user, password });
          if (accessToken) {
            this.connection.host = host;
            this.connection.port = port;
            this.connection.user = user;
            store.setAccessToken(accessToken);
            $router.push({ name: 'home' });
          }
        } catch (err) {
          $error(err);
          throw err;
        }
      },

      async signout() {
        this.connection.host = null;
        this.connection.port = null;
        this.connection.user = null;
        store.resetAccessToken();
        $router.push({ name: 'connect' });
        $toast.add({
          severity: 'info',
          summary: 'Information',
          detail: 'Logout successfully completed',
          life: 3000
        });
      },

      notImplemented() {
        $toast.add({
          severity: 'info',
          summary: 'Information',
          detail: 'This functionality has not yet been implemented',
          life: 5000
        });
      }
    };

    app.provide('app', app.config.globalProperties.$app);
  }
};
