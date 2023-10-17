import { defHttp } from '/@/utils/http/axios';

enum Api {
  List = '/question/list',
  AddOrUpdate = '/question/addOrUpdate',
  CompanyList = '/question/companyList',
  Del = '/question/del',
}

export const list = (params) => {
  return defHttp.post({ url: Api.List, params });
};

export const addOrUpdate = (params) => {
  return defHttp.post({ url: Api.AddOrUpdate, params });
};

export const del = (params) => {
  return defHttp.post({ url: Api.Del, params });
};
