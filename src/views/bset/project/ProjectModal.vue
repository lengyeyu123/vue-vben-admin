<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { addOrUpdate } from '/@/api/bset/project';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    getProjectTypeOptions,
    getProjectCategoryOptions,
    getStatusOptions,
  } from '/@/enums/voteEnum';
  import { companyList } from '/@/api/bset/dept';

  import { TreeSelect } from 'ant-design-vue';

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
        label: '项目名称',
        component: 'Input',
        required: true,
      },
      {
        field: 'type',
        label: '项目类型',
        component: 'RadioButtonGroup',
        componentProps: {
          options: getProjectTypeOptions(),
        },
        required: true,
      },
      {
        field: 'category',
        label: '分类',
        component: 'RadioButtonGroup',
        componentProps: {
          options: getProjectCategoryOptions(),
        },
        required: true,
      },
      {
        field: 'companyIds',
        label: '关联公司',
        component: 'ApiTreeSelect',
        required: true,
        componentProps: {
          api: companyList,
          resultField: 'list',
          labelField: 'name',
          valueField: 'id',
          childrenField: 'children',
          multiple: true,
          showCheckedStrategy: TreeSelect.SHOW_ALL,
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
        field: 'remark',
        label: '备注',
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
      const companyIds = data.record.deptSet.map((item) => item.id);
      setFieldsValue({ companyIds });
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增项目' : '编辑项目'));

  const { createMessage } = useMessage();

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      addOrUpdate(values).then(() => {
        createMessage.success((isUpdate.value ? '编辑' : '新增') + '项目成功！');
        closeModal();
        emit('success');
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
