export interface RuleNode {
  id: string;
  type: 'condition' | 'action' | 'group' | 'decision' | 'start' | 'end';
  position: { x: number; y: number };
  data: {
    label: string;
    config: Record<string, any>;
  };
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface ConditionConfig {
  field: string;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'in' | 'not in';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface ActionConfig {
  type: 'set' | 'call' | 'insert' | 'retract' | 'modify';
  target: string;
  value?: any;
  method?: string;
  params?: any[];
}

export interface GroupConfig {
  name: string;
  priority?: number;
  agendaGroup?: string;
  activationGroup?: string;
  salience?: number;
}

export interface DecisionConfig {
  expression: string;
  thenActions: ActionConfig[];
  elseActions?: ActionConfig[];
}

export interface DroolsRule {
  name: string;
  packageName: string;
  imports: string[];
  globals: string[];
  rules: DroolsRuleItem[];
}

export interface DroolsRuleItem {
  name: string;
  salience?: number;
  agendaGroup?: string;
  activationGroup?: string;
  noLoop?: boolean;
  when: string[];
  then: string[];
}

export interface RuleFlowData {
  nodes: RuleNode[];
  connections: Connection[];
  metadata: {
    name: string;
    description?: string;
    version: string;
    createdAt: string;
    updatedAt: string;
  };
}
