<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-cascades',
                    title: '项目管理',
                    index: '1',
                    subs: [
                        {
                            title: "项目列表",
                            index: 'projectList'
                        },
                        {
                            title: "举报管理",
                            index: 'report'
                        },
                        {
                            title: '审核列表',
                            index: 'doProject'
                        }
                    ]
                },
                {
                    icon: 'el-icon-lx-people',
                    title: '用户管理',
                    index: '2',
                    subs: [
                        {
                            title: '用户列表',
                            index: 'userList'
                        },
                        {
                            title: '申请列表',
                            index: 'userApply'
                        }
                    ]
                },
                {
                    icon: 'el-icon-lx-text',
                    title: '帖子管理',
                    index: 'postList',
                    // subs: [
                    //     {
                    //         title: '帖子列表',
                    //         index: 'postList'
                    //     },
                    //     {
                    //         title: '审核帖子',
                    //         index: 'doPost'
                    //     }
                    // ]
                },
                {
                    icon: 'el-icon-lx-sort',
                    title: '分类管理',
                    index: 'category'
                }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
