import { defHttp } from '/@/utils/http/axios';

enum Api {
  List = '/post/list',
  AddOrUpdate = '/post/addOrUpdate',
  Del = '/post/del',
  All = '/post/all',
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

export const all = (params) => {
  return defHttp.post({ url: Api.All, params });
};
