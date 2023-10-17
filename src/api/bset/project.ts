import { defHttp } from '/@/utils/http/axios';

enum Api {
  List = '/project/list',
  ListWithRelation = '/project/listWithRelation',
  AddOrUpdate = '/project/addOrUpdate',
  Del = '/project/del',
  UpdateRelation = '/project/updateRelation',
}

export const list = (params) => {
  return defHttp.post({ url: Api.List, params });
};

export const listWithRelation = (params) => {
  return defHttp.post({ url: Api.ListWithRelation, params });
};

export const addOrUpdate = (params) => {
  return defHttp.post({ url: Api.AddOrUpdate, params });
};

export const del = (params) => {
  return defHttp.post({ url: Api.Del, params });
};

export const updateRelation = (params) => {
  return defHttp.post({ url: Api.UpdateRelation, params });
};
