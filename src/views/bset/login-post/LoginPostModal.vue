<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { getLoginPostLevelOptions } from '/@/enums/voteEnum';
  import { companyList } from '/@/api/bset/dept';
  import { addOrUpdate } from '/@/api/bset/loginPost';
  import { useMessage } from '/@/hooks/web/useMessage';

  const emit = defineEmits(['register', 'success']);

  const isUpdate = ref(true);

  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
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
        label: '名称',
        component: 'Input',
        required: true,
      },
      {
        field: 'level',
        label: '职务级别',
        component: 'RadioButtonGroup',
        componentProps: {
          options: getLoginPostLevelOptions(),
        },
        required: true,
      },
      {
        field: 'deptId',
        label: '所属公司',
        component: 'TreeSelect',
        required: true,
        componentProps: {
          fieldNames: {
            label: 'name',
            key: 'id',
            value: 'id',
          },
        },
      },
      {
        field: 'sort',
        label: '排序',
        component: 'InputNumber',
        defaultValue: 0,
        componentProps: {
          min: 0,
        },
      },
    ],
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      setFieldsValue({
        ...data.record,
      });
    }
    const treeData = await companyList({});
    updateSchema({
      field: 'deptId',
      componentProps: { treeData },
    });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增登录职务' : '编辑登录职务'));

  const { createMessage } = useMessage();

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      addOrUpdate(values).then(() => {
        createMessage.success((isUpdate.value ? '编辑' : '新增') + '登录职务成功！');
        closeModal();
        emit('success');
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
