import { DroolsRule, DroolsRuleItem, RuleNode, Connection, ConditionConfig, ActionConfig, GroupConfig, DecisionConfig } from '@/types/rule.types';
import { DroolsJarBuilder, JarBuildConfig } from './DroolsJarBuilder';

export class DroolsCompiler {
  private packageName: string = 'com.rules';
  private imports: Set<string> = new Set();
  private globals: Set<string> = new Set();
  private rules: DroolsRuleItem[] = [];
  private currentGroupConfig: GroupConfig | null = null;

  private static readonly OPERATOR_MAP: Record<string, string> = {
    '==': '==',
    '!=': '!=',
    'gt': '>',
    'lt': '<',
    'gte': '>=',
    'lte': '<=',
    'contains': 'contains',
    'in': 'in',
    'not in': 'not in'
  };

  private static escapeStringValue(value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }

  private static formatValueForDRL(value: any): string {
    if (value === null || value === undefined) {
      return 'null';
    }
    
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    
    if (typeof value === 'number') {
      return String(value);
    }
    
    if (typeof value === 'string') {
      return `"${DroolsCompiler.escapeStringValue(value)}"`;
    }
    
    if (Array.isArray(value)) {
      return value.map(v => DroolsCompiler.formatValueForDRL(v)).join(', ');
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return String(value);
  }

  private static validateConditionConfig(config: ConditionConfig): void {
    if (!config.field || config.field.trim() === '') {
      throw new Error('条件配置缺少必需的字段名');
    }
    if (!config.operator || config.operator.trim() === '') {
      throw new Error('条件配置缺少必需的操作符');
    }
    if (config.value === undefined || config.value === null) {
      throw new Error('条件配置缺少必需的值');
    }
  }

  private static validateActionConfig(config: ActionConfig): void {
    if (!config.type || config.type.trim() === '') {
      throw new Error('动作配置缺少必需的类型');
    }
    if (!config.target || config.target.trim() === '') {
      throw new Error('动作配置缺少必需的目标');
    }
    if (config.type === 'call' && (!config.method || config.method.trim() === '')) {
      throw new Error('调用动作缺少必需的方法名');
    }
    if (config.type === 'set' && config.value === undefined) {
      throw new Error('设置动作缺少必需的值');
    }
  }

  private static validateDecisionConfig(config: DecisionConfig): void {
    if (!config.expression || config.expression.trim() === '') {
      throw new Error('决策配置缺少必需的表达式');
    }
    if (!config.thenActions || config.thenActions.length === 0) {
      throw new Error('决策配置缺少必需的 thenActions');
    }
  }

  private static isConditionConfig(config: any): config is ConditionConfig {
    return config && 
           typeof config === 'object' &&
           typeof config.field === 'string' &&
           typeof config.operator === 'string' &&
           'value' in config;
  }

  private static isActionConfig(config: any): config is ActionConfig {
    return config && 
           typeof config === 'object' &&
           typeof config.type === 'string' &&
           typeof config.target === 'string';
  }

  private static isGroupConfig(config: any): config is GroupConfig {
    return config && 
           typeof config === 'object' &&
           typeof config.name === 'string';
  }

  private static isDecisionConfig(config: any): config is DecisionConfig {
    return config && 
           typeof config === 'object' &&
           typeof config.expression === 'string' &&
           Array.isArray(config.thenActions);
  }

  constructor(packageName: string = 'com.rules') {
    this.packageName = packageName;
  }

  addImport(importStatement: string): void {
    this.imports.add(importStatement);
  }

  addGlobal(globalStatement: string): void {
    this.globals.add(globalStatement);
  }

  compile(nodes: RuleNode[], connections: Connection[]): DroolsRule {
    this.rules = [];
    
    const nodeMap = new Map<string, RuleNode>();
    nodes.forEach(node => nodeMap.set(node.id, node));

    const startNodes = nodes.filter(n => n.type === 'start');
    
    startNodes.forEach(startNode => {
      this.processNode(startNode, nodeMap, connections, []);
    });

    return {
      name: 'GeneratedRules',
      packageName: this.packageName,
      imports: Array.from(this.imports),
      globals: Array.from(this.globals),
      rules: this.rules
    };
  }

  private processNode(
    node: RuleNode,
    nodeMap: Map<string, RuleNode>,
    connections: Connection[],
    visited: string[]
  ): void {
    if (visited.includes(node.id)) {
      const cyclePath = [...visited, node.id].join(' -> ');
      throw new Error(`检测到循环依赖: ${cyclePath}`);
    }
    visited.push(node.id);

    const previousGroupConfig = this.currentGroupConfig;

    switch (node.type) {
      case 'condition':
        this.compileConditionNode(node, nodeMap, connections, visited);
        break;
      case 'action':
        this.compileActionNode(node);
        break;
      case 'group':
        this.compileGroupNode(node);
        break;
      case 'decision':
        this.compileDecisionNode(node);
        break;
    }

    const outgoingConnections = this.getOutgoingConnections(node.id, connections);
    outgoingConnections.forEach(conn => {
      const targetNode = nodeMap.get(conn.target);
      if (targetNode) {
        this.processNode(targetNode, nodeMap, connections, visited);
      }
    });

    if (node.type === 'group') {
      this.currentGroupConfig = previousGroupConfig;
    }

    visited.pop();
  }

  private getOutgoingConnections(nodeId: string, connections: Connection[]): Connection[] {
    return connections.filter(c => c.source === nodeId);
  }

  private compileConditionNode(
    node: RuleNode,
    nodeMap: Map<string, RuleNode>,
    connections: Connection[],
    visited: string[]
  ): void {
    if (!DroolsCompiler.isConditionConfig(node.data.config)) {
      throw new Error(`节点 ${node.id} 的配置不是有效的条件配置`);
    }
    
    const config = node.data.config;
    DroolsCompiler.validateConditionConfig(config);
    
    const ruleName = `Rule_${node.id}`;

    const whenClause = this.generateWhenClause(config);
    const thenClause = this.generateThenClause(node, nodeMap, connections, visited);

    const rule: DroolsRuleItem = {
      name: ruleName,
      when: whenClause,
      then: thenClause
    };

    this.applyGroupConfig(rule);
    this.rules.push(rule);
  }

  private compileActionNode(node: RuleNode): void {
    if (!DroolsCompiler.isActionConfig(node.data.config)) {
      throw new Error(`节点 ${node.id} 的配置不是有效的动作配置`);
    }
    
    const config = node.data.config;
    DroolsCompiler.validateActionConfig(config);
    
    const ruleName = `Action_${node.id}`;

    const thenClause = [this.generateActionStatement(config)];

    const rule: DroolsRuleItem = {
      name: ruleName,
      when: ['$fact: Object()'],
      then: thenClause
    };

    this.applyGroupConfig(rule);
    this.rules.push(rule);
  }

  private compileGroupNode(node: RuleNode): void {
    if (!DroolsCompiler.isGroupConfig(node.data.config)) {
      throw new Error(`节点 ${node.id} 的配置不是有效的分组配置`);
    }
    
    const config = node.data.config;
    this.currentGroupConfig = config;
  }

  private applyGroupConfig(rule: DroolsRuleItem): void {
    if (!this.currentGroupConfig) {
      return;
    }

    if (this.currentGroupConfig.agendaGroup) {
      rule.agendaGroup = this.currentGroupConfig.agendaGroup;
    }
    if (this.currentGroupConfig.activationGroup) {
      rule.activationGroup = this.currentGroupConfig.activationGroup;
    }
    if (this.currentGroupConfig.salience !== undefined) {
      rule.salience = this.currentGroupConfig.salience;
    }
  }

  private compileDecisionNode(node: RuleNode): void {
    if (!DroolsCompiler.isDecisionConfig(node.data.config)) {
      throw new Error(`节点 ${node.id} 的配置不是有效的决策配置`);
    }
    
    const config = node.data.config;
    DroolsCompiler.validateDecisionConfig(config);
    
    const ruleName = `Decision_${node.id}`;

    const whenClause = [`eval(${config.expression})`];
    const thenClause = config.thenActions.map(action => {
      if (!DroolsCompiler.isActionConfig(action)) {
        throw new Error(`决策节点 ${node.id} 的 thenActions 包含无效的动作配置`);
      }
      DroolsCompiler.validateActionConfig(action);
      return this.generateActionStatement(action);
    });

    const rule: DroolsRuleItem = {
      name: ruleName,
      when: whenClause,
      then: thenClause
    };

    this.applyGroupConfig(rule);
    this.rules.push(rule);

    if (config.elseActions && config.elseActions.length > 0) {
      const elseRuleName = `Decision_${node.id}_Else`;
      const elseWhenClause = [`eval(!(${config.expression}))`];
      const elseThenClause = config.elseActions.map(action => {
        if (!DroolsCompiler.isActionConfig(action)) {
          throw new Error(`决策节点 ${node.id} 的 elseActions 包含无效的动作配置`);
        }
        DroolsCompiler.validateActionConfig(action);
        return this.generateActionStatement(action);
      });

      const elseRule: DroolsRuleItem = {
        name: elseRuleName,
        when: elseWhenClause,
        then: elseThenClause
      };

      this.applyGroupConfig(elseRule);
      this.rules.push(elseRule);
    }
  }

  private generateWhenClause(config: ConditionConfig): string[] {
    const clauses: string[] = [];

    const operator = DroolsCompiler.OPERATOR_MAP[config.operator] || config.operator;
    const value = DroolsCompiler.formatValueForDRL(config.value);

    clauses.push(`$fact: ${config.field} ${operator} ${value}`);

    return clauses;
  }

  private generateThenClause(
    node: RuleNode,
    nodeMap: Map<string, RuleNode>,
    connections: Connection[],
    _visited: string[]
  ): string[] {
    const statements: string[] = [];

    const outgoingConnections = this.getOutgoingConnections(node.id, connections);
    outgoingConnections.forEach(conn => {
      const targetNode = nodeMap.get(conn.target);
      if (targetNode && targetNode.type === 'action') {
        if (!DroolsCompiler.isActionConfig(targetNode.data.config)) {
          throw new Error(`节点 ${targetNode.id} 的配置不是有效的动作配置`);
        }
        const config = targetNode.data.config;
        statements.push(this.generateActionStatement(config));
      }
    });

    return statements;
  }

  private generateActionStatement(config: ActionConfig): string {
    switch (config.type) {
      case 'set':
        return `$fact.${config.target} = ${DroolsCompiler.formatValueForDRL(config.value)};`;
      case 'call':
        if (config.method && config.params) {
          const params = config.params.map(p => DroolsCompiler.formatValueForDRL(p)).join(', ');
          return `$fact.${config.method}(${params});`;
        }
        return '';
      case 'insert':
        if (config.params && config.params.length > 0) {
          const params = config.params.map(p => DroolsCompiler.formatValueForDRL(p)).join(', ');
          return `insert(new ${config.target}(${params}));`;
        }
        return `insert(new ${config.target}());`;
      case 'retract':
        return `retract($fact);`;
      case 'modify':
        return `modify($fact) { ${config.target} = ${DroolsCompiler.formatValueForDRL(config.value)} };`;
      default:
        return '';
    }
  }

  toDRL(): string {
    let drl = `package ${this.packageName};\n\n`;
    
    if (this.imports.size > 0) {
      drl += '// Imports\n';
      this.imports.forEach(imp => {
        drl += `import ${imp};\n`;
      });
      drl += '\n';
    }

    if (this.globals.size > 0) {
      drl += '// Globals\n';
      this.globals.forEach(global => {
        drl += `global ${global};\n`;
      });
      drl += '\n';
    }

    drl += '// Rules\n';
    this.rules.forEach(rule => {
      drl += this.formatRule(rule);
      drl += '\n';
    });

    return drl;
  }

  async exportToJar(config?: JarBuildConfig, filename?: string): Promise<void> {
    const rule: DroolsRule = {
      name: 'GeneratedRules',
      packageName: this.packageName,
      imports: Array.from(this.imports),
      globals: Array.from(this.globals),
      rules: this.rules
    };

    const builder = new DroolsJarBuilder(rule, config);
    await builder.downloadJar(filename);
  }

  async buildJarBlob(config?: JarBuildConfig): Promise<Blob> {
    const rule: DroolsRule = {
      name: 'GeneratedRules',
      packageName: this.packageName,
      imports: Array.from(this.imports),
      globals: Array.from(this.globals),
      rules: this.rules
    };

    const builder = new DroolsJarBuilder(rule, config);
    return await builder.buildJar();
  }

  private formatRule(rule: DroolsRuleItem): string {
    let ruleStr = `rule "${rule.name}"\n`;
    
    if (rule.salience !== undefined) {
      ruleStr += `    salience ${rule.salience}\n`;
    }
    if (rule.agendaGroup) {
      ruleStr += `    agenda-group "${rule.agendaGroup}"\n`;
    }
    if (rule.activationGroup) {
      ruleStr += `    activation-group "${rule.activationGroup}"\n`;
    }
    if (rule.noLoop) {
      ruleStr += `    no-loop true\n`;
    }

    ruleStr += '    when\n';
    rule.when.forEach(clause => {
      ruleStr += `        ${clause}\n`;
    });

    ruleStr += '    then\n';
    rule.then.forEach(statement => {
      ruleStr += `        ${statement}\n`;
    });

    ruleStr += 'end\n';
    return ruleStr;
  }
}

export function compileToDRL(nodes: RuleNode[], connections: Connection[]): string {
  const compiler = new DroolsCompiler();
  compiler.addImport('com.model.*');
  compiler.compile(nodes, connections);
  return compiler.toDRL();
}

export async function compileToJar(
  nodes: RuleNode[],
  connections: Connection[],
  config?: JarBuildConfig,
  filename?: string
): Promise<void> {
  const compiler = new DroolsCompiler();
  compiler.addImport('com.model.*');
  compiler.compile(nodes, connections);
  await compiler.exportToJar(config, filename);
}

export async function compileToJarBlob(
  nodes: RuleNode[],
  connections: Connection[],
  config?: JarBuildConfig
): Promise<Blob> {
  const compiler = new DroolsCompiler();
  compiler.addImport('com.model.*');
  compiler.compile(nodes, connections);
  return await compiler.buildJarBlob(config);
}
