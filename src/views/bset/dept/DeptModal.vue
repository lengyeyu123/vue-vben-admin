<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';

  import { list, addOrUpdate } from '/@/api/bset/dept';
  import { getDeptTypeOptions } from '/@/enums/voteEnum';
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
        label: '部门名称',
        component: 'Input',
        required: true,
      },
      {
        field: 'parentId',
        label: '上级部门',
        component: 'TreeSelect',
        componentProps: {
          fieldNames: {
            label: 'name',
            key: 'id',
            value: 'id',
          },
        },
        required: true,
      },
      {
        field: 'type',
        label: '部门类型',
        component: 'RadioButtonGroup',
        componentProps: {
          options: getDeptTypeOptions(),
        },
        required: true,
      },
      {
        field: 'sort',
        label: '排序',
        component: 'InputNumber',
      },
      {
        label: '备注',
        field: 'remark',
        component: 'InputTextArea',
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
    const treeData = await list({});
    updateSchema({
      field: 'parentId',
      componentProps: { treeData },
    });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增部门' : '编辑部门'));

  const { createMessage } = useMessage();

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      addOrUpdate(values).then(() => {
        createMessage.success((isUpdate.value ? '编辑' : '新增') + '部门成功！');
        closeModal();
        emit('success');
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
