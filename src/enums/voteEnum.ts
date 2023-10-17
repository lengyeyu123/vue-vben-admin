export const getLoginPostLevelOptions = (allFlag = false) => {
  const loginPostLevelOptions = [
    { label: '领导班子', value: 0 },
    { label: '中层', value: 1 },
    { label: '员工', value: 2 },
  ] as any;
  if (allFlag) {
    loginPostLevelOptions.unshift({
      label: '全部',
      value: undefined,
    });
  }
  return loginPostLevelOptions;
};

export const getStatusOptions = (allFlag = false) => {
  const options = [
    {
      label: '启用',
      value: 0,
    },
    {
      label: '停用',
      value: 1,
    },
  ] as any;
  if (allFlag) {
    options.unshift({
      label: '全部',
      value: undefined,
    });
  }
  return options;
};

export const getDeptTypeOptions = (allFlag = false) => {
  const options = [
    {
      label: '本部',
      value: 0,
    },
    {
      label: '子公司',
      value: 1,
    },
    {
      label: '部门',
      value: 2,
    },
  ] as any;

  if (allFlag) {
    options.unshift({
      label: '全部',
      value: undefined,
    });
  }
  return options;
};

export const getProjectTypeOptions = (allFlag = false) => {
  const options = [
    {
      label: '组织',
      value: 0,
    },
    {
      label: '人员',
      value: 1,
    },
  ] as any;

  if (allFlag) {
    options.unshift({
      label: '全部',
      value: undefined,
    });
  }

  return options;
};

export const getProjectCategoryOptions = (allFlag = false) => {
  const options = [
    {
      label: '党组织',
      value: 0,
    },
    {
      label: '领导班子',
      value: 1,
    },
    {
      label: '管理人员',
      value: 2,
    },
    {
      label: '技术人员',
      value: 3,
    },
  ] as any;

  if (allFlag) {
    options.unshift({
      label: '全部',
      value: undefined,
    });
  }

  return options;
};

export const getSystemYesOrNoOptions = (allFlag = false) => {
  const options = [
    {
      label: '否',
      value: 0,
    },
    {
      label: '是',
      value: 1,
    },
  ] as any;

  if (allFlag) {
    options.unshift({
      label: '全部',
      value: undefined,
    });
  }

  return options;
};
