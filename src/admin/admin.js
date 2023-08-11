import routes from './routes';
import { createWebHashHistory, createRouter } from 'vue-router'
import WPVMKPLUGIN from './Bits/Plugin';

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

const framework = new WPVMKPLUGIN();

framework.app.config.globalProperties.appVars = window.WPVMKPLUGINAdmin;

window.WPVMKPLUGINApp = framework.app.use(router).mount('#WPVMKPLUGIN_app');

router.afterEach((to, from) => {
    jQuery('.WPVMKPLUGIN_menu_item').removeClass('active');
    let active = to.meta.active;
    if (active) {
        jQuery('.WPVMKPLUGIN_main-menu-items').find('li[data-key=' + active + ']').addClass('active');
    }
});
