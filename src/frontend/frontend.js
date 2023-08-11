import { createApp } from 'vue';
import App from './App.vue';
import '../assets/tailwind.css';

jQuery('.WPVMKP_frontend_app').each((_, node) => {
    const id = jQuery(node).attr('id');
    const app = createApp(App, {});
    app.mount(`#${id}`);
});
