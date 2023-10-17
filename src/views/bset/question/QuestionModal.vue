<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    :width="600"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { addOrUpdate } from '/@/api/bset/question';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getStatusOptions, getSystemYesOrNoOptions } from '/@/enums/voteEnum';

  const emit = defineEmits(['register', 'success']);

  const isUpdate = ref(true);

  const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
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
        field: 'content',
        label: '试题内容',
        component: 'Input',
      },
      {
        field: 'standard',
        label: '标准',
        component: 'InputTextArea',
        required: true,
      },
      {
        field: 'category',
        label: '分类',
        component: 'Input',
        required: true,
      },
      {
        field: 'objectiveFlag',
        label: '是否客观题',
        component: 'RadioButtonGroup',
        required: true,
        defaultValue: 1,
        componentProps: ({ formModel }) => {
          return {
            options: getSystemYesOrNoOptions(),
            onChange: (e) => {
              if (e === 0) {
                formModel.score = 0;
                updateSchema({ field: 'score', componentProps: { readonly: true } });
              } else {
                updateSchema({ field: 'score', componentProps: { readonly: false } });
              }
            },
          };
        },
      },
      {
        field: 'score',
        label: '分值',
        component: 'InputNumber',
        required: true,
        defaultValue: 0,
        helpMessage: '试题为非客观题是分值总为0，试题为客观题时分值请设置为0-100之间的整数',
        componentProps: {
          min: 0,
          max: 100,
        },
      },
      {
        field: 'optionA',
        label: '启用选项A',
        component: 'Checkbox',
        colProps: { span: 6 },
        componentProps: ({ formModel }) => {
          return {
            options: [{ label: 'A', value: 'A' }],
            onChange: (e) => {
              if ((typeof e === 'boolean' && e) || e.target.checked) {
                updateSchema([
                  { field: 'ALabel', componentProps: { readonly: false }, required: true },
                  { field: 'ARatio', componentProps: { readonly: false }, required: true },
                ]);
              } else {
                formModel.ALabel = undefined;
                formModel.ARatio = undefined;
                updateSchema([
                  { field: 'ALabel', componentProps: { readonly: true }, required: false },
                  { field: 'ARatio', componentProps: { readonly: true }, required: false },
                ]);
              }
            },
          };
        },
      },
      {
        field: 'ALabel',
        label: 'A选项内容',
        component: 'Input',
        colProps: { span: 8 },
        componentProps: {
          readonly: false,
        },
      },
      {
        field: 'ARatio',
        label: 'A得分比例',
        component: 'InputNumber',
        colProps: { span: 8 },
        componentProps: {
          readonly: false,
        },
      },

      {
        field: 'optionB',
        label: '启用选项B',
        component: 'Checkbox',
        colProps: { span: 6 },
        componentProps: ({ formModel }) => {
          return {
            options: [{ label: 'B', value: 'B' }],
            onChange: (e) => {
              if ((typeof e === 'boolean' && e) || e.target.checked) {
                updateSchema([
                  { field: 'BLabel', componentProps: { readonly: false }, required: true },
                  { field: 'BRatio', componentProps: { readonly: false }, required: true },
                ]);
              } else {
                formModel.BLabel = undefined;
                formModel.BRatio = undefined;
                updateSchema([
                  { field: 'BLabel', componentProps: { readonly: true }, required: false },
                  { field: 'BRatio', componentProps: { readonly: true }, required: false },
                ]);
              }
            },
          };
        },
      },
      {
        field: 'BLabel',
        label: 'B选项内容',
        component: 'Input',
        colProps: { span: 8 },
        componentProps: {
          readonly: false,
        },
      },
      {
        field: 'BRatio',
        label: 'B得分比例',
        component: 'InputNumber',
        colProps: { span: 8 },
        componentProps: {
          readonly: true,
        },
      },

      {
        field: 'optionC',
        label: '启用选项C',
        component: 'Checkbox',
        colProps: { span: 6 },
        componentProps: ({ formModel }) => {
          return {
            options: [{ label: 'C', value: 'C' }],
            onChange: (e) => {
              if ((typeof e === 'boolean' && e) || e.target.checked) {
                updateSchema([
                  { field: 'CLabel', componentProps: { readonly: false }, required: true },
                  { field: 'CRatio', componentProps: { readonly: false }, required: true },
                ]);
              } else {
                formModel.CLabel = undefined;
                formModel.CRatio = undefined;
                updateSchema([
                  { field: 'CLabel', componentProps: { readonly: true }, required: false },
                  { field: 'CRatio', componentProps: { readonly: true }, required: false },
                ]);
              }
            },
          };
        },
      },
      {
        field: 'CLabel',
        label: 'C选项内容',
        component: 'Input',
        colProps: { span: 8 },
        componentProps: {
          readonly: true,
        },
      },
      {
        field: 'CRatio',
        label: 'C得分比例',
        component: 'InputNumber',
        colProps: { span: 8 },
        componentProps: {
          readonly: true,
        },
      },

      {
        field: 'optionD',
        label: '启用选项D',
        component: 'Checkbox',
        colProps: { span: 6 },
        componentProps: ({ formModel }) => {
          return {
            options: [{ label: 'D', value: 'D' }],
            onChange: (e) => {
              if ((typeof e === 'boolean' && e) || e.target.checked) {
                updateSchema([
                  { field: 'DLabel', componentProps: { readonly: false }, required: true },
                  { field: 'DRatio', componentProps: { readonly: false }, required: true },
                ]);
              } else {
                formModel.DLabel = undefined;
                formModel.DRatio = undefined;
                updateSchema([
                  { field: 'DLabel', componentProps: { readonly: true }, required: false },
                  { field: 'DRatio', componentProps: { readonly: true }, required: false },
                ]);
              }
            },
          };
        },
      },
      {
        field: 'DLabel',
        label: 'D选项内容',
        component: 'Input',
        colProps: { span: 8 },
        componentProps: {
          readonly: true,
        },
      },
      {
        field: 'DRatio',
        label: 'D得分比例',
        component: 'InputNumber',
        colProps: { span: 8 },
        componentProps: {
          readonly: true,
        },
      },

      {
        field: 'optionE',
        label: '启用选项E',
        component: 'Checkbox',
        colProps: { span: 6 },
        componentProps: ({ formModel }) => {
          return {
            options: [{ label: 'E', value: 'E' }],
            onChange: (e) => {
              if ((typeof e === 'boolean' && e) || e.target.checked) {
                updateSchema([
                  { field: 'ELabel', componentProps: { readonly: false }, required: true },
                  { field: 'ERatio', componentProps: { readonly: false }, required: true },
                ]);
              } else {
                formModel.ELabel = undefined;
                formModel.ERatio = undefined;
                updateSchema([
                  { field: 'ELabel', componentProps: { readonly: true }, required: false },
                  { field: 'ERatio', componentProps: { readonly: true }, required: false },
                ]);
              }
            },
          };
        },
      },
      {
        field: 'ELabel',
        label: 'E选项内容',
        component: 'Input',
        colProps: { span: 8 },
        componentProps: {
          readonly: false,
        },
      },
      {
        field: 'ERatio',
        label: 'E得分比例',
        component: 'InputNumber',
        colProps: { span: 8 },
        componentProps: {
          readonly: true,
        },
      },

      {
        field: 'optionF',
        label: '启用选项F',
        component: 'Checkbox',
        colProps: { span: 6 },
        componentProps: ({ formModel }) => {
          return {
            options: [{ label: 'F', value: 'F' }],
            onChange: (e) => {
              if ((typeof e === 'boolean' && e) || e.target.checked) {
                updateSchema([
                  { field: 'FLabel', componentProps: { readonly: false }, required: true },
                  { field: 'FRatio', componentProps: { readonly: false }, required: true },
                ]);
              } else {
                formModel.FLabel = undefined;
                formModel.FRatio = undefined;
                updateSchema([
                  { field: 'FLabel', componentProps: { readonly: true }, required: false },
                  { field: 'FRatio', componentProps: { readonly: true }, required: false },
                ]);
              }
            },
          };
        },
      },
      {
        field: 'FLabel',
        label: 'F选项内容',
        component: 'Input',
        colProps: { span: 8 },
        componentProps: {
          readonly: true,
        },
      },
      {
        field: 'FRatio',
        label: 'F得分比例',
        component: 'InputNumber',
        colProps: { span: 8 },
        componentProps: {
          readonly: true,
        },
      },

      {
        field: 'optionG',
        label: '启用选项G',
        component: 'Checkbox',
        colProps: { span: 6 },
        componentProps: ({ formModel }) => {
          return {
            options: [{ label: 'G', value: 'G' }],
            onChange: (e) => {
              if ((typeof e === 'boolean' && e) || e.target.checked) {
                updateSchema([
                  { field: 'GLabel', componentProps: { readonly: false }, required: true },
                  { field: 'GRatio', componentProps: { readonly: false }, required: true },
                ]);
              } else {
                formModel.GLabel = undefined;
                formModel.GRatio = undefined;
                updateSchema([
                  { field: 'GLabel', componentProps: { readonly: true }, required: false },
                  { field: 'GRatio', componentProps: { readonly: true }, required: false },
                ]);
              }
            },
          };
        },
      },
      {
        field: 'GLabel',
        label: 'G选项内容',
        component: 'Input',
        colProps: { span: 8 },
        componentProps: {
          readonly: true,
        },
      },
      {
        field: 'GRatio',
        label: 'G得分比例',
        component: 'InputNumber',
        colProps: { span: 8 },
        componentProps: {
          readonly: true,
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

  let projectId = -1;
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    projectId = data?.projectId;

    if (unref(isUpdate)) {
      setFieldsValue({
        ...data.record,
      });

      const optionArr = JSON.parse(data.record.optionArr);
      const valArr = optionArr.map((item) => item.value);

      const AIndex = valArr.indexOf('A');
      if (AIndex !== -1) {
        setFieldsValue({
          optionA: true,
          ALabel: optionArr[AIndex].label,
          ARatio: optionArr[AIndex].ratio,
        });
      }

      const BIndex = valArr.indexOf('B');
      if (BIndex !== -1) {
        setFieldsValue({
          optionB: true,
          BLabel: optionArr[BIndex].label,
          BRatio: optionArr[BIndex].ratio,
        });
        updateSchema({ field: 'BLabel', required: true });
      }

      const CIndex = valArr.indexOf('C');
      if (CIndex !== -1) {
        setFieldsValue({
          optionC: true,
          CLabel: optionArr[CIndex].label,
          CRatio: optionArr[CIndex].ratio,
        });
        updateSchema({ field: 'CLabel', required: true });
      }

      const DIndex = valArr.indexOf('D');
      if (DIndex !== -1) {
        setFieldsValue({
          optionD: true,
          DLabel: optionArr[DIndex].label,
          DRatio: optionArr[DIndex].ratio,
        });
        updateSchema({ field: 'DLabel', required: true });
      }

      const EIndex = valArr.indexOf('E');
      if (EIndex !== -1) {
        setFieldsValue({
          optionE: true,
          ELabel: optionArr[EIndex].label,
          ERatio: optionArr[EIndex].ratio,
        });
        updateSchema({ field: 'ELabel', required: true });
      }

      const FIndex = valArr.indexOf('F');
      if (FIndex !== -1) {
        setFieldsValue({
          optionE: true,
          FLabel: optionArr[FIndex].label,
          FRatio: optionArr[FIndex].ratio,
        });
        updateSchema({ field: 'FLabel', required: true });
      }

      const GIndex = valArr.indexOf('G');
      if (GIndex !== -1) {
        setFieldsValue({
          optionG: true,
          GLabel: optionArr[GIndex].label,
          GRatio: optionArr[GIndex].ratio,
        });
        updateSchema({ field: 'GLabel', required: true });
      }
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增试题' : '编辑试题'));

  const { createMessage } = useMessage();

  async function handleSubmit() {
    try {
      const values = await validate();
      values.projectId = projectId;

      const optionArr = [] as any;
      if (values.optionA) {
        optionArr.push({ label: values.ALabel, value: 'A', ratio: values.ARatio });
      }
      if (values.optionB) {
        optionArr.push({ label: values.BLabel, value: 'B', ratio: values.BRatio });
      }
      if (values.optionC) {
        optionArr.push({ label: values.CLabel, value: 'C', ratio: values.CRatio });
      }
      if (values.optionD) {
        optionArr.push({ label: values.DLabel, value: 'D', ratio: values.DRatio });
      }
      if (values.optionE) {
        optionArr.push({ label: values.ELabel, value: 'E', ratio: values.ERatio });
      }
      if (values.optionF) {
        optionArr.push({ label: values.FLabel, value: 'F', ratio: values.FRatio });
      }
      if (values.optionG) {
        optionArr.push({ label: values.GLabel, value: 'G', ratio: values.GRatio });
      }

      values.optionArr = JSON.stringify(optionArr);

      setModalProps({ confirmLoading: true });
      addOrUpdate(values).then(() => {
        createMessage.success((isUpdate.value ? '编辑' : '新增') + '试题成功！');
        closeModal();
        emit('success');
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
