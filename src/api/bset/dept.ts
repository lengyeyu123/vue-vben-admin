import { defHttp } from '/@/utils/http/axios';

enum Api {
  List = '/dept/list',
  AddOrUpdate = '/dept/addOrUpdate',
  CompanyList = '/dept/companyList',
  Del = '/dept/del',
}

export const list = (params) => {
  return defHttp.post({ url: Api.List, params });
};

export const addOrUpdate = (params) => {
  return defHttp.post({ url: Api.AddOrUpdate, params });
};

export const companyList = (params) => {
  return defHttp.post({ url: Api.CompanyList, params });
};

export const del = (params) => {
  return defHttp.post({ url: Api.Del, params });
};
