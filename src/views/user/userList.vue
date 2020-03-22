<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 用户列表 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.status" placeholder="状态" class="handle-select mr10">
                    <el-option key="4" label="全部" value="3"></el-option>
                    <el-option key="2" label="正常" value="1"></el-option>
                    <el-option key="3" label="创意人" value="2"></el-option>
                    <el-option key="1" label="禁用" value="0"></el-option>
                </el-select>
                <el-input v-model="query.username" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="balance" width="85" label="账户余额">
                    <!-- <template slot-scope="scope">￥{{ scope.row.balance }}</template> -->
                </el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            v-if="scope.row.avatar"
                            class="table-td-thumb"
                            :src="'/api/uploads/' + scope.row.avatar"
                            :preview-src-list="['/api/uploads/' + scope.row.avatar]"
                        ></el-image>
                        <div v-else>
                            暂无头像
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱地址"></el-table-column>
                <el-table-column prop="website" label="个人网站">
                    <template slot-scope="scope">
                        {{ scope.row.website === null || scope.row.website === '' ? '无' : scope.row.website }}
                    </template>
                </el-table-column>
                <el-table-column prop="des" label="个人简介">
                    <template slot-scope="scope">
                        {{ scope.row.des === null || scope.row.des === '' ? '无' : scope.row.des }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag effect="dark" :type="scope.row.status === 2 ? 'success' : scope.row.status === 0 ? 'danger' : ''">{{
                            scope.row.status === 2 ? '创意人' : scope.row.status === 0 ? '禁用' : '正常'
                        }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createdat" label="注册时间" :formatter="createDate"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                            v-if="scope.row.status === 2"
                        >
                            取消创意人
                        </el-button>
                        <el-button
                            v-if="[1, 2].indexOf(scope.row.status) !== -1"
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >
                            禁用
                        </el-button>
                        <el-button v-else type="text" icon="el-icon-check" class="success" @click="handleOn(scope.$index, scope.row)">
                            启用
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
                    :page-sizes="[10,20,30,40]"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                    @size-change="handleSizeChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { userList, doUserOrAuth } from '../../api/user.js';
export default {
    name: 'userList',
    data() {
        return {
            query: {
                pageIndex: 1,
                pageSize: 10,
                username: '',
                status: '3'
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
            userList({
                username: this.query.username,
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
            this.$confirm('确定要禁用该用户吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.loading();
                    doUserOrAuth(row.id, 0).then(res => {
                        if (res.data) {
                            this.getData();
                            this.closeLoading();
                        } else this.closeLoading(1);
                    });
                })
                .catch(() => {});
        },
        // 取消认证操作
        handleEdit(index, row) {
            this.$confirm('确定要取消该用户的认证吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.loading();
                    doUserOrAuth(row.id, 1).then(res => {
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
            this.$confirm('确定要启用该用户吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.loading();
                    doUserOrAuth(row.id, 1).then(res => {
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
            let date = row.createdat;
            if (date != null) {
                return new Date(date).toLocaleDateString().replace(/\//g, '-');
            } else {
                return '暂无';
            }
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
