import app from './elements.js';
import ajax from './AJAX.js'

import {
    applyFilters,
    addFilter,
    addAction,
    doAction,
    removeAllActions
} from '@wordpress/hooks';

export default class WPVMKPlugin {
    constructor() {
        this.doAction = doAction;
        this.addFilter = addFilter;
        this.addAction = addAction;
        this.applyFilters = applyFilters;
        this.removeAllActions = removeAllActions;
        //
        this.AJAX = ajax;
        this.appVars = window.WPVMKPluginAdmin;
        this.app = this.extendVueConstructor();
    }

    extendVueConstructor() {
        const self = this;
        app.mixin({
            methods: {
                addFilter,
                applyFilters,
                doAction,
                addAction,
                removeAllActions,
                longLocalDate: self.longLocalDate,
                longLocalDateTime: self.longLocalDateTime,
                dateTimeFormat: self.dateTimeFormat,
                localDate: self.localDate,
                ucFirst: self.ucFirst,
                ucWords: self.ucWords,
                slugify: self.slugify,
                $get: self.$get,
                $post: self.$post,
                $del: self.$del,
                $put: self.$put,
                $patch: self.$patch,
                $handleError: self.handleError,
                $saveData: self.saveData,
                $getData: self.getData,
                $waitingTime: self.waitingTime,
                convertToText: self.convertToText,
                $setTitle(title) {
                    document.title = title;
                }
            }
        });

        return app;
    }

    getExtraComponents() {
        return {
            'ticket-header': {
                template: `<h1>OK</h1>`
            }
        }
    }

    registerBlock(blockLocation, blockName, block) {
        this.addFilter(blockLocation, this.appVars.slug, function (components) {
            components[blockName] = block;
            return components;
        });
    }

    registerTopMenu(title, route) {
        if (!title || !route.name || !route.path || !route.component) {
            return;
        }

        this.addFilter('WPVMKPLUGIN_top_menus', this.appVars.slug, function (menus) {
            menus = menus.filter(m => m.route !== route.name);
            menus.push({
                route: route.name,
                title: title
            });
            return menus;
        });

        this.addFilter('WPVMKPLUGIN_global_routes', this.appVars.slug, function (routes) {
            routes = routes.filter(r => r.name !== route.name);
            routes.push(route);
            return routes;
        });
    }

    $get(url, options = {}) {
        return AJAX.get(url, options);
    }

    $post(url, options = {}) {
        return AJAX.post(url, options);
    }

    $del(url, options = {}) {
        return AJAX.delete(url, options);
    }

    $put(url, options = {}) {
        return AJAX.put(url, options);
    }

    $patch(url, options = {}) {
        return AJAX.patch(url, options);
    }

    longLocalDate(date) {
        return this.dateTimeFormat(
            date, 'ddd, DD MMM, YYYY'
        );
    }

    saveData(key, data) {
        let existingData = window.localStorage.getItem('__WPVMKPLUGIN_data');

        if (!existingData) {
            existingData = {};
        } else {
            existingData = JSON.parse(existingData);
        }

        existingData[key] = data;

        window.localStorage.setItem('__WPVMKPLUGIN_data', JSON.stringify(existingData));
    }

    getData(key, defaultValue = false) {
        let existingData = window.localStorage.getItem('__WPVMKPLUGIN_data');
        existingData = JSON.parse(existingData);
        if (!existingData) {
            return defaultValue;
        }

        if (existingData[key]) {
            return existingData[key];
        }

        return defaultValue;

    }

    longLocalDateTime(date) {
        return this.dateTimeFormat(
            date, 'ddd, DD MMM, YYYY hh:mm:ssa'
        );
    }

    ucFirst(text) {
        return text[0].toUpperCase() + text.slice(1).toLowerCase();
    }

    ucWords(text) {
        return (text + '').replace(/^(.)|\s+(.)/g, function ($1) {
            return $1.toUpperCase();
        })
    }

    slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w\\-]+/g, '') // Remove all non-word chars
            .replace(/\\-\\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
    }

    handleError(response) {
        if (response.responseJSON) {
            response = response.responseJSON;
        }
        let errorMessage = '';
        if (typeof response === 'string') {
            errorMessage = response;
        } else if (response && response.message) {
            errorMessage = response.message;
        } else {
            errorMessage = this.convertToText(response);
        }
        if (!errorMessage) {
            errorMessage = 'Something is wrong!';
        }
        this.$notify({
            type: 'error',
            title: 'Error',
            message: errorMessage,
            offset: 32,
            dangerouslyUseHTMLString: true
        });
    }

    convertToText(obj) {
        const string = [];
        if (typeof (obj) === 'object' && (obj.join === undefined)) {
            for (const prop in obj) {
                string.push(this.convertToText(obj[prop]));
            }
        } else if (typeof (obj) === 'object' && !(obj.join === undefined)) {
            for (const prop in obj) {
                string.push(this.convertToText(obj[prop]));
            }
        } else if (typeof (obj) === 'function') {

        } else if (typeof (obj) === 'string') {
            string.push(obj)
        }

        return string.join('<br />')
    }
}
