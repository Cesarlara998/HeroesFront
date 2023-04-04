import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import "primevue/resources/themes/lara-light-indigo/theme.css";     
import "primevue/resources/primevue.min.css";
import 'primeflex/primeflex.css';
import "primeicons/primeicons.css";
import './assets/main.css'
import Tooltip from 'primevue/tooltip';
import ToastService from 'primevue/toastservice';

const app = createApp(App)
app.use(PrimeVue);
app.use(createPinia())
app.use(router)
app.use(ToastService);

app.directive('tooltip', Tooltip);

app.mount('#app')
