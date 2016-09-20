/**
 * Created by jiner on 2016/9/17.
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import index from './views/app';
import list from './views/list';

Vue.use(VueRouter);

let App = Vue.extend({});
let router = new VueRouter();

router.map({
    '/index':{
        name:'index',
        component:index
    },
    '/list':{
        name:'list',
        component:list
    }
})


router.redirect({
    '*':'/index'
})

router.start(App, '#app');
