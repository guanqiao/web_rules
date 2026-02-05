export default {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    remove: 'Remove',
    search: 'Search',
    clear: 'Clear',
    preview: 'Preview',
    compile: 'Compile',
    download: 'Download',
    upload: 'Upload',
    export: 'Export',
    import: 'Import',
    copy: 'Copy',
    paste: 'Paste',
    undo: 'Undo',
    redo: 'Redo',
    close: 'Close',
    ok: 'OK',
    yes: 'Yes',
    no: 'No',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    node: 'Node',
    edge: 'Edge',
    rule: 'Rule',
    config: 'Config',
    settings: 'Settings',
    help: 'Help',
    about: 'About',
    smartConnect: {
      suggestions: 'Suggestions for connection:',
      forCondition: 'Used to add judgment logic',
      forAction: 'Used to execute actions directly',
      afterCondition: 'Execute after condition is met',
      moreConditions: 'Add more condition judgments',
      complexLogic: 'Implement complex branching logic',
      finishFlow: 'Complete rule flow',
      continueActions: 'Continue with other actions',
      branchAction: 'Execute branch action',
      finishGroupFlow: 'Complete group flow'
    },
    showGrid: 'Show Grid',
    snapToGrid: 'Snap to Grid',
    gridOn: 'Grid',
    gridOff: 'No Grid',
    snapOn: 'Snap',
    snapOff: 'Free'
  },
  toolbar: {
    title: 'Business Rule Configuration System',
    preview: 'Preview',
    compile: 'Compile Rules',
    download: 'Download Package',
    downloadJar: 'Download Source JAR',
    downloadCompiledJar: 'Download Compiled JAR',
    save: 'Save Config',
    clear: 'Clear',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    fitView: 'Fit View',
    undo: 'Undo',
    redo: 'Redo',
    templateLibrary: 'Templates',
    shortcuts: 'Shortcuts',
    help: 'Help',
    language: 'Language',
    autoSave: 'Auto Save',
    saved: 'Saved',
    unsaved: 'Unsaved',
    saving: 'Saving...',
    lastSaved: 'Last saved: {{time}}',
    clearConfirm: 'Confirm Clear',
    clearConfirmContent: 'Are you sure you want to clear all nodes and edges? This action cannot be undone.',
    clearConfirmOk: 'OK',
    clearConfirmCancel: 'Cancel',
    cleared: 'Canvas cleared',
    variables: 'Variables',
    variablesTooltip: 'Variable Management',
    dataModels: 'Data Models',
    dataModelsTooltip: 'Data Model Management',
    test: 'Test',
    testTooltip: 'Rule Test',
    time: {
      justNow: 'Just now',
      minutesAgo: '{{count}} minutes ago',
      hoursAgo: '{{count}} hours ago'
    },
    author: 'Author',
    authorTooltip: 'Developed by JasonD'
  },
  nodePalette: {
    title: 'Node Palette',
    hint: 'Tip: Drag nodes to the canvas to create rule flows',
    nodeTypes: {
      start: 'Start',
      end: 'End',
      condition: 'Condition',
      action: 'Action',
      decision: 'Decision',
      group: 'Group'
    },
    categories: {
      all: 'All',
      basic: 'Basic Nodes',
      logic: 'Logic Nodes',
      data: 'Data Nodes'
    },
    favorites: 'Favorite Nodes',
    searchPlaceholder: 'Search nodes...',
    noResults: 'No matching nodes found',
    noBasicNodes: 'No basic nodes',
    noLogicNodes: 'No logic nodes',
    noDataNodes: 'No data nodes',
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites',
    descriptions: {
      start: 'Starting point of rule flow',
      end: 'Ending point of rule flow',
      condition: 'Condition judgment node',
      action: 'Action execution node',
      decision: 'Decision branch node',
      group: 'Rule grouping node'
    }
  },
  propertyPanel: {
    title: 'Property Configuration',
    selectNode: 'Please select a node to edit properties',
    delete: 'Delete',
    nodeName: 'Node Name',
    nodeNamePlaceholder: 'Enter node name',
    nodeId: 'Node ID',
    nodeType: 'Node Type',
    edgeTitle: 'Edge Properties',
    edgeId: 'Edge ID',
    source: 'Source Node',
    target: 'Target Node',
    copyConfig: 'Copy Config',
    configError: 'Configuration Error',
    configErrorDescription: 'Please check the fields marked in red below',
    preview: 'Configuration Preview',
    configCopied: 'Copied to clipboard',
    fieldRequired: 'Required',
    noDataModels: 'No data models',
    noDataModelsHint: 'Please define data models first to quickly reference fields',
    condition: {
      field: 'Field',
      fieldPlaceholder: 'Select or enter field name',
      fieldTooltip: 'Select field from defined data models, or enter field name manually',
      operator: 'Operator',
      operatorPlaceholder: 'Select operator',
      value: 'Value',
      valuePlaceholder: 'Enter value',
      logicalOperator: 'Logical Operator',
      logicalOperatorPlaceholder: 'Select logical operator',
      operators: {
        eq: 'Equal',
        neq: 'Not Equal',
        gt: 'Greater Than',
        lt: 'Less Than',
        gte: 'Greater Than or Equal',
        lte: 'Less Than or Equal',
        contains: 'Contains',
        in: 'In',
        notIn: 'Not In'
      },
      logicalOperators: {
        and: 'AND',
        or: 'OR'
      }
    },
    action: {
      type: 'Action Type',
      typePlaceholder: 'Select action type',
      target: 'Target',
      targetPlaceholder: 'Select or enter target field',
      targetTooltip: 'Select target field from defined data models',
      value: 'Value',
      valuePlaceholder: 'Enter value',
      method: 'Method Name',
      methodPlaceholder: 'Enter method name',
      types: {
        set: 'Set Value',
        call: 'Call Method',
        insert: 'Insert Fact',
        retract: 'Retract Fact',
        modify: 'Modify Fact'
      }
    },
    decision: {
      expression: 'Expression',
      expressionPlaceholder: 'e.g., $fact.age > 18 && $fact.hasLicense'
    },
    group: {
      name: 'Group Name',
      namePlaceholder: 'Enter group name',
      priority: 'Priority',
      priorityPlaceholder: 'Enter priority',
      agendaGroup: 'Agenda Group',
      agendaGroupPlaceholder: 'Enter agenda group name',
      activationGroup: 'Activation Group',
      activationGroupPlaceholder: 'Enter activation group name'
    },
    validation: {
      required: 'This field is required',
      invalidFormat: 'Invalid format',
      invalidValue: 'Invalid value',
      fieldRequired: 'Field cannot be empty',
      operatorRequired: 'Operator cannot be empty',
      valueRequired: 'Value cannot be empty',
      inOperatorRequired: 'IN operator requires at least two values separated by commas',
      actionTypeRequired: 'Action type cannot be empty',
      targetRequired: 'Target cannot be empty',
      methodRequired: 'Method name must be specified when calling a method',
      expressionRequired: 'Expression cannot be empty',
      expressionSyntaxError: 'Expression syntax error',
      groupNameRequired: 'Group name cannot be empty',
      salienceRangeError: 'Priority must be between 0-65535'
    }
  },
  preview: {
    title: 'Drools Rule Preview',
    stats: {
      package: 'Package',
      rules: 'Rules',
      imports: 'Imports',
      lines: 'Lines',
      errors: 'Errors',
      warnings: 'Warnings'
    },
    codePreview: 'Code Preview',
    nodes: 'Nodes',
    edges: 'Edges',
    copyCode: 'Copy Code',
    copied: 'Copied',
    copyFailed: 'Copy Failed',
    copySuccess: 'Copied to clipboard',
    saveSuccess: 'DRL code saved',
    tip: 'Tip: The generated Drools rule file can be used directly in the Drools rule engine. Make sure you have configured the relevant Java classes and dependencies correctly.',
    editTip: 'Tip: You are editing the DRL code. After saving, the modified code will be used for subsequent operations.',
    editing: 'Editing',
    modified: 'Modified',
    errors: 'Errors',
    warnings: 'Warnings',
    noIssues: 'No Issues',
    syntaxIssues: 'Syntax Issues',
    noSyntaxIssues: 'No syntax issues found',
    line: 'Line',
    column: 'Column',
    location: 'Location',
    suggestion: 'Suggestion'
  },
  editor: {
    addNode: 'Add Node',
    deleteNode: 'Delete Node',
    connectNodes: 'Connect Nodes',
    disconnectNodes: 'Disconnect Nodes',
    selectNode: 'Select Node',
    deselectNode: 'Deselect Node',
    moveNode: 'Move Node',
    resizeNode: 'Resize Node',
    editNode: 'Edit Node',
    duplicateNode: 'Duplicate Node',
    pasteNode: 'Paste Node',
    searchPlaceholder: 'Search nodes...',
    noResults: 'No results found',
    validation: {
      emptyNodes: 'Please add nodes first',
      invalidConnection: 'Connection already exists or is invalid',
      circularDependency: 'Circular dependency detected: {{path}}',
      missingField: 'Condition configuration missing required field name',
      missingOperator: 'Condition configuration missing required operator',
      missingValue: 'Condition configuration missing required value',
      missingType: 'Action configuration missing required type',
      missingTarget: 'Action configuration missing required target',
      missingMethod: 'Call action missing required method name',
      missingExpression: 'Decision configuration missing required expression',
      missingThenActions: 'Decision configuration missing required thenActions',
      invalidCondition: 'Node {{nodeId}} configuration is not a valid condition configuration',
      invalidAction: 'Node {{nodeId}} configuration is not a valid action configuration',
      invalidDecision: 'Node {{nodeId}} configuration is not a valid decision configuration',
      invalidGroup: 'Node {{nodeId}} configuration is not a valid group configuration',
      compileSuccess: 'Compilation successful',
      compileFailed: 'Compilation failed: {{error}}',
      downloadSuccess: 'Download successful',
      downloadFailed: 'Download failed: {{error}}'
    }
  },
  templates: {
    title: 'Rule Template Library',
    search: 'Search templates...',
    categories: {
      all: 'All',
      condition: 'Condition Templates',
      action: 'Action Templates',
      decision: 'Decision Templates',
      workflow: 'Workflow Templates',
      basic: 'Basic Templates',
      advanced: 'Advanced Templates'
    },
    apply: 'Apply Template',
    preview: 'Preview Template',
    noTemplates: 'No templates available',
    templateApplied: 'Template applied',
    templateAppliedMessage: 'Template "{{name}}" applied',
    previewTemplate: 'Template Preview',
    applyTemplate: 'Apply Template',
    description: 'Description',
    rulePreview: 'Rule Preview',
    nodeCount: 'Node Count',
    edgeCount: 'Edge Count',
    noMatchingTemplates: 'No matching templates found',
    templateNames: {
      simpleCondition: 'Simple Condition Rule',
      simpleConditionDesc: 'Basic conditional rule with one condition node and one action node',
      simpleConditionPreview: 'Rule: Set isAdult to true when age >= 18',
      complexDecision: 'Complex Decision Rule',
      complexDecisionDesc: 'Use decision node to implement complex branching logic',
      complexDecisionPreview: 'Rule: Allow driving when age >= 18 and has license',
      discountWorkflow: 'Discount Rule Workflow',
      discountWorkflowDesc: 'Apply different discounts based on user type',
      discountWorkflowPreview: 'Rule: Apply different discounts based on user type (VIP/Normal)',
      groupPriority: 'Group and Priority',
      groupPriorityDesc: 'Use group nodes to manage rule priority and agenda groups',
      groupPriorityPreview: 'Rule: Use groups to manage rules with different priorities',
      tags: {
        group: 'Group',
        priority: 'Priority'
      },
      labels: {
        vipDiscount: 'VIP Discount',
        normalDiscount: 'Normal Discount',
        highPriority: 'High Priority Group',
        normalPriority: 'Normal Priority Group'
      }
    }
  },
  shortcuts: {
    title: 'Keyboard Shortcuts',
    description: 'Use the following shortcuts to improve efficiency',
    undo: 'Undo',
    redo: 'Redo',
    save: 'Save',
    delete: 'Delete Selected',
    copy: 'Copy',
    paste: 'Paste',
    selectAll: 'Select All',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    fitView: 'Fit View',
    search: 'Search',
    preview: 'Preview',
    compile: 'Compile',
    help: 'Help',
    tips: 'Tips',
    tip1: 'The "+" in shortcut combinations means keys to be pressed simultaneously',
    tip2: 'Some shortcuts may vary depending on browser settings',
    tip3: 'Shortcuts may not trigger when typing in input fields',
    tip4: 'You can perform the same operations using toolbar buttons',
    categories: {
      edit: 'Edit Operations',
      view: 'View Operations',
      function: 'Function Operations',
      node: 'Node Operations'
    },
    columns: {
      icon: 'Icon',
      action: 'Action',
      shortcut: 'Shortcut'
    }
  },
  help: {
    title: 'Help Documentation',
    sections: {
      gettingStarted: 'Getting Started',
      creatingNodes: 'Creating Nodes',
      connectingNodes: 'Connecting Nodes',
      editingProperties: 'Editing Properties',
      compilingRules: 'Compiling Rules',
      downloadingRules: 'Downloading Rules',
      usingTemplates: 'Using Templates',
      keyboardShortcuts: 'Keyboard Shortcuts'
    },
    gettingStarted: {
      title: 'Getting Started',
      content: 'Welcome to the Business Rule Configuration System! This system helps you create and manage business rules visually.'
    },
    creatingNodes: {
      title: 'Creating Nodes',
      content: 'Drag nodes from the left node palette to the canvas to create nodes. Supports start, end, condition, action, decision, and group nodes.'
    },
    connectingNodes: {
      title: 'Connecting Nodes',
      content: 'Click on a node\'s connection point and drag to another node to create a connection. Connections represent the rule execution flow.'
    },
    editingProperties: {
      title: 'Editing Properties',
      content: 'Click on a node to edit its properties and configuration in the right property panel.'
    },
    compilingRules: {
      title: 'Compiling Rules',
      content: 'Click the "Compile" button in the toolbar to compile the visual configuration into Drools rule files.'
    },
    downloadingRules: {
      title: 'Downloading Rules',
      content: 'Click the "Download" button to download a ZIP package containing rule files, or click "Download JAR" to download the JAR package directly.'
    },
    usingTemplates: {
      title: 'Using Templates',
      content: 'Click the "Templates" button to view and apply predefined rule templates to quickly create common rules.'
    },
    keyboardShortcuts: {
      title: 'Keyboard Shortcuts',
      content: 'Use keyboard shortcuts to improve efficiency. Click the "Shortcuts" button to view all available shortcuts.'
    },
    welcome: {
      label: 'Welcome',
      intro1: 'Welcome to the Business Rule Configuration System! This is a visual Drools rule editor that helps you create and manage business rules by dragging and dropping nodes.',
      intro2: 'The system supports compiling visual configurations into standard Drools DRL rule files, which can be downloaded as JAR packages for production use.'
    },
    interface: {
      label: 'Interface Overview',
      leftPalette: 'Left Node Palette: Contains all available node types that can be dragged to the canvas',
      centerCanvas: 'Center Canvas: Main workspace for creating and connecting nodes',
      rightPanel: 'Right Property Panel: Used to edit configuration properties of selected nodes',
      topToolbar: 'Top Toolbar: Contains operation buttons such as preview, compile, download, save, etc.'
    },
    nodeTypes: {
      label: 'Node Types',
      description: 'The system provides the following 6 node types:',
      start: 'Start Node (Circle): Starting point of rule flow, each rule must have exactly one',
      end: 'End Node (Circle): Ending point of rule flow, can have multiple',
      condition: 'Condition Node (Rectangle): Used to define rule condition judgments, supports multiple operators',
      action: 'Action Node (Rectangle): Used to define actions when rules execute, such as setting values, calling methods, etc.',
      decision: 'Decision Node (Diamond): Used to implement complex branching logic based on expression judgments',
      group: 'Group Node (Rectangle): Used to organize rules, set priorities and agenda groups'
    },
    addNode: {
      label: 'Add Nodes',
      description1: 'Drag the required nodes from the left node palette to the canvas to create nodes. Nodes will be automatically placed at the drop release position.',
      tip: 'Tip: You can use the search box to quickly find node types, or use the favorites feature to save commonly used nodes.'
    },
    connectNodes: {
      label: 'Connect Nodes',
      description1: 'Click on a node\'s connection point (small circles on left and right sides) and drag to another node\'s connection point to create a connection.',
      description2: 'Connections represent the direction of rule execution flow, from source node to target node.'
    },
    deleteConnection: {
      label: 'Delete Connection',
      description: 'Click to select a connection line, then press the Delete key or use the right-click menu to delete the connection.'
    },
    editProperties: {
      label: 'Edit Node Properties',
      description1: 'After clicking a node, the right property panel will display configuration options for that node. Depending on the node type, configurable properties may vary.',
      description2: 'The property panel will validate configuration correctness in real-time and display prompt messages when there are errors.'
    },
    configValidation: {
      label: 'Configuration Validation',
      description1: 'The system automatically validates node configuration correctness:',
      check1: 'Completeness of node connections',
      check2: 'Validity of configuration fields',
      check3: 'Correctness of rule syntax'
    },
    compileRules: {
      label: 'Compile Rules',
      description1: 'Click the "Compile Rules" button in the toolbar, and the system will compile the visual configuration into Drools DRL rule files.',
      description2: 'The compilation process checks:',
      check1: 'Completeness of node connections',
      check2: 'Validity of configuration fields'
    },
    previewCode: {
      label: 'Preview DRL Code',
      description: 'Click the "Preview" button to view the generated Drools rule code. The code preview window supports syntax highlighting and copy functionality.'
    },
    downloadZip: {
      label: 'Download ZIP Package',
      description1: 'Click the "Download Package" button, and the system will generate a ZIP package containing the following files:',
      file1: 'rules.drl: Compiled Drools rule file',
      file2: 'config.json: Visual configuration backup'
    },
    downloadJar: {
      label: 'Download JAR Package',
      description1: 'Click the "Download JAR" button, and the system will generate a directly deployable JAR package containing:',
      file1: 'Compiled Drools rule file',
      file2: 'Maven POM configuration file',
      file3: 'KieModule configuration file',
      deployTip: 'JAR packages can be directly deployed to Drools runtime environments.'
    },
    useTemplates: {
      label: 'Use Templates',
      description1: 'Click the "Templates" button in the toolbar to access predefined rule templates. Templates are categorized by difficulty:',
      template1: 'Basic Templates: Simple single rule examples',
      template2: 'Advanced Templates: Rule examples with complex logic',
      description2: 'You can preview template details and click the "Apply" button to load the template onto the canvas.'
    },
    shortcuts: {
      label: 'Shortcut Instructions',
      description1: 'Using shortcuts can significantly improve work efficiency. Click the "Shortcuts" button in the toolbar to view the complete list of shortcuts.',
      description2: 'Common shortcuts:',
      save: 'Ctrl + S: Save',
      delete: 'Delete: Delete selected item',
      preview: 'Ctrl + P: Preview',
      compile: 'Ctrl + Enter: Compile'
    },
    resources: {
      label: 'Related Resources',
      description1: 'More help and resources:',
      link1: 'View Drools official documentation to understand rule syntax',
      link2: 'Use preview function to check generated code',
      link3: 'Quickly create rules through templates'
    }
  },
  onboarding: {
    title: 'Welcome to Business Rule Configuration System',
    skip: 'Skip',
    next: 'Next',
    previous: 'Previous',
    finish: 'Finish',
    steps: {
      welcome: {
        title: 'Welcome',
        content: 'This is a visual business rule configuration system that helps you easily create and manage Drools rules.'
      },
      createNode: {
        title: 'Create Nodes',
        content: 'Drag nodes from the left node palette to the canvas to create nodes.'
      },
      connectNode: {
        title: 'Connect Nodes',
        content: 'Click on a node\'s connection point and drag to another node to create a connection.'
      },
      editProperty: {
        title: 'Edit Properties',
        content: 'Click on a node and edit its properties in the right property panel.'
      },
      compile: {
        title: 'Compile Rules',
        content: 'Click the "Compile" button in the toolbar to compile the configuration into Drools rules.'
      },
      download: {
        title: 'Download Rules',
        content: 'Click "Download" or "Download JAR" button to get rule files.'
      },
      help: {
        title: 'Get Help',
        content: 'Click the "Help" button to view detailed usage instructions.'
      }
    }
  },
  layout: {
    alignLeft: 'Align Left',
    alignRight: 'Align Right',
    alignTop: 'Align Top',
    alignBottom: 'Align Bottom',
    alignCenter: 'Align Center',
    distributeHorizontal: 'Distribute Horizontal',
    distributeVertical: 'Distribute Vertical',
    autoLayout: 'Auto Layout',
    layoutType: 'Layout Type',
    hierarchical: 'Hierarchical',
    tree: 'Tree',
    force: 'Force Directed'
  },
  messages: {
    copiedToClipboard: 'Copied to clipboard',
    copyFailed: 'Copy failed',
    saveSuccess: 'Saved successfully',
    saveFailed: 'Save failed',
    loadSuccess: 'Loaded successfully',
    loadFailed: 'Load failed',
    deleteSuccess: 'Deleted successfully',
    deleteFailed: 'Delete failed',
    templateApplied: 'Template applied',
    templateApplyFailed: 'Template application failed',
    layoutApplied: 'Layout applied',
    layoutApplyFailed: 'Layout application failed'
  },
  testPanel: {
    title: 'Rule Test Panel',
    close: 'Close',
    runAll: 'Run All Tests',
    totalCases: 'Total Cases',
    passed: 'Passed',
    failed: 'Failed',
    pending: 'Pending',
    addTestCase: 'Add Test Case',
    testName: 'Test Name',
    testData: 'Test Data (JSON)',
    expected: 'Expected Result (JSON)',
    add: 'Add',
    runAgain: 'Run Again',
    clearAll: 'Clear All',
    run: 'Run',
    input: 'Input',
    expectedResult: 'Expected',
    actual: 'Actual',
    executionTime: 'Execution Time',
    noTestCases: 'No test cases',
    addTestCasesHint: 'Add test cases to verify rule logic',
    compiledCode: 'Compiled Rule Code',
    copy: 'Copy',
    testCaseAdded: 'Test case added',
    testCaseDeleted: 'Test case deleted',
    allTestCasesCleared: 'All test cases cleared',
    confirmClear: 'Confirm Clear',
    confirmClearContent: 'Are you sure you want to clear all test cases?',
    testExecutionFailed: 'Test execution failed',
    batchTestExecutionFailed: 'Batch test execution failed',
    testsCompleted: 'Completed {{count}} test cases',
    status: {
      passed: 'Passed',
      failed: 'Failed',
      pending: 'Pending'
    },
    validation: {
      testNameRequired: 'Please enter test name',
      testDataRequired: 'Please enter test data',
      expectedRequired: 'Please enter expected result'
    }
  },
  variableManager: {
    title: 'Variable Manager',
    close: 'Cancel',
    saveConfig: 'Save Config',
    addVariable: 'Add Variable',
    editVariable: 'Edit Variable',
    addVariableModal: 'Add Variable',
    editVariableModal: 'Edit Variable',
    variableName: 'Variable Name',
    variableType: 'Variable Type',
    variableScope: 'Scope',
    defaultValue: 'Default Value',
    description: 'Description',
    actions: 'Actions',
    variableDeleted: 'Variable deleted',
    variableCopied: 'Variable copied',
    variableUpdated: 'Variable updated',
    variableAdded: 'Variable added',
    variableConfigSaved: 'Variable configuration saved',
    confirmDelete: 'Confirm Delete',
    confirmDeleteContent: 'Are you sure you want to delete this variable?',
    fillRequiredFields: 'Please fill in all required fields',
    usageInstructions: 'Usage Instructions',
    usageInstructionsContent: {
      global: 'Global variables can be used in all rules',
      session: 'Session variables are valid in the current session',
      node: 'Node variables are only valid within specific node scope',
      reference: 'Use $variableName to reference variables in condition nodes'
    },
    placeholders: {
      variableName: 'e.g., $fact.age',
      selectVariableType: 'Select variable type',
      selectVariableScope: 'Select variable scope',
      defaultValue: 'Enter default value (optional)',
      description: 'Enter variable description (optional)'
    },
    types: {
      string: 'String',
      number: 'Number',
      boolean: 'Boolean',
      object: 'Object',
      array: 'Array'
    },
    scopes: {
      global: 'Global',
      session: 'Session',
      node: 'Node'
    }
  },
  dataModelManager: {
    title: 'Data Model Manager',
    close: 'Cancel',
    saveConfig: 'Save Config',
    addModel: 'Add Data Model',
    editModel: 'Edit Data Model',
    addModelModal: 'Add Data Model',
    editModelModal: 'Edit Data Model',
    addField: 'Add Field',
    editField: 'Edit Field',
    addFieldModal: 'Add Field',
    editFieldModal: 'Edit Field',
    modelName: 'Model Name',
    packageName: 'Package Name',
    fieldName: 'Field Name',
    fieldType: 'Field Type',
    required: 'Required',
    defaultValue: 'Default Value',
    description: 'Description',
    actions: 'Actions',
    modelDeleted: 'Data model deleted',
    modelCopied: 'Data model copied',
    modelUpdated: 'Data model updated',
    modelAdded: 'Data model added',
    fieldDeleted: 'Field deleted',
    fieldUpdated: 'Field updated',
    fieldAdded: 'Field added',
    modelConfigSaved: 'Data model configuration saved',
    confirmDelete: 'Confirm Delete',
    confirmDeleteModel: 'Are you sure you want to delete this data model?',
    confirmDeleteField: 'Are you sure you want to delete this field?',
    fillRequiredFields: 'Please fill in all required fields',
    selectModelFirst: 'Please select a data model first',
    usageInstructions: 'Usage Instructions',
    usageInstructionsContent: {
      modelDefinition: 'Define data models for rule judgment and Java code generation',
      fieldTypes: 'Supports multiple field types including string, number, boolean, date, enum, object, and array',
      packageName: 'Package name is used for generating Java class package path',
      javaGeneration: 'Data models will be compiled into Java classes and included in the generated JAR package'
    },
    placeholders: {
      modelName: 'e.g., Customer',
      packageName: 'e.g., com.model',
      fieldName: 'e.g., age',
      selectFieldType: 'Select field type',
      defaultValue: 'Enter default value (optional)',
      description: 'Enter description (optional)'
    },
    types: {
      string: 'String',
      number: 'Number',
      boolean: 'Boolean',
      date: 'Date',
      enum: 'Enum',
      object: 'Object',
      array: 'Array'
    },
    modelsTab: 'Data Models',
    fieldsTab: 'Field Management',
    selectedModel: 'Current Model',
    fieldCount: 'Field Count',
    version: 'Version',
    noModelSelected: 'Please select a data model first',
    enterModelName: 'Please enter data model name',
    enterPackageName: 'Please enter package name',
    enterVersion: 'Please enter version',
    enterFieldName: 'Please enter field name',
    selectFieldType: 'Please select field type'
  }
};
