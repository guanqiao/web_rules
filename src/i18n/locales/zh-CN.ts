export default {
  common: {
    save: '保存',
    cancel: '取消',
    confirm: '确定',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    remove: '移除',
    search: '搜索',
    clear: '清空',
    preview: '预览',
    compile: '编译',
    download: '下载',
    upload: '上传',
    export: '导出',
    import: '导入',
    copy: '复制',
    paste: '粘贴',
    undo: '撤销',
    redo: '重做',
    close: '关闭',
    ok: '确定',
    yes: '是',
    no: '否',
    loading: '加载中...',
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '信息',
    node: '节点',
    edge: '连线',
    rule: '规则',
    config: '配置',
    settings: '设置',
    help: '帮助',
    about: '关于',
    apply: '应用',
    template: '模板'
  },
  toolbar: {
    title: '业务规则配置系统',
    preview: '预览',
    compile: '编译规则',
    download: '下载规则包',
    downloadJar: '下载 JAR 包',
    save: '保存配置',
    clear: '清空',
    zoomIn: '放大',
    zoomOut: '缩小',
    fitView: '适应视图',
    undo: '撤销',
    redo: '重做',
    templates: '模板库',
    shortcuts: '快捷键',
    help: '帮助',
    language: '语言',
    autoSave: '自动保存',
    saved: '已保存',
    unsaved: '未保存',
    saving: '保存中...',
    lastSaved: '上次保存: {{time}}',
    clearConfirm: '确认清空',
    clearConfirmContent: '确定要清空所有节点和连线吗？此操作不可恢复。',
    clearConfirmOk: '确定',
    clearConfirmCancel: '取消',
    cleared: '已清空画布',
    variables: '变量',
    variablesTooltip: '变量管理',
    test: '测试',
    testTooltip: '规则测试',
    time: {
      justNow: '刚刚',
      minutesAgo: '{{count}}分钟前',
      hoursAgo: '{{count}}小时前'
    }
  },
  nodePalette: {
    title: '节点库',
    hint: '提示：拖拽节点到画布上创建规则流程',
    nodeTypes: {
      start: '开始',
      end: '结束',
      condition: '条件',
      action: '动作',
      decision: '决策',
      group: '分组'
    },
    categories: {
      all: '全部',
      basic: '基础节点',
      logic: '逻辑节点',
      data: '数据节点'
    },
    favorites: '收藏节点',
    searchPlaceholder: '搜索节点...',
    noResults: '未找到匹配的节点',
    noBasicNodes: '暂无基础节点',
    noLogicNodes: '暂无逻辑节点',
    noDataNodes: '暂无数据节点',
    addToFavorites: '收藏',
    removeFromFavorites: '取消收藏',
    descriptions: {
      start: '规则流程的起始点',
      end: '规则流程的结束点',
      condition: '条件判断节点',
      action: '执行动作节点',
      decision: '决策分支节点',
      group: '规则分组节点'
    }
  },
  propertyPanel: {
    title: '属性配置',
    selectNode: '请选择一个节点以编辑属性',
    delete: '删除',
    nodeName: '节点名称',
    nodeNamePlaceholder: '输入节点名称',
    nodeId: '节点ID',
    nodeType: '节点类型',
    condition: {
      field: '字段',
      fieldPlaceholder: '例如: $fact.age',
      operator: '操作符',
      operatorPlaceholder: '选择操作符',
      value: '值',
      valuePlaceholder: '输入值',
      logicalOperator: '逻辑操作符',
      logicalOperatorPlaceholder: '选择逻辑操作符',
      operators: {
        eq: '等于',
        neq: '不等于',
        gt: '大于',
        lt: '小于',
        gte: '大于等于',
        lte: '小于等于',
        contains: '包含',
        in: '在...中',
        notIn: '不在...中'
      },
      logicalOperators: {
        and: 'AND',
        or: 'OR'
      }
    },
    action: {
      type: '动作类型',
      typePlaceholder: '选择动作类型',
      target: '目标',
      targetPlaceholder: '例如: fieldName 或 className',
      value: '值',
      valuePlaceholder: '输入值',
      method: '方法名',
      methodPlaceholder: '输入方法名',
      types: {
        set: '设置值',
        call: '调用方法',
        insert: '插入事实',
        retract: '撤回事实',
        modify: '修改事实'
      }
    },
    decision: {
      expression: '表达式',
      expressionPlaceholder: '例如: $fact.age > 18 && $fact.hasLicense'
    },
    group: {
      name: '分组名称',
      namePlaceholder: '输入分组名称',
      priority: '优先级',
      priorityPlaceholder: '输入优先级',
      agendaGroup: '议程组',
      agendaGroupPlaceholder: '输入议程组名称',
      activationGroup: '激活组',
      activationGroupPlaceholder: '输入激活组名称'
    },
    validation: {
      required: '此字段为必填项',
      invalidFormat: '格式不正确',
      invalidValue: '值无效'
    },
    preview: '配置预览',
    copyConfig: '复制配置',
    configCopied: '配置已复制'
  },
  preview: {
    title: 'Drools规则预览',
    stats: {
      package: '规则包',
      rules: '规则数量',
      imports: '导入数量',
      lines: '代码行数'
    },
    codePreview: '代码预览',
    nodes: '节点',
    edges: '连线',
    copyCode: '复制代码',
    copied: '已复制',
    copyFailed: '复制失败',
    copySuccess: '已复制到剪贴板',
    tip: '提示：生成的Drools规则文件可以直接用于Drools规则引擎。请确保已正确配置相关的Java类和依赖项。'
  },
  editor: {
    addNode: '添加节点',
    deleteNode: '删除节点',
    connectNodes: '连接节点',
    disconnectNodes: '断开连接',
    selectNode: '选择节点',
    deselectNode: '取消选择',
    moveNode: '移动节点',
    resizeNode: '调整节点大小',
    editNode: '编辑节点',
    duplicateNode: '复制节点',
    pasteNode: '粘贴节点',
    searchPlaceholder: '搜索节点...',
    noResults: '未找到结果',
    validation: {
      emptyNodes: '请先添加节点',
      invalidConnection: '连接已存在或无效',
      circularDependency: '检测到循环依赖: {{path}}',
      missingField: '条件配置缺少必需的字段名',
      missingOperator: '条件配置缺少必需的操作符',
      missingValue: '条件配置缺少必需的值',
      missingType: '动作配置缺少必需的类型',
      missingTarget: '动作配置缺少必需的目标',
      missingMethod: '调用动作缺少必需的方法名',
      missingExpression: '决策配置缺少必需的表达式',
      missingThenActions: '决策配置缺少必需的 thenActions',
      invalidCondition: '节点 {{nodeId}} 的配置不是有效的条件配置',
      invalidAction: '节点 {{nodeId}} 的配置不是有效的动作配置',
      invalidDecision: '节点 {{nodeId}} 的配置不是有效的决策配置',
      invalidGroup: '节点 {{nodeId}} 的配置不是有效的分组配置',
      compileSuccess: '编译成功',
      compileFailed: '编译失败: {{error}}',
      downloadSuccess: '下载成功',
      downloadFailed: '下载失败: {{error}}'
    }
  },
  templates: {
    title: '规则模板库',
    search: '搜索模板...',
    categories: {
      all: '全部',
      condition: '条件模板',
      action: '动作模板',
      decision: '决策模板',
      workflow: '工作流模板'
    },
    apply: '应用模板',
    preview: '预览模板',
    noTemplates: '暂无模板',
    templateApplied: '模板已应用',
    previewTemplate: '模板预览',
    description: '描述',
    rulePreview: '规则预览',
    nodeCount: '节点数量',
    edgeCount: '连线数量'
  },
  shortcuts: {
    title: '键盘快捷键',
    description: '使用以下快捷键提高工作效率',
    undo: '撤销',
    redo: '重做',
    save: '保存',
    delete: '删除选中',
    copy: '复制',
    paste: '粘贴',
    selectAll: '全选',
    zoomIn: '放大',
    zoomOut: '缩小',
    fitView: '适应视图',
    search: '搜索',
    preview: '预览',
    compile: '编译',
    help: '帮助',
    tips: '提示'
  },
  help: {
    title: '帮助文档',
    sections: {
      gettingStarted: '快速开始',
      creatingNodes: '创建节点',
      connectingNodes: '连接节点',
      editingProperties: '编辑属性',
      compilingRules: '编译规则',
      downloadingRules: '下载规则',
      usingTemplates: '使用模板',
      keyboardShortcuts: '键盘快捷键'
    },
    gettingStarted: {
      title: '快速开始',
      content: '欢迎使用业务规则配置系统！本系统帮助您通过可视化方式创建和管理业务规则。'
    },
    creatingNodes: {
      title: '创建节点',
      content: '从左侧节点库拖拽节点到画布上即可创建节点。支持开始、结束、条件、动作、决策和分组节点。'
    },
    connectingNodes: {
      title: '连接节点',
      content: '点击节点的连接点并拖动到另一个节点即可创建连接。连接表示规则执行的流程。'
    },
    editingProperties: {
      title: '编辑属性',
      content: '点击节点后，在右侧属性面板中可以编辑节点的属性和配置。'
    },
    compilingRules: {
      title: '编译规则',
      content: '点击工具栏的"编译"按钮可以将可视化配置编译为Drools规则文件。'
    },
    downloadingRules: {
      title: '下载规则',
      content: '点击"下载"按钮可以下载包含规则文件的ZIP包，或点击"下载JAR"按钮直接下载JAR包。'
    },
    usingTemplates: {
      title: '使用模板',
      content: '点击"模板库"按钮可以查看和应用预定义的规则模板，快速创建常用规则。'
    },
    keyboardShortcuts: {
      title: '键盘快捷键',
      content: '使用键盘快捷键可以提高工作效率。点击"快捷键"按钮查看所有可用的快捷键。'
    }
  },
  onboarding: {
    title: '欢迎使用业务规则配置系统',
    skip: '跳过',
    next: '下一步',
    previous: '上一步',
    finish: '完成',
    steps: {
      welcome: {
        title: '欢迎使用',
        content: '这是一个可视化的业务规则配置系统，帮助您轻松创建和管理Drools规则。'
      },
      createNode: {
        title: '创建节点',
        content: '从左侧节点库拖拽节点到画布上即可创建节点。'
      },
      connectNode: {
        title: '连接节点',
        content: '点击节点的连接点并拖动到另一个节点即可创建连接。'
      },
      editProperty: {
        title: '编辑属性',
        content: '点击节点后，在右侧属性面板中编辑节点的属性。'
      },
      compile: {
        title: '编译规则',
        content: '点击工具栏的"编译"按钮将配置编译为Drools规则。'
      },
      download: {
        title: '下载规则',
        content: '点击"下载"或"下载JAR"按钮获取规则文件。'
      },
      help: {
        title: '获取帮助',
        content: '点击"帮助"按钮查看详细的使用说明。'
      }
    }
  },
  layout: {
    alignLeft: '左对齐',
    alignRight: '右对齐',
    alignTop: '顶部对齐',
    alignBottom: '底部对齐',
    alignCenter: '居中对齐',
    distributeHorizontal: '水平分布',
    distributeVertical: '垂直分布',
    autoLayout: '自动布局',
    layoutType: '布局类型',
    hierarchical: '层次布局',
    tree: '树形布局',
    force: '力导向布局'
  },
  messages: {
    copiedToClipboard: '已复制到剪贴板',
    copyFailed: '复制失败',
    saveSuccess: '保存成功',
    saveFailed: '保存失败',
    loadSuccess: '加载成功',
    loadFailed: '加载失败',
    deleteSuccess: '删除成功',
    deleteFailed: '删除失败',
    templateApplied: '模板已应用',
    templateApplyFailed: '模板应用失败',
    layoutApplied: '布局已应用',
    layoutApplyFailed: '布局应用失败'
  },
  testPanel: {
    title: '规则测试面板',
    close: '关闭',
    runAll: '运行所有测试',
    totalCases: '总用例',
    passed: '通过',
    failed: '失败',
    pending: '待测试',
    addTestCase: '添加测试用例',
    testName: '测试名称',
    testData: '测试数据 (JSON)',
    expected: '期望结果 (JSON)',
    add: '添加',
    runAgain: '重新运行',
    clearAll: '清空所有',
    run: '运行',
    input: '输入',
    expectedResult: '期望',
    actual: '实际',
    executionTime: '执行时间',
    noTestCases: '暂无测试用例',
    addTestCasesHint: '添加测试用例来验证规则逻辑',
    compiledCode: '编译的规则代码',
    copy: '复制',
    testCaseAdded: '测试用例已添加',
    testCaseDeleted: '测试用例已删除',
    allTestCasesCleared: '所有测试用例已清空',
    confirmClear: '确认清空',
    confirmClearContent: '确定要清空所有测试用例吗？',
    testExecutionFailed: '测试执行失败',
    batchTestExecutionFailed: '批量测试执行失败',
    testsCompleted: '已完成 {{count}} 个测试用例',
    status: {
      passed: '通过',
      failed: '失败',
      pending: '待测试'
    },
    validation: {
      testNameRequired: '请输入测试名称',
      testDataRequired: '请输入测试数据',
      expectedRequired: '请输入期望结果'
    }
  },
  variableManager: {
    title: '变量管理器',
    close: '取消',
    saveConfig: '保存配置',
    addVariable: '添加变量',
    editVariable: '编辑变量',
    addVariableModal: '添加变量',
    editVariableModal: '编辑变量',
    variableName: '变量名',
    variableType: '变量类型',
    variableScope: '作用域',
    defaultValue: '默认值',
    description: '描述',
    actions: '操作',
    variableDeleted: '变量已删除',
    variableCopied: '变量已复制',
    variableUpdated: '变量已更新',
    variableAdded: '变量已添加',
    variableConfigSaved: '变量配置已保存',
    confirmDelete: '确认删除',
    confirmDeleteContent: '确定要删除这个变量吗？',
    fillRequiredFields: '请填写所有必填字段',
    usageInstructions: '使用说明',
    usageInstructionsContent: {
      global: '全局变量可在所有规则中使用',
      session: '会话变量在当前会话中有效',
      node: '节点变量仅在特定节点作用域内有效',
      reference: '在条件节点中使用 $variableName 引用变量'
    },
    placeholders: {
      variableName: '例如: $fact.age',
      selectVariableType: '选择变量类型',
      selectVariableScope: '选择变量作用域',
      defaultValue: '输入默认值（可选）',
      description: '输入变量描述（可选）'
    },
    types: {
      string: 'String (字符串)',
      number: 'Number (数字)',
      boolean: 'Boolean (布尔)',
      object: 'Object (对象)',
      array: 'Array (数组)'
    },
    scopes: {
      global: 'Global (全局)',
      session: 'Session (会话)',
      node: 'Node (节点)'
    }
  }
};
