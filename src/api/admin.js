/*
 * @Author: Morpho Sylvie
 * @Date: 2020-03-08 21:12:17
 * @LastEditTime: 2020-03-09 14:52:32
 * @FilePath: \vue-manage-system\src\api\admin.js
 * @Description:
 */

import request from '../utils/request';

export const login = data => {
    return request({
        url: '/api/admin/login',
        method: 'post',
        data: data
    });
};
