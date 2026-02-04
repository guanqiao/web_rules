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
    about: 'About'
  },
  toolbar: {
    title: 'Business Rule Configuration System',
    preview: 'Preview',
    compile: 'Compile Rules',
    download: 'Download Package',
    downloadJar: 'Download JAR',
    save: 'Save Config',
    clear: 'Clear',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    fitView: 'Fit View',
    undo: 'Undo',
    redo: 'Redo',
    templates: 'Templates',
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
    cleared: 'Canvas cleared'
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
    condition: {
      field: 'Field',
      fieldPlaceholder: 'e.g., $fact.age',
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
      targetPlaceholder: 'e.g., fieldName or className',
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
      invalidValue: 'Invalid value'
    }
  },
  preview: {
    title: 'Drools Rule Preview',
    stats: {
      package: 'Package',
      rules: 'Rules',
      imports: 'Imports',
      lines: 'Lines'
    },
    codePreview: 'Code Preview',
    nodes: 'Nodes',
    edges: 'Edges',
    copyCode: 'Copy Code',
    copied: 'Copied',
    copyFailed: 'Copy Failed',
    copySuccess: 'Copied to clipboard',
    tip: 'Tip: The generated Drools rule file can be used directly in the Drools rule engine. Make sure you have configured the relevant Java classes and dependencies correctly.'
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
      workflow: 'Workflow Templates'
    },
    apply: 'Apply Template',
    preview: 'Preview Template',
    noTemplates: 'No templates available',
    templateApplied: 'Template applied'
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
    help: 'Help'
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
  }
};
