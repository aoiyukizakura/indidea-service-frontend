<!--
 * @Author: Morpho Sylvie
 * @Date: 2020-03-08 20:18:23
 * @LastEditTime: 2020-03-12 17:24:47
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
            <div class="handle-box">
                <el-select v-model="query.status" placeholder="状态" class="handle-select mr10">
                    <el-option key="4" label="全部" value="4"></el-option>
                    <el-option key="2" label="正常" value="1"></el-option>
                    <el-option key="1" label="禁用" value="0"></el-option>
                </el-select>
                <!-- <el-input v-model="query.username" placeholder="用户名" class="handle-input mr10"></el-input> -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
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
                <el-table-column label="帖子评论" width="125" align="center">
                    <template slot-scope="scope">
                        <el-button type="info" @click="getComment(scope.row.id)"> 详情 </el-button>
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
                    <template slot-scope="scope">
                        <el-tag effect="dark" :type="scope.row.status === 1 ? 'success' : 'danger'">{{
                            scope.row.status === 0 ? '禁用' : '正常'
                        }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createdat" label="发帖时间" sortable :formatter="createDate"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.status === 1"
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

            <el-dialog title="评论详情" :visible.sync="dialogVisible" width="45%">
                <el-table :data="commentData" style="width: 100%">
                    <el-table-column prop="user.username" label="用户名"></el-table-column>
                    <el-table-column prop="comment" label="内容" width="180"></el-table-column>
                    <el-table-column prop="createdat" label="日期" width="180" :formatter="createDate"></el-table-column>
                    <el-table-column label="状态" align="center">
                        <template slot-scope="scope">
                            <el-tag effect="plain" :type="scope.row.status === 1 ? 'success' : 'danger'">{{
                                scope.row.status === 0 ? '禁用' : '正常'
                            }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                          <el-popconfirm v-if="scope.row.status === 1" title="你确认要禁用该条评论吗？" @onConfirm="doComment(scope.row, 0)">
                              <el-button type="text" class="red" slot="reference">禁用</el-button>
                          </el-popconfirm>
                          <el-popconfirm v-if="scope.row.status === 0" title="你确认要启用该条评论吗？" @onConfirm="doComment(scope.row, 1)">
                              <el-button type="text" class="success" slot="reference">启用</el-button>
                          </el-popconfirm>
                      </template>

                        <!-- <el-popconfirm title="你确认要禁用该条评论吗？">
                            <el-button type="text" class="red" slot="reference">禁用</el-button>
                        </el-popconfirm> -->
                    </el-table-column>
                </el-table>
            </el-dialog>

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
    name: 'postList',
    data() {
        return {
            query: {
                pageIndex: 1,
                pageSize: 10,
                username: '',
                status: '4'
            },
            tableData: [],
            delList: [],
            pageTotal: 0,
            commentData: [],
            dialogVisible: false
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
        getComment(postId) {
            this.loading();
            setTimeout(() => {
                postComment(postId)
                    .then(res => {
                        this.commentData = res.data;
                        this.$loading().close();
                        this.dialogVisible = true;
                    })
                    .catch(() => {});
            }, 500);
        },
        doComment(row, flag){
          doComment(row.id, flag).then(res => {
            if(res.data){
              this.getComment(row.post.id);
            }
          })
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 禁用操作
        handleDelete(index, row) {
            // 二次确认禁用
            this.$confirm('确定要禁用这个帖子吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.loading();
                    doPost(row.id, 0).then(res => {
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
            this.$confirm('确定要启用这个帖子吗？', '提示', {
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
    width: 80px;
    height: 80px;
}
.table-td-thumb /deep/ img {
    object-fit: cover !important;
}
</style>
