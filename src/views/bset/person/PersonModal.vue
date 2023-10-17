<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    destroy-on-close
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';

  import { useMessage } from '/@/hooks/web/useMessage';
  import { addOrUpdate } from '/@/api/bset/person';
  import { list } from '/@/api/bset/dept';
  import { all } from '/@/api/bset/post';
  import { getStatusOptions } from '/@/enums/voteEnum';

  const emit = defineEmits(['register', 'success']);

  const isUpdate = ref(true);

  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: [
      {
        field: 'id',
        label: 'id',
        component: 'Input',
        show: false,
      },
      {
        field: 'name',
        label: '人员名称',
        component: 'Input',
        required: true,
      },
      {
        field: 'projectId',
        label: '所属项目',
        component: 'Input',
        show: false,
      },
      {
        field: 'projectName',
        label: '所属项目',
        component: 'Input',
        componentProps: {
          disabled: true,
        },
        required: true,
      },
      {
        field: 'deptId',
        label: '所属部门',
        component: 'ApiTreeSelect',
        componentProps: {
          api: list,
          resultField: 'list',
          labelField: 'name',
          valueField: 'id',
          childrenField: 'children',
        },
      },
      {
        field: 'postIdList',
        label: '所属岗位',
        component: 'ApiSelect',
        componentProps: {
          api: all,
          resetFields: 'list',
          labelField: 'name',
          valueField: 'id',
          mode: 'multiple',
        },
      },
      {
        field: 'sort',
        label: '排序',
        component: 'InputNumber',
        defaultValue: 0,
      },
      {
        field: 'status',
        label: '状态',
        component: 'RadioButtonGroup',
        defaultValue: 0,
        componentProps: {
          options: getStatusOptions(),
        },
        required: true,
      },
      {
        label: '备注',
        field: 'remark',
        component: 'InputTextArea',
      },
    ],
    showActionButtonGroup: false,
  });

  let projectId = -1;
  let projectName = '';
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    projectId = data.projectId;
    projectName = data.projectName;

    setFieldsValue({
      projectId,
      projectName,
    });

    if (unref(isUpdate)) {
      setFieldsValue({
        ...data.record,
      });
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增人员' : '编辑人员'));

  const { createMessage } = useMessage();

  async function handleSubmit() {
    try {
      const values = await validate();
      values.projectId = projectId;
      setModalProps({ confirmLoading: true });
      addOrUpdate(values).then(() => {
        createMessage.success((isUpdate.value ? '编辑' : '新增') + '人员成功！');
        closeModal();
        emit('success');
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
