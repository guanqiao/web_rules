import { Node } from '@xyflow/react';

export interface RuleTemplate {
  id: string;
  name: string;
  description: string;
  category: 'condition' | 'action' | 'decision' | 'workflow';
  nodes: Node[];
  preview: string;
}

export const ruleTemplates: RuleTemplate[] = [
  {
    id: 'age-check',
    name: '年龄检查',
    description: '检查用户年龄是否满足条件',
    category: 'condition',
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 100, y: 100 },
        data: { label: '开始', config: {} }
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 300, y: 100 },
        data: { 
          label: '年龄检查', 
          config: {
            field: '$fact.age',
            operator: '>=',
            value: 18,
            logicalOperator: 'AND'
          }
        }
      }
    ],
    preview: '$fact.age >= 18'
  },
  {
    id: 'set-status',
    name: '设置状态',
    description: '设置对象的状态属性',
    category: 'action',
    nodes: [
      {
        id: 'start-2',
        type: 'start',
        position: { x: 100, y: 100 },
        data: { label: '开始', config: {} }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 300, y: 100 },
        data: { 
          label: '设置状态', 
          config: {
            type: 'set',
            target: 'status',
            value: 'active'
          }
        }
      }
    ],
    preview: '$fact.status = "active"'
  },
  {
    id: 'call-method',
    name: '调用方法',
    description: '调用对象的方法',
    category: 'action',
    nodes: [
      {
        id: 'start-3',
        type: 'start',
        position: { x: 100, y: 100 },
        data: { label: '开始', config: {} }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 300, y: 100 },
        data: { 
          label: '调用方法', 
          config: {
            type: 'call',
            target: 'process',
            method: 'execute',
            params: []
          }
        }
      }
    ],
    preview: '$fact.process.execute()'
  },
  {
    id: 'insert-fact',
    name: '插入事实',
    description: '插入新的事实到工作内存',
    category: 'action',
    nodes: [
      {
        id: 'start-4',
        type: 'start',
        position: { x: 100, y: 100 },
        data: { label: '开始', config: {} }
      },
      {
        id: 'action-3',
        type: 'action',
        position: { x: 300, y: 100 },
        data: { 
          label: '插入事实', 
          config: {
            type: 'insert',
            target: 'Notification',
            params: ['"Alert"', '"High priority"']
          }
        }
      }
    ],
    preview: 'insert(new Notification("Alert", "High priority"))'
  },
  {
    id: 'simple-decision',
    name: '简单决策',
    description: '基于条件执行不同的动作',
    category: 'decision',
    nodes: [
      {
        id: 'start-5',
        type: 'start',
        position: { x: 100, y: 100 },
        data: { label: '开始', config: {} }
      },
      {
        id: 'decision-1',
        type: 'decision',
        position: { x: 300, y: 100 },
        data: { 
          label: '决策', 
          config: {
            expression: '$fact.amount > 1000',
            thenActions: [
              {
                type: 'set',
                target: 'priority',
                value: 'high'
              }
            ],
            elseActions: [
              {
                type: 'set',
                target: 'priority',
                value: 'normal'
              }
            ]
          }
        }
      }
    ],
    preview: 'if ($fact.amount > 1000) { $fact.priority = "high" } else { $fact.priority = "normal" }'
  },
  {
    id: 'approval-workflow',
    name: '审批流程',
    description: '完整的审批工作流程',
    category: 'workflow',
    nodes: [
      {
        id: 'start-6',
        type: 'start',
        position: { x: 100, y: 100 },
        data: { label: '开始', config: {} }
      },
      {
        id: 'condition-2',
        type: 'condition',
        position: { x: 300, y: 100 },
        data: { 
          label: '金额检查', 
          config: {
            field: '$fact.amount',
            operator: '>',
            value: 10000,
            logicalOperator: 'AND'
          }
        }
      },
      {
        id: 'action-4',
        type: 'action',
        position: { x: 500, y: 50 },
        data: { 
          label: '需要审批', 
          config: {
            type: 'set',
            target: 'approvalRequired',
            value: true
          }
        }
      },
      {
        id: 'action-5',
        type: 'action',
        position: { x: 500, y: 150 },
        data: { 
          label: '自动通过', 
          config: {
            type: 'set',
            target: 'approvalRequired',
            value: false
          }
        }
      }
    ],
    preview: 'if ($fact.amount > 10000) { $fact.approvalRequired = true } else { $fact.approvalRequired = false }'
  }
];
