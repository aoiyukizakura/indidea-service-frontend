/*
 * @Author: Morpho Sylvie
 * @Date: 2020-03-08 21:12:05
 * @LastEditTime: 2020-03-10 16:19:26
 * @FilePath: \vue-manage-system\src\api\project.js
 * @Description:
 */
import request from '../utils/request';

export const projectList = query => {
    return request({
        url: '/api/admin/projectList',
        method: 'get',
        params: query
    });
};

export const doProject = (projectId, status) => {
    return request({
        url: '/api/admin/doProject',
        method: 'put',
        params: {
            projectId,
            status
        }
    });
};

export const reportList = query => {
    return request({
        url: '/api/admin/reportList',
        method: 'get',
        params: query
    });
};

export const doReport = (reportId, status) => {
    return request({
        url: '/api/admin/doReport',
        method: 'put',
        params: { reportId, status }
    });
};
