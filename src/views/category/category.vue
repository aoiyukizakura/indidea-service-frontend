<!--
 * @Author: Morpho Sylvie
 * @Date: 2020-03-08 20:18:58
 * @LastEditTime: 2020-04-14 22:30:22
 * @FilePath: \vue-manage-system\src\views\category\category.vue
 * @Description: 
 -->
<template>
    <div class="main">
        <h3 class="allready-had">已有分类</h3>
        <div class="categories-list" v-for="item in cList" :key="item.id">
            {{ item.name }}
        </div>
        <div class="control">
            <el-input v-model="input" placeholder="请输入内容"></el-input>
            <el-button type="success" @click="addCategory">添加</el-button>
        </div>
    </div>
</template>
<script>
import { doCategories, categoriesList } from '../../api/category';
export default {
    name: 'caregory',
    data: () => ({
        input: '',
        cList: []
    }),
    methods: {
        addCategory() {
            if (this.input === '' || this.input === null) {
                this.$message.error('请输入信息');
                return;
            } else {
                this.$confirm('你确定要增加该条分类吗？这条分类启用后将无法禁用', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        doCategories(this.input).then(res => {
                            if (res.data) {
                                this.input = '';
                                this.getCategories();
                                this.$message.success('添加成功');
                            }
                            console.log('res :', res);
                        });
                    })
                    .catch(() => {});
            }
        },
        getCategories() {
            categoriesList().then(res => {
                if (res.data) {
                    this.cList = res.data;
                }
            });
        }
    },
    created() {
        this.getCategories();
    }
};
</script>
<style scoped>
.main {
    text-align: center;
    max-width: 763px;
    margin: 0 auto;
}
.allready-had {
    font-weight: 400;
    font-size: 24px;
    line-height: 36px;
    color: #282828;
}
.categories-list {
    line-height: 36px;
    font-size: 15px;
    border-bottom: 1px solid #dcdcdc;
    margin-bottom: 16px;
}
.control {
    padding: 10px 45px;
}
.control /deep/ .el-button {
    margin-top: 10px !important;
}
</style>
