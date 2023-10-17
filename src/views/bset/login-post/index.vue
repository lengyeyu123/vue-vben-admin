<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增登录职务 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                tooltip: '编辑登录职务',
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
                tooltip: '删除登录职务',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <LoginPostModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { h } from 'vue';
  import { Tag } from 'ant-design-vue';
  import dayjs from 'dayjs';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { list, del } from '/@/api/bset/loginPost';
  import { companyList } from '/@/api/bset/dept';

  import { useModal } from '/@/components/Modal';
  import LoginPostModal from './LoginPostModal.vue';
  import { getLoginPostLevelOptions } from '/@/enums/voteEnum';
  import { useMessage } from '/@/hooks/web/useMessage';

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload }] = useTable({
    title: '登录职务列表',
    api: list,
    columns: [
      {
        title: '登录职务名称',
        dataIndex: 'name',
        width: 160,
      },
      {
        title: '登录职务级别',
        dataIndex: 'level',
        width: 100,
        customRender: ({ record }) => {
          const level = record.level;
          let color = 'red';
          let text = '领导班子';
          if (level === 0) {
            color = 'red';
            text = '领导班子';
          } else if (level === 1) {
            color = 'yellow';
            text = '中层';
          } else {
            color = 'pink';
            text = '员工';
          }
          return h(Tag, { color }, () => text);
        },
      },
      {
        title: '所属公司',
        dataIndex: 'deptId',
        customRender: ({ record }) => {
          return record.dept.name;
        },
        width: 100,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 100,
        format: (text) => {
          return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
        },
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
          field: 'loginPostLevel',
          label: '职务级别',
          component: 'RadioButtonGroup',
          componentProps: {
            options: getLoginPostLevelOptions(),
          },
        },
        {
          field: 'deptId',
          label: '所属公司',
          component: 'ApiTreeSelect',
          componentProps: {
            api: companyList,
            resultField: 'list',
            labelField: 'name',
            valueField: 'id',
            childrenField: 'children',
          },
        },
      ],
    },
    striped: true,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: true,
    canResize: false,
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
    },
  });

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
    });
  }

  const { createMessage } = useMessage();

  function handleDelete(record: Recordable) {
    del({ id: record.id }).then(() => {
      reload();
      createMessage.success('删除成功');
    });
  }

  function handleSuccess() {
    reload();
  }
</script>
