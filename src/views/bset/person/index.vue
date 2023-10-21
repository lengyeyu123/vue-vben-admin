<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增人员 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                tooltip: '编辑人员',
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
                tooltip: '删除人员',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <PersonModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { h } from 'vue';
  import { Tag } from 'ant-design-vue';

  import dayjs from 'dayjs';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { list, del } from '/@/api/bset/person';

  import { useModal } from '/@/components/Modal';
  import PersonModal from './PersonModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getStatusOptions } from '/@/enums/voteEnum';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const query = route.query;

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload }] = useTable({
    title: query.projectName + ' - 人员列表',
    api: list,
    searchInfo: { projectId: query.projectId },
    columns: [
      {
        title: '人员名称',
        dataIndex: 'name',
        width: 160,
      },
      {
        title: '所属公司部门',
        dataIndex: 'deptId',
        width: 160,
        customRender: ({ record }) => {
          return record.dept.name;
        },
      },
      {
        title: '所属岗位',
        dataIndex: 'postIdList',
        width: 160,
        customRender: ({ record }) => {
          return record.postSet.map((post) => post.name).join(' ');
        },
      },
      {
        title: '排序',
        dataIndex: 'sort',
        width: 50,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 160,
        customRender: ({ record }) => {
          const status = record.status;
          const enable = ~~status === 0;
          const color = enable ? 'green' : 'red';
          const text = enable ? '启用' : '停用';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 180,
        format: (text) => {
          return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
    ],
    formConfig: {
      labelWidth: 120,
      baseColProps: { span: 6 },
      schemas: [
        {
          field: 'name',
          label: '人员名称',
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
      ],
    },
    pagination: false,
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
      // slots: { customRender: 'action' },
      fixed: undefined,
    },
  });

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
      projectId: query.projectId,
      projectName: query.projectName,
    });
  }

  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      projectId: query.projectId,
      projectName: query.projectName,
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
