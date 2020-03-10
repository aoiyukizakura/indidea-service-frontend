/*
 * @Author: Morpho Sylvie
 * @Date: 2020-03-08 21:11:48
 * @LastEditTime: 2020-03-09 16:23:00
 * @FilePath: \vue-manage-system\src\api\user.js
 * @Description:
 */
import request from '../utils/request';

export const userList = query => {
    return request({
        url: '/api/admin/userList',
        method: 'get',
        params: query
    });
};

export const doUserOrAuth = (userId, status) => {
    return request({
        url: '/api/admin/doUserOrAuth',
        method: 'put',
        params: {
            userId,
            status
        }
    });
};
export const doUserApply = (applyId, status) => {
    return request({
        url: '/api/admin/doApply',
        method: 'put',
        params: {
            status,
            applyId
        }
    });
};

export const userApplyList = query => {
    return request({
        url: '/api/admin/userApplyList',
        method: 'get',
        params: query
    });
};
