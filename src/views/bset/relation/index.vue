<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleSet"> 设置评议关系 </a-button>
      </template>
    </BasicTable>
    <LoginPostModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import dayjs from 'dayjs';

  import { BasicTable, useTable } from '/@/components/Table';
  import { listWithRelation } from '/@/api/bset/project';

  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getStatusOptions } from '/@/enums/voteEnum';

  import LoginPostModal from './LoginPostModal.vue';

  import { h } from 'vue';
  import { Tag } from 'ant-design-vue';

  const { createMessage } = useMessage();

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, getSelectRowKeys }] = useTable({
    title: '项目列表',
    api: listWithRelation,
    rowKey: 'id',
    columns: [
      {
        title: '项目名称',
        dataIndex: 'name',
        width: 160,
      },
      {
        title: '项目类型',
        dataIndex: 'type',
        width: 80,
        customRender: ({ text }) => {
          return Number(text) === 0 ? '组织' : '人员';
        },
      },
      {
        title: '分类',
        dataIndex: 'category',
        width: 100,
        customRender: ({ record }) => {
          if (record.category === 0) {
            return '党组织';
          } else if (record.category === 1) {
            return '领导班子';
          } else if (record.category === 2) {
            return '管理人员';
          } else if (record.category === 3) {
            return '技术人员';
          }
        },
      },
      {
        title: '参与评议职务',
        dataIndex: 'loginPostList',
        customRender: ({ record }) => {
          return record.loginPostList
            .map((item) => item.name + '(' + item.dept.name + ')')
            .join(' ');
        },
      },
      {
        title: '关联公司',
        dataIndex: 'deptSet',
        width: 200,
        customRender: ({ record }) => {
          return record.deptSet.map((item) => item.name).join(' ');
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 80,
        customRender: ({ record }) => {
          const status = record.status;
          const enable = ~~status === 0;
          const color = enable ? 'green' : 'red';
          const text = enable ? '启用' : '停用';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 200,
      },
    ],
    formConfig: {
      labelWidth: 120,
      baseColProps: { span: 6 },
      showAdvancedButton: false,
      actionColOptions: { span: 6 },
      schemas: [
        {
          field: 'name',
          label: '名称',
          component: 'Input',
        },
        {
          field: 'status',
          label: '状态',
          component: 'RadioButtonGroup',
          componentProps: {
            options: getStatusOptions(),
          },
        },
        {
          field: 'createTime',
          label: '创建年份',
          component: 'DatePicker',
          defaultValue: dayjs(),
          componentProps: {
            picker: 'year',
          },
        },
      ],
    },
    rowSelection: { type: 'checkbox' },
    striped: true,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: true,
    canResize: false,
  });

  function handleSet() {
    const projectIdArr = getSelectRowKeys();
    if (projectIdArr.length === 0) {
      createMessage.error('请选择要操作的数据');
      return;
    }

    openModal(true, {
      projectIdArr,
    });
  }

  function handleSuccess() {
    createMessage.success('设置成功');
    reload();
  }
</script>
