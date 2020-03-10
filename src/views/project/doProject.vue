<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 待审核项目列表 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.categoryId" placeholder="状态" class="handle-select mr10">
                    <el-option key="0" label="全部分类" value=""></el-option>
                    <el-option
                        v-for="(category, index) in categories"
                        :key="index + 1"
                        :label="category.name"
                        :value="category.id"
                    ></el-option>
                </el-select>
                <el-input v-model="query.username" placeholder="标题" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="title" label="项目标题"></el-table-column>
                <el-table-column prop="owner.username" width="90" label="发起人">
                    <!-- <template slot-scope="scope">￥{{ scope.row.balance }}</template> -->
                </el-table-column>
                <el-table-column label="封面(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            v-if="scope.row.pic"
                            class="table-td-thumb"
                            :src="'/api/uploads/' + scope.row.pic"
                            :preview-src-list="['/api/uploads/' + scope.row.pic]"
                        ></el-image>
                        <div v-else>
                            封面缺失
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="category.name" label="分类"></el-table-column>

                <el-table-column prop="targetdate" width="150" label="距目标日期(天)" sortable :formatter="targetDate">
                    <!-- <template slot-scope="scope">
                        {{ scope.row.website === null || scope.row.website === '' ? '无' : scope.row.website }}
                    </template> -->
                </el-table-column>

                <el-table-column prop="targetpoint" label="目标金额"> </el-table-column>

                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag effect="dark" :type="'warning'">
                            待审核
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createdat" label="建立时间" :formatter="createDate"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">
                            驳回
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
                    :total="pageTotal"
                    @current-change="handlePageChange"
                    @size-change="handleSizeChange"
                    :page-sizes="[10, 20, 30, 40]"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { projectList, doProject } from '../../api/project';
import { categoriesList } from '../../api/category';
export default {
    name: 'doProject',
    data() {
        return {
            query: {
                pageIndex: 1,
                pageSize: 10,
                username: '',
                status: '7',
                categoryId: ''
            },
            tableData: [],
            delList: [],
            pageTotal: 0,
            categories: []
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            projectList({
                title: this.query.username,
                status: parseInt(this.query.status),
                pageIndex: this.query.pageIndex,
                pageSize: this.query.pageSize,
                categoryId: this.query.categoryId
            }).then(res => {
                this.tableData = res.data.list;
                this.pageTotal = res.data.total;
            });
            categoriesList().then(res => {
                this.categories = res.data;
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
            this.$confirm('确定不通过这条项目吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.loading();
                    doProject(row.id, 3)
                        .then(res => {
                            if (res.data) {
                                this.getData();
                                this.closeLoading();
                            } else this.closeLoading(1);
                        })
                        .catch(e => {
                            this.closeLoading(1);
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
            this.$confirm('确定要通过该项目吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.loading();
                    doProject(row.id, 2).then(res => {
                        if (res.data) {
                            this.getData();
                            this.closeLoading();
                        } else this.closeLoading(1);
                    });
                })
                .catch(() => {});
        },
        handleDetail(index, row) {},
        // fotmmater日期
        createDate(row, column, cellValue) {
            let date = row.createdat;
            if (date != null) {
                return new Date(date).toLocaleDateString().replace(/\//g, '-');
            } else {
                return '暂无';
            }
        },
        process(row, column, cellValue) {
            let target = row.targetpoint;
            let get = row.getpoint;
            return parseInt((get / target) * 100) + '%';
        },
        targetDate(row, column, cellValue) {
            let targetdate = new Date(row.targetdate);
            let nowdate = new Date();
            let rest = targetdate.getTime() - nowdate.getTime();

            let day = parseInt(rest / (60 * 60 * 24 * 1000));

            if (targetdate != null) {
                return day < 0 ? '已过期' : day;
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
        },
        processPercent(row) {
            let target = row.targetpoint;
            let get = row.getpoint;
            return parseInt((get / target) * 100) > 100 ? 100 : parseInt((get / target) * 100);
            // return 100;
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
