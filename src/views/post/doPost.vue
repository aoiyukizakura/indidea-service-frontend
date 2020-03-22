<!--
 * @Author: Morpho Sylvie
 * @Date: 2020-03-08 20:18:34
 * @LastEditTime: 2020-03-12 17:02:07
 * @FilePath: \vue-manage-system\src\views\post\doPost.vue
 * @Description: 
 -->
<!--
 * @Author: Morpho Sylvie
 * @Date: 2020-03-08 20:18:23
 * @LastEditTime: 2020-03-12 16:32:02
 * @FilePath: \vue-manage-system\src\views\post\postList.vue
 * @Description: 
 -->
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 帖子列表 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box"></div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="user.username" label="发帖人"></el-table-column>
                <el-table-column label="发帖内容（点击查看详情）" width="195">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" title="发帖内容" width="300" trigger="click" :content="scope.row.content">
                            <p style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" slot="reference">
                                {{ scope.row.content }}
                            </p>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="封面(查看图片列表)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            v-if="scope.row.cover"
                            class="table-td-thumb"
                            :src="'/api/uploads/' + scope.row.cover.split(',')[0]"
                            :preview-src-list="imgList(scope.row.cover)"
                        ></el-image>
                        <div v-else>
                            暂无封面
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <el-tag effect="dark" type="warning">待审核中</el-tag>
                </el-table-column>

                <el-table-column prop="createdat" label="发帖时间" sortable :formatter="createDate"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">
                            不通过
                        </el-button>
                        <el-button type="text" icon="el-icon-check" class="success" @click="handleOn(scope.$index, scope.row)">
                            通过
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :page-sizes="[10, 20, 30, 40]"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                    @size-change="handleSizeChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { postList, doPost, postComment, doComment } from '../../api/post';
export default {
    name: 'doPost',
    data() {
        return {
            query: {
                pageIndex: 1,
                pageSize: 10,
                username: '',
                status: '2'
            },
            tableData: [],
            delList: [],
            pageTotal: 0
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            postList({
                status: parseInt(this.query.status),
                pageIndex: this.query.pageIndex,
                pageSize: this.query.pageSize
            }).then(res => {
                this.tableData = res.data.list;
                this.pageTotal = res.data.total;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 禁用操作
        handleDelete(index, row) {
            // 二次确认禁用
            this.$confirm('确定驳回这个帖子吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.loading();
                    doPost(row.id, 3).then(res => {
                        if (res.data) {
                            this.getData();
                            this.closeLoading();
                        } else this.closeLoading(1);
                    });
                })
                .catch(() => {});
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        handleSizeChange(val) {
            this.$set(this.query, 'pageSize', val);
            this.getData();
        },
        // 启用
        handleOn(index, row) {
            this.$confirm('确定要过审这个帖子吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.loading();
                    doPost(row.id, 1).then(res => {
                        if (res.data) {
                            this.getData();
                            this.closeLoading();
                        } else this.closeLoading(1);
                    });
                })
                .catch(() => {});
        },
        // fotmmater日期
        createDate(row, column, cellValue) {
            let date = new Date(row.createdat);
            const dateString = date.toLocaleDateString().replace(/\//g, '-') + ' ' + date.toLocaleTimeString();
            if (date != null) {
                return dateString;
            } else {
                return '暂无';
            }
        },
        imgList(row) {
            let arr = row.split(',');
            for (let i = 0; i < arr.length; i++) {
                arr[i] = '/api/uploads/' + arr[i];
            }
            return arr;
        },
        loading() {
            this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
        },
        closeLoading(flag, time) {
            time = time ? time : 600;
            setTimeout(() => {
                this.$loading().close();
                if (!flag) this.$message.success('操作成功');
                else this.$message.error('操作失败');
            }, time);
        }
    },
    computed: {}
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
