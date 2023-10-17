import { defHttp } from '/@/utils/http/axios';

enum Api {
  List = '/person/list',
  AddOrUpdate = '/person/addOrUpdate',
  CompanyList = '/person/companyList',
  Del = '/person/del',
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
