<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 项目举报列表 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.status" placeholder="状态" class="handle-select mr10">
                    <el-option key="2" label="申请中" value="1"></el-option>
                    <el-option key="3" label="已处理" value="2"></el-option>
                    <el-option key="1" label="已忽略" value="0"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column label="被举报项目" prop="project.title" align="center"> </el-table-column>
                <el-table-column label="作者联系方式" prop="project.owner.email"></el-table-column>
                <el-table-column label="作者姓名" prop="project.owner.username"></el-table-column>
                <el-table-column label="被举报原因(悬停获取更多)" width="200" prop="content">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" title="被举报原因" width="300" trigger="hover" :content="scope.row.content">
                            <p 
                              style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                              slot="reference">
                                {{ scope.row.content }}
                            </p>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="举报人" prop="reporter.username"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag effect="dark" :type="scope.row.status === 2 ? 'success' : scope.row.status === 0 ? 'danger' : 'warning'">{{
                            scope.row.status === 2 ? '已处理该条信息' : scope.row.status === 0 ? '已忽略该条消息' : '待处理中'
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="申请时间" prop="createdat" sortable :formatter="createDate"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status == 1">
                            <el-button type="text" icon="el-icon-check" @click="handleOn(scope.$index, scope.row)">
                                处理
                            </el-button>
                            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">
                                忽略
                            </el-button>
                        </template>
                        <span v-else> {{scope.row.editby}} </span>
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
import { reportList, doReport } from '../../api/project.js';
export default {
    name: 'report',
    data() {
        return {
            query: {
                pageIndex: 1,
                pageSize: 10,
                username: '',
                status: '1'
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
            reportList({
                pageSize: this.query.pageSize,
                status: parseInt(this.query.status),
                pageIndex: this.query.pageIndex
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
        // 驳回操作
        handleDelete(index, row) {
            // 二次确认驳回操作
            this.$confirm('确定要忽略该条请求吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.loading();
                    doReport(row.id, 0).then(res => {
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
        },handleSizeChange(val) {
          this.$set(this.query, 'pageSize', val);
          this.getData();
        },
        // 通过
        handleOn(index, row) {
            this.$confirm('您是否已经处理完了该条项目？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.loading();
                    doReport(row.id, 2).then(res => {
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
