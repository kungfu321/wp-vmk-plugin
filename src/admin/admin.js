import routes from './routes';
import { createWebHashHistory, createRouter } from 'vue-router'
import WPVMKPlugin from './Bits/WPVMKPlugin';

const router = createRouter({
    history: createWebHashHistory(),
    routes
});


const framework = new WPVMKPlugin();

framework.app.config.globalProperties.appVars = window.WPVMKPluginAdmin;

window.WPVMKPluginApp = framework.app.use(router).mount('#WPVMKP_app');

router.afterEach((to, from) => {
    jQuery('.WPVMKP_menu_item').removeClass('active');
    let active = to.meta.active;
    if(active) {
        jQuery('.WPVMKP_main-menu-items').find('li[data-key='+active+']').addClass('active');
    }
});
