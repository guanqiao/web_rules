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
    downloadJar: '下载源码 JAR',
    downloadCompiledJar: '下载编译 JAR',
    save: '保存配置',
    clear: '清空',
    zoomIn: '放大',
    zoomOut: '缩小',
    fitView: '适应视图',
    undo: '撤销',
    redo: '重做',
    templateLibrary: '模板库',
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
    dataModels: '数据模型',
    dataModelsTooltip: '数据模型管理',
    test: '测试',
    testTooltip: '规则测试',
    time: {
      justNow: '刚刚',
      minutesAgo: '{{count}}分钟前',
      hoursAgo: '{{count}}小时前'
    },
    author: '作者',
    authorTooltip: '本系统由 JasonD 开发'
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
    edgeTitle: '连线属性',
    edgeId: '连线ID',
    source: '源节点',
    target: '目标节点',
    copyConfig: '复制配置',
    configError: '配置有误',
    configErrorDescription: '请检查下方标记红色的字段',
    preview: '配置预览',
    configCopied: '已复制到剪贴板',
    fieldRequired: '必填',
    noDataModels: '暂无数据模型',
    noDataModelsHint: '请先定义数据模型以快速引用字段',
    condition: {
      field: '字段',
      fieldPlaceholder: '选择或输入字段名',
      fieldTooltip: '从已定义的数据模型中选择字段，或手动输入字段名',
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
      targetPlaceholder: '选择或输入目标字段',
      targetTooltip: '从已定义的数据模型中选择目标字段',
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
      invalidValue: '值无效',
      fieldRequired: '字段不能为空',
      operatorRequired: '操作符不能为空',
      valueRequired: '值不能为空',
      inOperatorRequired: 'IN操作符需要至少两个值，用逗号分隔',
      actionTypeRequired: '动作类型不能为空',
      targetRequired: '目标不能为空',
      methodRequired: '调用方法时必须指定方法名',
      expressionRequired: '表达式不能为空',
      expressionSyntaxError: '表达式语法错误',
      groupNameRequired: '分组名称不能为空',
      salienceRangeError: '优先级必须在0-65535之间'
    }
  },
  preview: {
    title: 'Drools规则预览',
    stats: {
      package: '规则包',
      rules: '规则数量',
      imports: '导入数量',
      lines: '代码行数',
      errors: '错误数',
      warnings: '警告数'
    },
    codePreview: '代码预览',
    nodes: '节点',
    edges: '连线',
    copyCode: '复制代码',
    copied: '已复制',
    copyFailed: '复制失败',
    copySuccess: '已复制到剪贴板',
    saveSuccess: 'DRL代码已保存',
    tip: '提示：生成的Drools规则文件可以直接用于Drools规则引擎。请确保已正确配置相关的Java类和依赖项。',
    editTip: '提示：您正在编辑DRL代码。保存后，修改后的代码将用于后续操作。',
    editing: '编辑中',
    modified: '已修改',
    errors: '错误',
    warnings: '警告',
    noIssues: '无问题',
    syntaxIssues: '语法问题',
    noSyntaxIssues: '未发现语法问题',
    line: '行',
    column: '列',
    location: '位置',
    suggestion: '建议'
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
    },
    smartConnect: {
      suggestions: '建议连接到：',
      forCondition: '用于添加判断逻辑',
      forAction: '用于直接执行操作',
      afterCondition: '条件满足后执行',
      moreConditions: '添加更多条件判断',
      complexLogic: '实现复杂分支逻辑',
      finishFlow: '完成规则流程',
      continueActions: '继续执行其他操作',
      branchAction: '执行分支操作',
      finishGroupFlow: '完成分组流程'
    },
    showGrid: '显示网格',
    snapToGrid: '吸附到网格',
    gridOn: '网格',
    gridOff: '无网格',
    snapOn: '吸附',
    snapOff: '自由'
  },
  templates: {
    title: '规则模板库',
    search: '搜索模板...',
    categories: {
      all: '全部',
      condition: '条件模板',
      action: '动作模板',
      decision: '决策模板',
      workflow: '工作流模板',
      basic: '基础模板',
      advanced: '高级模板'
    },
    apply: '应用模板',
    preview: '预览模板',
    noTemplates: '暂无模板',
    templateApplied: '模板已应用',
    templateAppliedMessage: '模板"{{name}}"已应用',
    previewTemplate: '模板预览',
    applyTemplate: '应用模板',
    description: '描述',
    rulePreview: '规则预览',
    nodeCount: '节点数量',
    edgeCount: '连线数量',
    noMatchingTemplates: '未找到匹配的模板',
    templateNames: {
      simpleCondition: '简单条件规则',
      simpleConditionDesc: '基本的条件判断规则，包含一个条件节点和一个动作节点',
      simpleConditionPreview: '规则：当年龄大于等于18岁时，设置isAdult为true',
      complexDecision: '复杂决策规则',
      complexDecisionDesc: '使用决策节点实现复杂的分支逻辑',
      complexDecisionPreview: '规则：当年龄>=18且持有许可证时，允许驾驶',
      discountWorkflow: '折扣规则工作流',
      discountWorkflowDesc: '根据用户类型应用不同的折扣',
      discountWorkflowPreview: '规则：根据用户类型(VIP/普通)应用不同折扣',
      groupPriority: '分组与优先级',
      groupPriorityDesc: '使用分组节点管理规则优先级和议程组',
      groupPriorityPreview: '规则：使用分组管理不同优先级的规则',
      tags: {
        group: '分组',
        priority: '优先级'
      },
      labels: {
        vipDiscount: 'VIP折扣',
        normalDiscount: '普通折扣',
        highPriority: '高优先级组',
        normalPriority: '普通优先级组'
      }
    }
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
    tips: '提示',
    tip1: '快捷键组合中的 "+" 表示需要同时按下的键',
    tip2: '部分快捷键可能因浏览器设置而有所不同',
    tip3: '在输入框中输入时，快捷键可能不会触发',
    tip4: '可以通过工具栏按钮执行相同的操作',
    categories: {
      edit: '编辑操作',
      view: '视图操作',
      function: '功能操作',
      node: '节点操作'
    },
    columns: {
      icon: '图标',
      action: '操作',
      shortcut: '快捷键'
    }
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
    },
    welcome: {
      label: '欢迎使用',
      intro1: '欢迎使用业务规则配置系统！本系统是一个可视化的Drools规则编辑器，帮助您通过拖拽节点的方式创建和管理业务规则。',
      intro2: '系统支持将可视化配置编译为标准的Drools DRL规则文件，并可直接下载为JAR包用于生产环境。'
    },
    interface: {
      label: '界面介绍',
      leftPalette: '左侧节点库：包含所有可用的节点类型，可拖拽到画布上',
      centerCanvas: '中间画布：主要工作区域，用于创建和连接节点',
      rightPanel: '右侧属性面板：用于编辑选中节点的配置属性',
      topToolbar: '顶部工具栏：包含预览、编译、下载、保存等操作按钮'
    },
    nodeTypes: {
      label: '节点类型',
      description: '系统提供以下6种节点类型：',
      start: '开始节点（圆形）：规则流程的起始点，每个规则必须有且只能有一个',
      end: '结束节点（圆形）：规则流程的结束点，可以有多个',
      condition: '条件节点（矩形）：用于定义规则的条件判断，支持多种操作符',
      action: '动作节点（矩形）：用于定义规则执行时的动作，如设置值、调用方法等',
      decision: '决策节点（菱形）：用于实现复杂的分支逻辑，基于表达式判断',
      group: '分组节点（矩形）：用于组织规则，设置优先级和议程组'
    },
    addNode: {
      label: '添加节点',
      description1: '从左侧节点库中拖拽需要的节点到画布上即可创建节点。节点会自动放置在拖拽释放的位置。',
      tip: '提示：可以使用搜索框快速查找节点类型，或使用收藏功能保存常用节点。'
    },
    connectNodes: {
      label: '连接节点',
      description1: '点击节点的连接点（左右两侧的小圆点）并拖动到另一个节点的连接点即可创建连接。',
      description2: '连接表示规则执行的流程方向，从源节点流向目标节点。'
    },
    deleteConnection: {
      label: '删除连接',
      description: '点击选中连接线，然后按 Delete 键或使用右键菜单删除连接。'
    },
    editProperties: {
      label: '编辑节点属性',
      description1: '点击节点后，右侧属性面板会显示该节点的配置选项。根据节点类型的不同，可配置的属性也有所不同。',
      description2: '属性面板会实时验证配置的正确性，并在有错误时显示提示信息。'
    },
    configValidation: {
      label: '配置验证',
      description1: '系统会自动验证节点配置的正确性：',
      check1: '节点连接的完整性',
      check2: '配置字段的有效性',
      check3: '规则语法的正确性'
    },
    compileRules: {
      label: '编译规则',
      description1: '点击工具栏的"编译规则"按钮，系统会将可视化配置编译为Drools DRL规则文件。',
      description2: '编译过程中会检查：',
      check1: '节点连接的完整性',
      check2: '配置字段的有效性'
    },
    previewCode: {
      label: '预览DRL代码',
      description: '点击"预览"按钮可以查看生成的DRL规则代码。代码预览窗口支持语法高亮和复制功能。'
    },
    downloadZip: {
      label: '下载ZIP包',
      description1: '点击"下载规则包"按钮，系统会生成包含以下文件的ZIP包：',
      file1: 'rules.drl：编译后的DRL规则文件',
      file2: 'config.json：可视化配置备份'
    },
    downloadJar: {
      label: '下载JAR包',
      description1: '点击"下载JAR包"按钮，系统会生成可直接部署的JAR包，包含：',
      file1: '编译后的DRL规则文件',
      file2: 'Maven POM配置文件',
      file3: 'KieModule配置文件',
      deployTip: 'JAR包可以直接部署到Drools运行环境中使用。'
    },
    useTemplates: {
      label: '使用模板',
      description1: '点击工具栏的"模板库"按钮可以访问预定义的规则模板。模板按难度分类：',
      template1: '基础模板：简单的单规则示例',
      template2: '高级模板：包含复杂逻辑的规则示例',
      description2: '可以预览模板详情，点击"应用"按钮将模板加载到画布上。'
    },
    shortcuts: {
      label: '快捷键说明',
      description1: '使用快捷键可以大幅提高工作效率。点击工具栏的"快捷键"按钮查看完整的快捷键列表。',
      description2: '常用快捷键：',
      save: 'Ctrl + S：保存',
      delete: 'Delete：删除选中项',
      preview: 'Ctrl + P：预览',
      compile: 'Ctrl + Enter：编译'
    },
    resources: {
      label: '相关资源',
      description1: '更多帮助和资源：',
      link1: '查看Drools官方文档了解规则语法',
      link2: '使用预览功能检查生成的代码',
      link3: '通过模板快速创建规则'
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
  },
  dataModelManager: {
    title: '数据模型管理器',
    close: '取消',
    saveConfig: '保存配置',
    addModel: '添加数据模型',
    editModel: '编辑数据模型',
    addModelModal: '添加数据模型',
    editModelModal: '编辑数据模型',
    addField: '添加字段',
    editField: '编辑字段',
    addFieldModal: '添加字段',
    editFieldModal: '编辑字段',
    modelName: '模型名称',
    packageName: '包名',
    fieldName: '字段名',
    fieldType: '字段类型',
    required: '必填',
    defaultValue: '默认值',
    description: '描述',
    actions: '操作',
    modelDeleted: '数据模型已删除',
    modelCopied: '数据模型已复制',
    modelUpdated: '数据模型已更新',
    modelAdded: '数据模型已添加',
    fieldDeleted: '字段已删除',
    fieldUpdated: '字段已更新',
    fieldAdded: '字段已添加',
    modelConfigSaved: '数据模型配置已保存',
    confirmDelete: '确认删除',
    confirmDeleteModel: '确定要删除这个数据模型吗？',
    confirmDeleteField: '确定要删除这个字段吗？',
    fillRequiredFields: '请填写所有必填字段',
    selectModelFirst: '请先选择一个数据模型',
    usageInstructions: '使用说明',
    usageInstructionsContent: {
      modelDefinition: '定义数据模型用于规则判断和Java代码生成',
      fieldTypes: '支持多种字段类型，包括字符串、数字、布尔值、日期、枚举、对象和数组',
      packageName: '包名用于生成Java类的包路径',
      javaGeneration: '数据模型会被编译为Java类并包含在生成的JAR包中'
    },
    placeholders: {
      modelName: '例如: Customer',
      packageName: '例如: com.model',
      fieldName: '例如: age',
      selectFieldType: '选择字段类型',
      defaultValue: '输入默认值（可选）',
      description: '输入描述（可选）'
    },
    types: {
      string: 'String (字符串)',
      number: 'Number (数字)',
      boolean: 'Boolean (布尔)',
      date: 'Date (日期)',
      enum: 'Enum (枚举)',
      object: 'Object (对象)',
      array: 'Array (数组)'
    },
    modelsTab: '数据模型',
    fieldsTab: '字段管理',
    selectedModel: '当前模型',
    fieldCount: '字段数',
    version: '版本',
    noModelSelected: '请先选择一个数据模型',
    enterModelName: '请输入数据模型名称',
    enterPackageName: '请输入包名',
    enterVersion: '请输入版本号',
    enterFieldName: '请输入字段名称',
    selectFieldType: '请选择字段类型'
  }
};
