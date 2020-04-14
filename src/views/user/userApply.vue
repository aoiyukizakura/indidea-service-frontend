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
                    <el-option key="2" label="申请中" value="1"></el-option>
                    <el-option key="3" label="已通过" value="2"></el-option>
                    <el-option key="1" label="已驳回" value="0"></el-option>
                </el-select>
                <template v-if="query.status !== '1' && query.status !== '3'">
                    <el-input v-model="query.username" placeholder="按照通过的管理员搜索" class="handle-input mr10"></el-input>
                </template>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="user.username" label="用户名"></el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            v-if="scope.row.user.avatar"
                            class="table-td-thumb"
                            :src="'/api/uploads/' + scope.row.user.avatar"
                            :preview-src-list="['/api/uploads/' + scope.row.user.avatar]"
                        ></el-image>
                        <div v-else>
                            暂无头像
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="user.email" label="邮箱地址"></el-table-column>
                <el-table-column prop="user.website" label="个人网站">
                    <template slot-scope="scope">
                        {{ scope.row.user.website === null || scope.row.user.website === '' ? '无' : scope.row.user.website }}
                    </template>
                </el-table-column>
                <el-table-column prop="user.des" label="个人简介">
                    <template slot-scope="scope">
                        {{ scope.row.user.des === null || scope.row.user.des === '' ? '无' : scope.row.user.des }}
                    </template>
                </el-table-column>
                <el-table-column prop="user.balance" width="85" label="账户余额">
                    <!-- <template slot-scope="scope">￥{{ scope.row.balance }}</template> -->
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag effect="dark" :type="scope.row.status === 2 ? 'success' : scope.row.status === 0 ? 'danger' : 'warning'">{{
                            scope.row.status === 2 ? '已通过' : scope.row.status === 0 ? '已驳回' : '申请中'
                        }}</el-tag>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="editby" label="审核人">
                    <template slot-scope="scope">
                        {{ scope.row.editby === null || scope.row.editby === '' ? '无' : scope.row.editby }}
                    </template>
                </el-table-column> -->
                <el-table-column width="200" prop="createdat" label="申请时间" :formatter="createDate"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status == 1">
                            <el-button type="text" icon="el-icon-check" @click="handleOn(scope.$index, scope.row)">
                                通过
                            </el-button>
                            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">
                                不通过
                            </el-button>
                        </template>
                        <el-popover
                            v-else
                            placement="top"
                            width="240"
                            trigger="click"
                        >
                            <el-table :data="[scope.row]">
                                <el-table-column prop="editby" label="审核人"></el-table-column>
                                <el-table-column width="160" label="审核时间" :formatter="updateDate"></el-table-column>
                            </el-table>
                            <el-button type="text" icon="el-icon-lx-text" style="color:#909399;" slot="reference">
                                详情
                            </el-button>
                        </el-popover>
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
import { fetchData } from '../../api/index';
import { userList, doUserOrAuth, userApplyList, doUserApply } from '../../api/user.js';
export default {
    name: 'userApply',
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
            userApplyList({
                admin: this.query.username,
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
            this.$confirm('确定要驳回该条请求吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.loading();
                    doUserApply(row.id, 0).then(res => {
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
        // 通过
        handleOn(index, row) {
            this.$confirm('确定要通过该条申请吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.loading();
                    doUserApply(row.id, 2).then(res => {
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
                return new Date(date).toLocaleString().replace(/\//g, '-');
            } else {
                return '暂无';
            }
        },
        updateDate(row, column, cellValue) {
            let date = row.updatedat;
            if (date != null) {
                return new Date(date).toLocaleString().replace(/\//g, '-');
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
