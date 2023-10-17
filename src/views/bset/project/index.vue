<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增项目 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                tooltip: '编辑项目',
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
                tooltip: '删除项目',
              },
              {
                divider: true,
                tooltip: '管理试题',
                icon: 'uil:file-question-alt',
                onClick: handleManageQuestion.bind(null, record),
              },
              {
                tooltip: '管理人员',
                icon: 'fluent:person-32-regular',
                onClick: handleManagePerson.bind(null, record),
                ifShow: record.type === 1,
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <ProjectModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import dayjs from 'dayjs';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { list, del } from '/@/api/bset/project';

  import { useModal } from '/@/components/Modal';
  import ProjectModal from './ProjectModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getStatusOptions } from '/@/enums/voteEnum';

  import { h } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { useRouter } from 'vue-router';

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload }] = useTable({
    title: '项目列表',
    api: list,
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
        title: '关联公司',
        dataIndex: 'deptSet',
        width: 200,
        customRender: ({ record }) => {
          return record.deptSet.map((item) => item.name).join(' ');
        },
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
        width: 200,
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
          componentProps: {
            picker: 'year',
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

  const router = useRouter();

  function handleManagePerson(record: Recordable) {
    router.push({
      path: '/bset/person',
      query: { projectId: record.id, projectName: record.name },
    });
  }

  function handleManageQuestion(record: Recordable) {
    router.push({
      path: '/bset/question',
      query: { projectId: record.id, projectName: record.name },
    });
  }
</script>
