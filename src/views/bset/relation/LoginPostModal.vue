<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="请选择登录职务"
    @ok="handleSubmit"
    destroy-on-close
    default-fullscreen
  >
    <BasicTable @register="registerTable" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { h } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { companyList } from '/@/api/bset/dept';
  import dayjs from 'dayjs';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getLoginPostLevelOptions } from '/@/enums/voteEnum';
  import { all } from '/@/api/bset/loginPost';
  import { updateRelation } from '/@/api/bset/project';

  const emit = defineEmits(['register', 'success']);

  const [registerTable, { getSelectRowKeys }] = useTable({
    title: '登录职务列表',
    api: all,
    rowKey: 'id',
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
    rowSelection: {
      type: 'checkbox',
      preserveSelectedRowKeys: true,
    },
    pagination: false,
  });

  let projectIdArr: Array<Number> = [];
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false });
    projectIdArr = data?.projectIdArr;
  });

  const { createMessage } = useMessage();

  async function handleSubmit() {
    try {
      setModalProps({ confirmLoading: true });
      const loginPostIdArr = getSelectRowKeys();
      if (loginPostIdArr.length === 0) {
        createMessage.error('请选择登录职务进行关联！');
        return;
      }
      updateRelation({ loginPostIdArr, projectIdArr }).then(() => {
        closeModal();
        emit('success');
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
