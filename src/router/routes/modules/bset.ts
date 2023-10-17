import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const bset: AppRouteModule = {
  path: '/bset',
  name: 'Bset',
  component: LAYOUT,
  redirect: '/bset/dept',
  meta: {
    orderNo: 1,
    icon: 'ion:settings-outline',
    title: '基础设置',
  },
  children: [
    {
      path: 'dept',
      name: 'Dept',
      meta: {
        title: '组织结构',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/bset/dept/index.vue'),
    },
    {
      path: 'login-post',
      name: 'LoginPost',
      meta: {
        title: '登录职务',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/bset/login-post/index.vue'),
    },
    {
      path: 'post',
      name: 'Post',
      meta: {
        title: '岗位管理',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/bset/post/index.vue'),
    },
    {
      path: 'project',
      name: 'Project',
      meta: {
        title: '项目管理',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/bset/project/index.vue'),
    },
    {
      path: 'question',
      name: 'Question',
      meta: {
        title: '题目管理',
        ignoreKeepAlive: true,
        hideMenu: true,
      },
      component: () => import('/@/views/bset/question/index.vue'),
    },
    {
      path: 'person',
      name: 'Person',
      meta: {
        title: '人员管理',
        ignoreKeepAlive: true,
        hideMenu: true,
      },
      component: () => import('/@/views/bset/person/index.vue'),
    },
    {
      path: 'relation',
      name: 'Relation',
      meta: {
        title: '评议关系管理',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/bset/relation/index.vue'),
    },
  ],
};

export default bset;
