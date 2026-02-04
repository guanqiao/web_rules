import { DroolsRule, DroolsRuleItem, RuleNode, Connection, ConditionConfig, ActionConfig } from '@/types/rule.types';

export class DroolsCompiler {
  private packageName: string = 'com.rules';
  private imports: string[] = [];
  private globals: string[] = [];
  private rules: DroolsRuleItem[] = [];

  constructor(packageName: string = 'com.rules') {
    this.packageName = packageName;
  }

  addImport(importStatement: string): void {
    if (!this.imports.includes(importStatement)) {
      this.imports.push(importStatement);
    }
  }

  addGlobal(globalStatement: string): void {
    if (!this.globals.includes(globalStatement)) {
      this.globals.push(globalStatement);
    }
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
      imports: this.imports,
      globals: this.globals,
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
      return;
    }
    visited.push(node.id);

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

    const outgoingConnections = connections.filter(c => c.source === node.id);
    outgoingConnections.forEach(conn => {
      const targetNode = nodeMap.get(conn.target);
      if (targetNode) {
        this.processNode(targetNode, nodeMap, connections, visited);
      }
    });
  }

  private compileConditionNode(
    node: RuleNode,
    nodeMap: Map<string, RuleNode>,
    connections: Connection[],
    visited: string[]
  ): void {
    const config = node.data.config as ConditionConfig;
    const ruleName = `Rule_${node.id}`;

    const whenClause = this.generateWhenClause(config);
    const thenClause = this.generateThenClause(node, nodeMap, connections, visited);

    const rule: DroolsRuleItem = {
      name: ruleName,
      when: whenClause,
      then: thenClause
    };

    this.rules.push(rule);
  }

  private compileActionNode(node: RuleNode): void {
    const config = node.data.config as ActionConfig;
    const ruleName = `Action_${node.id}`;

    const thenClause = this.generateActionStatements(config);

    const rule: DroolsRuleItem = {
      name: ruleName,
      when: ['$fact: Object()'],
      then: thenClause
    };

    this.rules.push(rule);
  }

  private compileGroupNode(node: RuleNode): void {
    const config = node.data.config as GroupConfig;
    
    this.rules.forEach(rule => {
      if (config.agendaGroup) {
        rule.agendaGroup = config.agendaGroup;
      }
      if (config.activationGroup) {
        rule.activationGroup = config.activationGroup;
      }
      if (config.salience !== undefined) {
        rule.salience = config.salience;
      }
    });
  }

  private compileDecisionNode(node: RuleNode): void {
    const config = node.data.config as DecisionConfig;
    const ruleName = `Decision_${node.id}`;

    const whenClause = [`eval(${config.expression})`];
    const thenClause = config.thenActions.map(action => 
      this.generateActionStatement(action)
    );

    const rule: DroolsRuleItem = {
      name: ruleName,
      when: whenClause,
      then: thenClause
    };

    this.rules.push(rule);
  }

  private generateWhenClause(config: ConditionConfig): string[] {
    const clauses: string[] = [];
    
    const operatorMap: Record<string, string> = {
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

    const operator = operatorMap[config.operator] || config.operator;
    const value = typeof config.value === 'string' ? `"${config.value}"` : config.value;

    clauses.push(`$fact: ${config.field} ${operator} ${value}`);

    return clauses;
  }

  private generateThenClause(
    node: RuleNode,
    nodeMap: Map<string, RuleNode>,
    connections: Connection[],
    visited: string[]
  ): string[] {
    const statements: string[] = [];
    
    const outgoingConnections = connections.filter(c => c.source === node.id);
    outgoingConnections.forEach(conn => {
      const targetNode = nodeMap.get(conn.target);
      if (targetNode && targetNode.type === 'action') {
        const config = targetNode.data.config as ActionConfig;
        statements.push(...this.generateActionStatements(config));
      }
    });

    return statements;
  }

  private generateActionStatements(config: ActionConfig): string[] {
    const statements: string[] = [];
    statements.push(this.generateActionStatement(config));
    return statements;
  }

  private generateActionStatement(config: ActionConfig): string {
    switch (config.type) {
      case 'set':
        return `$fact.${config.target} = ${JSON.stringify(config.value)};`;
      case 'call':
        if (config.method && config.params) {
          const params = config.params.map(p => JSON.stringify(p)).join(', ');
          return `$fact.${config.method}(${params});`;
        }
        return '';
      case 'insert':
        return `insert(new ${config.target}());`;
      case 'retract':
        return `retract($fact);`;
      case 'modify':
        return `modify($fact) { ${config.target} = ${JSON.stringify(config.value)} };`;
      default:
        return '';
    }
  }

  toDRL(): string {
    let drl = `package ${this.packageName};\n\n`;
    
    if (this.imports.length > 0) {
      drl += '// Imports\n';
      this.imports.forEach(imp => {
        drl += `import ${imp};\n`;
      });
      drl += '\n';
    }

    if (this.globals.length > 0) {
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
