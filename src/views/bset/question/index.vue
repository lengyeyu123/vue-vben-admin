<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增试题 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                tooltip: '编辑试题',
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
                tooltip: '删除试题',
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <QuestionModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import dayjs from 'dayjs';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { list, del } from '/@/api/bset/question';

  import { useModal } from '/@/components/Modal';
  import QuestionModal from './QuestionModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getStatusOptions } from '/@/enums/voteEnum';

  import { h } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const query = route.query;

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload }] = useTable({
    title: query.projectName + ' - 试题列表',
    api: list,
    pagination: false,
    searchInfo: {
      projectId: query.projectId,
    },
    columns: [
      {
        title: '内容',
        dataIndex: 'content',
        width: 100,
      },
      {
        title: '标准',
        dataIndex: 'standard',
        width: 200,
      },
      {
        title: '分类',
        dataIndex: 'category',
        width: 100,
      },
      {
        title: '选项',
        dataIndex: 'optionArr',
        width: 200,
        customRender: ({ record }) => {
          return record.optionArr;
        },
      },
      {
        title: '分值',
        dataIndex: 'score',
        width: 60,
      },
      {
        title: '排序',
        dataIndex: 'sort',
        width: 60,
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
          field: 'content',
          label: '内容',
          component: 'Input',
        },
        {
          field: 'standard',
          label: '标准',
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
    striped: true,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: true,
    canResize: false,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
    },
  });

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
      projectId: query.projectId,
    });
  }

  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
      projectId: query.projectId,
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
