<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增岗位 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                tooltip: '编辑岗位',
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
                tooltip: '删除岗位',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <PostModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import dayjs from 'dayjs';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { list, del } from '/@/api/bset/post';

  import { useModal } from '/@/components/Modal';
  import PostModal from './PostModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload }] = useTable({
    title: '岗位列表',
    api: list,
    columns: [
      {
        title: '岗位名称',
        dataIndex: 'name',
        width: 160,
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
