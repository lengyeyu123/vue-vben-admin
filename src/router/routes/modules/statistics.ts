import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const statistics: AppRouteModule = {
  path: '/statistics',
  name: 'Statistics',
  component: LAYOUT,
  redirect: '/statistics/user',
  meta: {
    orderNo: 2,
    icon: 'wpf:statistics',
    title: '统计信息',
  },
  children: [
    {
      path: 'user',
      name: 'User',
      meta: {
        title: '参与用户',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/statistics/user/index.vue'),
    },
  ],
};

export default statistics;
