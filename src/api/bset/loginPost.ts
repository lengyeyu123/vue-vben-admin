import { defHttp } from '/@/utils/http/axios';

enum Api {
  List = '/loginPost/list',
  AddOrUpdate = '/loginPost/addOrUpdate',
  Del = '/loginPost/del',
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
