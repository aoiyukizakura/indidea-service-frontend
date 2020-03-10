<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 项目列表 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.status" placeholder="状态" class="handle-select mr10">
                    <el-option key="1" label="全部状态" value="8"></el-option>
                    <el-option key="2" label="正常发布" value="1"></el-option>
                    <el-option key="3" label="已禁用" value="4"></el-option>
                    <el-option key="4" label="当前推荐" value="5"></el-option>
                </el-select>
                <el-select v-model="query.categoryId" placeholder="状态" class="handle-select mr10">
                    <el-option key="0" label="全部分类" value=""></el-option>
                    <el-option v-for="(category, index) in categories" :key="index+1" :label="category.name" :value="category.id"></el-option>
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

                <el-table-column prop="targetdate" width="150" label="距截止日期(天)" sortable :formatter="targetDate">
                    <!-- <template slot-scope="scope">
                        {{ scope.row.website === null || scope.row.website === '' ? '无' : scope.row.website }}
                    </template> -->
                </el-table-column>

                <el-table-column prop="des" label="进度" :formatter="process">
                    <template slot-scope="scope">
                        <el-progress
                            :show-text="false"
                            :color="processPercent(scope.row) === 100 ? '#13ce66' : '#20a0ff'"
                            :percentage="processPercent(scope.row)"
                        >
                        </el-progress>
                    </template>
                </el-table-column>

                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag effect="dark" :type="scope.row.status === 5 ? 'success' : scope.row.status === 4 ? 'danger' : ''">{{
                            scope.row.status === 5 ? '精选项目' : scope.row.status === 4 ? '禁用' : '正常'
                        }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createdat" label="建立时间" :formatter="createDate"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                            v-if="
                                scope.row.status !== 5 && scope.row.status != 4 && targetDate(scope.row) !== 0 && targetDate(scope.row) >= 0
                            "
                        >
                            设置为精选项目
                        </el-button>
                        <el-button
                            v-if="scope.row.status === 1"
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >
                            禁用
                        </el-button>
                        <el-button
                            v-if="scope.row.status === 4"
                            type="text"
                            icon="el-icon-check"
                            class="success"
                            @click="handleOn(scope.$index, scope.row)"
                        >
                            启用
                        </el-button>
                        <div v-if="scope.row.status === 5">无</div>
                        <!-- <el-button type="text" icon="el-icon-lx-text" class="success" @click="handleDetail(scope.$index, scope.row)">
                            详情
                        </el-button> -->
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
    name: 'projectList',
    data() {
        return {
            query: {
                pageIndex: 1,
                pageSize: 10,
                username: '',
                status: '8',
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
            this.$confirm('确定要禁用该项目吗？请谨慎操作。', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.loading();
                    doProject(row.id, 4)
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
        // 设置为精选项目
        handleEdit(index, row) {
            this.$confirm('确定要将该项目设置成精选项目吗？当前的精选项目将会被该项目代替。', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.loading();
                    doProject(row.id, 5).then(res => {
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
            this.$confirm('确定要启用该项目吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.loading();
                    doProject(row.id, 1).then(res => {
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
