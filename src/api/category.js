/*
 * @Author: Morpho Sylvie
 * @Date: 2020-03-10 13:40:18
 * @LastEditTime: 2020-03-10 13:41:33
 * @FilePath: \vue-manage-system\src\api\category.js
 * @Description:
 */
import request from '../utils/request';

export const categoriesList = () => {
    return request({
        url: '/api/admin/categoriesList',
        method: 'get'
    });
};
