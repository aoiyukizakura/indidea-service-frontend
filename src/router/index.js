import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/projectList'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/projectList',
                    component: () => import('../views/project/projectList.vue'),
                    meta: { title: '项目列表', permission: true }
                },
                {
                    path: '/doProject',
                    component: () => import('../views/project/doProject.vue'),
                    meta: { title: '审核列表', permission: true }
                },
                {
                    path: '/report',
                    component: () => import('../views/project/report.vue'),
                    meta: { title: '举报管理', permission: true }
                },
                {
                    path: '/userList',
                    component: () => import('../views/user/userList.vue'),
                    meta: { title: '用户列表', permission: true }
                },
                {
                    path: '/userApply',
                    component: () => import('../views/user/userApply.vue'),
                    meta: { title: '申请列表', permission: true }
                },
                {
                    path: '/postList',
                    component: () => import('../views/post/postList.vue'),
                    meta: { title: '帖子列表', permission: true }
                },
                {
                    path: '/doPost',
                    component: () => import('../views/post/doPost.vue'),
                    meta: { title: '审核帖子', permission: true }
                },
                {
                    path: '/category',
                    component: () => import('../views/category/category.vue'),
                    meta: { title: '分类管理', permission: true }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
