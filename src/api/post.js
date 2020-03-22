/*
 * @Author: Morpho Sylvie
 * @Date: 2020-03-12 11:07:16
 * @LastEditTime: 2020-03-12 11:12:53
 * @FilePath: \vue-manage-system\src\api\post.js
 * @Description:
 */
import request from '../utils/request';

export const postList = query => {
    return request({
        url: '/api/admin/postList',
        method: 'get',
        params: query
    });
};

export const doPost = (postId, status) => {
    return request({
        url: '/api/admin/doPost',
        method: 'put',
        params: {
            postId,
            status
        }
    });
};

export const postComment = postId => {
    return request({
        url: '/api/admin/postComment',
        method: 'get',
        params: { postId }
    });
};

export const doComment = (commentId, status) => {
    return request({
        url: '/api/admin/doComment',
        method: 'put',
        params: {
            commentId,
            status
        }
    });
};
