<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增部门 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                tooltip: '编辑部门',
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
                ifShow: record.parentId !== 0,
                tooltip: '删除部门',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <DeptModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { h } from 'vue';
  import { Tag } from 'ant-design-vue';

  import dayjs from 'dayjs';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { list, del } from '/@/api/bset/dept';

  import { useModal } from '/@/components/Modal';
  import DeptModal from './DeptModal.vue';
  import { getDeptTypeOptions } from '/@/enums/voteEnum';
  import { useMessage } from '/@/hooks/web/useMessage';

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload }] = useTable({
    title: '部门列表',
    api: list,
    columns: [
      {
        title: '部门名称',
        dataIndex: 'name',
        width: 160,
        align: 'left',
      },
      {
        title: '排序',
        dataIndex: 'sort',
        width: 50,
      },
      {
        title: '类型',
        dataIndex: 'type',
        customRender: ({ record }) => {
          const type = record.type;
          let color = 'green';
          let text = '本部';
          if (type === 0) {
            color = 'green';
            text = '本部';
          } else if (type === 1) {
            color = 'yellow';
            text = '子公司';
          } else {
            color = 'blue';
            text = '部门';
          }
          return h(Tag, { color }, () => text);
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
          label: '部门名称',
          component: 'Input',
        },
        {
          field: 'type',
          label: '类型',
          component: 'RadioButtonGroup',
          defaultValue: undefined,
          componentProps: {
            options: getDeptTypeOptions(),
          },
        },
      ],
    },
    pagination: false,
    striped: true,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
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
