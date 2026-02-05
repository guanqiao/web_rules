export interface DrlSyntaxError {
  line: number;
  column: number;
  severity: 'error' | 'warning';
  message: string;
  code: string;
  suggestion?: string;
}

export interface DrlCheckResult {
  valid: boolean;
  errors: DrlSyntaxError[];
  warnings: DrlSyntaxError[];
}

export class DrlSyntaxChecker {
  private static readonly KEYWORDS = [
    'package', 'import', 'global', 'rule', 'when', 'then', 'end',
    'salience', 'agenda-group', 'activation-group', 'no-loop',
    'lock-on-active', 'duration', 'timer', 'calendars', 'auto-focus',
    'dialect', 'extends', 'enabled', 'attributes'
  ];

  private lines: string[] = [];
  private errors: DrlSyntaxError[] = [];
  private warnings: DrlSyntaxError[] = [];

  check(code: string): DrlCheckResult {
    this.errors = [];
    this.warnings = [];
    this.lines = code.split('\n');

    this.checkBasicStructure();
    this.checkPackageDeclaration();
    this.checkImportStatements();
    this.checkGlobalStatements();
    this.checkRuleStructure();
    this.checkBracketsBalance();
    this.checkQuotesBalance();
    this.checkVariableNaming();
    this.checkIndentation();
    this.checkCommonMistakes();

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  private addError(line: number, column: number, code: string, message: string, suggestion?: string) {
    this.errors.push({ line, column, severity: 'error', message, code, suggestion });
  }

  private addWarning(line: number, column: number, code: string, message: string, suggestion?: string) {
    this.warnings.push({ line, column, severity: 'warning', message, code, suggestion });
  }

  private checkBasicStructure() {
    const code = this.lines.join('\n');

    if (!code.trim()) {
      this.addError(1, 1, 'EMPTY_CODE', 'DRL 代码为空', '请添加至少一个规则定义');
      return;
    }

    const ruleMatches = code.match(/\brule\s+/g);
    if (!ruleMatches || ruleMatches.length === 0) {
      this.addError(1, 1, 'NO_RULE', '未找到任何 rule 定义', '请至少定义一个规则：rule "规则名称"');
    }
  }

  private checkPackageDeclaration() {
    const code = this.lines.join('\n');
    const packageMatch = code.match(/^\s*package\s+([^;\s]+)\s*;?/m);

    if (!packageMatch) {
      this.addWarning(1, 1, 'MISSING_PACKAGE', '缺少 package 声明', '建议在文件开头添加：package com.rules;');
    } else {
      const packageLine = this.lines.findIndex(line => line.includes('package')) + 1;
      const packageName = packageMatch[1];

      if (!/^[a-z][a-zA-Z0-9_]*(\.[a-z][a-zA-Z0-9_]*)*$/.test(packageName)) {
        this.addError(
          packageLine,
          9,
          'INVALID_PACKAGE',
          `Package 名称 '${packageName}' 格式无效`,
          'Package 名称应使用小写字母开头，可包含字母、数字和下划线，使用点号分隔层级'
        );
      }

      if (!packageMatch[0].endsWith(';')) {
        this.addError(
          packageLine,
          packageMatch[0].length,
          'MISSING_SEMICOLON',
          'Package 声明缺少分号',
          '请在 package 声明末尾添加分号：package ' + packageName + ';'
        );
      }
    }
  }

  private checkImportStatements() {
    this.lines.forEach((line, index) => {
      const lineNum = index + 1;
      const importMatch = line.match(/^\s*import\s+(.+)$/);

      if (importMatch) {
        const importContent = importMatch[1].trim();

        if (!importContent.endsWith(';')) {
          this.addError(
            lineNum,
            line.length,
            'IMPORT_MISSING_SEMICOLON',
            'Import 语句缺少分号',
            '请在 import 语句末尾添加分号'
          );
        }

        const importPath = importContent.replace(/;$/, '');
        if (!/^[a-z][a-zA-Z0-9_]*(\.[a-zA-Z0-9_*]+)*$/.test(importPath)) {
          this.addWarning(
            lineNum,
            8,
            'SUSPICIOUS_IMPORT',
            `Import 路径 '${importPath}' 看起来不标准`,
            '请确保 import 路径格式正确，例如：com.example.MyClass'
          );
        }
      }
    });
  }

  private checkGlobalStatements() {
    this.lines.forEach((line, index) => {
      const lineNum = index + 1;
      const globalMatch = line.match(/^\s*global\s+(.+)$/);

      if (globalMatch) {
        const globalContent = globalMatch[1].trim();

        if (!globalContent.endsWith(';')) {
          this.addError(
            lineNum,
            line.length,
            'GLOBAL_MISSING_SEMICOLON',
            'Global 声明缺少分号',
            '请在 global 声明末尾添加分号'
          );
        }

        const parts = globalContent.replace(/;$/, '').split(/\s+/);
        if (parts.length < 2) {
          this.addError(
            lineNum,
            8,
            'INVALID_GLOBAL',
            'Global 声明格式无效',
            'Global 声明格式应为：global 类型 变量名;'
          );
        }
      }
    });
  }

  private checkRuleStructure() {
    const code = this.lines.join('\n');
    const ruleRegex = /\brule\s+["']([^"']+)["']\b/g;
    let match;

    while ((match = ruleRegex.exec(code)) !== null) {
      const ruleName = match[1];
      const ruleStartIndex = match.index;
      const ruleStartLine = code.substring(0, ruleStartIndex).split('\n').length;

      const afterRule = code.substring(ruleStartIndex);

      const hasWhen = /\bwhen\b/.test(afterRule);
      const hasThen = /\bthen\b/.test(afterRule);
      const hasEnd = /\bend\s*(\n|$)/.test(afterRule);

      if (!hasWhen) {
        this.addError(
          ruleStartLine,
          1,
          'MISSING_WHEN',
          `规则 "${ruleName}" 缺少 when 子句`,
          '请在规则中添加 when 子句来定义条件'
        );
      }

      if (!hasThen) {
        this.addError(
          ruleStartLine,
          1,
          'MISSING_THEN',
          `规则 "${ruleName}" 缺少 then 子句`,
          '请在规则中添加 then 子句来定义动作'
        );
      }

      if (!hasEnd) {
        this.addError(
          ruleStartLine,
          1,
          'MISSING_END',
          `规则 "${ruleName}" 缺少 end 关键字`,
          '请在规则末尾添加 end 关键字'
        );
      }

      if (hasWhen && hasThen) {
        const whenIndex = afterRule.indexOf('when');
        const thenIndex = afterRule.indexOf('then');

        if (thenIndex < whenIndex) {
          this.addError(
            ruleStartLine,
            1,
            'WRONG_ORDER',
            `规则 "${ruleName}" 中 then 子句在 when 子句之前`,
            '正确的顺序是：when ... then ... end'
          );
        }
      }
    }

    const whenThenEndMatches = code.match(/\b(when|then|end)\b/g) || [];
    let whenCount = 0, thenCount = 0, endCount = 0;

    whenThenEndMatches.forEach(keyword => {
      if (keyword === 'when') whenCount++;
      if (keyword === 'then') thenCount++;
      if (keyword === 'end') endCount++;
    });

    if (whenCount !== thenCount || whenCount !== endCount) {
      this.addError(
        1,
        1,
        'MISMATCHED_KEYWORDS',
        `when/then/end 关键字数量不匹配 (when: ${whenCount}, then: ${thenCount}, end: ${endCount})`,
        '每个规则应该包含相同数量的 when、then 和 end 关键字'
      );
    }
  }

  private checkBracketsBalance() {
    let bracketStack: { char: string; line: number; col: number }[] = [];

    this.lines.forEach((line, lineIndex) => {
      const lineNum = lineIndex + 1;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '(' || char === '[' || char === '{') {
          bracketStack.push({ char, line: lineNum, col: i + 1 });
        } else if (char === ')' || char === ']' || char === '}') {
          const last = bracketStack.pop();

          if (!last) {
            this.addError(
              lineNum,
              i + 1,
              'UNMATCHED_CLOSING',
              `多余的闭合括号 '${char}'`,
              '请检查是否有对应的开启括号'
            );
          } else if (
            (char === ')' && last.char !== '(') ||
            (char === ']' && last.char !== '[') ||
            (char === '}' && last.char !== '{')
          ) {
            this.addError(
              lineNum,
              i + 1,
              'MISMATCHED_BRACKETS',
              `括号不匹配：'${last.char}' 和 '${char}'`,
              `第 ${last.line} 行的 '${last.char}' 与第 ${lineNum} 行的 '${char}' 不匹配`
            );
          }
        }
      }
    });

    bracketStack.forEach(({ char, line, col }) => {
      this.addError(
        line,
        col,
        'UNCLOSED_BRACKET',
        `未闭合的括号 '${char}'`,
        '请添加对应的闭合括号'
      );
    });
  }

  private checkQuotesBalance() {
    this.lines.forEach((line, lineIndex) => {
      const lineNum = lineIndex + 1;
      let inString = false;
      let stringChar = '';
      let escapeNext = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (escapeNext) {
          escapeNext = false;
          continue;
        }

        if (char === '\\') {
          escapeNext = true;
          continue;
        }

        if (!inString && (char === '"' || char === "'")) {
          inString = true;
          stringChar = char;
        } else if (inString && char === stringChar) {
          inString = false;
          stringChar = '';
        }
      }

      if (inString) {
        this.addError(
          lineNum,
          line.length,
          'UNCLOSED_STRING',
          `未闭合的字符串（${stringChar}）`,
          '请确保字符串在同一行内闭合'
        );
      }
    });
  }

  private checkVariableNaming() {
    const variableRegex = /\$([a-zA-Z_][a-zA-Z0-9_]*)/g;

    this.lines.forEach((line, lineIndex) => {
      const lineNum = lineIndex + 1;
      let match;

      while ((match = variableRegex.exec(line)) !== null) {
        const varName = match[1];
        const col = match.index + 1;

        if (/^[A-Z]/.test(varName)) {
          this.addWarning(
            lineNum,
            col,
            'VARIABLE_UPPERCASE',
            `变量 '$${varName}' 以大写字母开头`,
            '建议使用小写字母开头的变量名，例如：$fact, $person'
          );
        }

        if (DrlSyntaxChecker.KEYWORDS.includes(varName)) {
          this.addWarning(
            lineNum,
            col,
            'VARIABLE_KEYWORD',
            `变量名 '$${varName}' 是 DRL 关键字`,
            '建议避免使用关键字作为变量名'
          );
        }
      }
    });
  }

  private checkIndentation() {
    this.lines.forEach((line, lineIndex) => {
      const lineNum = lineIndex + 1;
      const trimmedLine = line.trim();

      if (!trimmedLine) return;

      const leadingSpaces = line.length - line.trimStart().length;

      if (leadingSpaces % 4 !== 0 && leadingSpaces > 0) {
        this.addWarning(
          lineNum,
          1,
          'INDENTATION',
          `缩进不是 4 的倍数（当前 ${leadingSpaces} 个空格）`,
          '建议使用 4 个空格作为缩进单位'
        );
      }

      if (/\t/.test(line)) {
        this.addWarning(
          lineNum,
          line.indexOf('\t') + 1,
          'TAB_CHARACTER',
          '使用了 Tab 字符进行缩进',
          '建议使用空格代替 Tab 字符'
        );
      }
    });
  }

  private isLineInThenSection(lineIndex: number): boolean {
    let inThenSection = false;
    let inWhenSection = false;

    for (let i = 0; i <= lineIndex; i++) {
      const line = this.lines[i].trim().toLowerCase();
      
      if (line === 'when' || line.startsWith('when ')) {
        inWhenSection = true;
        inThenSection = false;
      } else if (line === 'then' || line.startsWith('then ')) {
        inWhenSection = false;
        inThenSection = true;
      } else if (line === 'end' || line.startsWith('end ')) {
        inWhenSection = false;
        inThenSection = false;
      }
    }

    return inThenSection;
  }

  private checkCommonMistakes() {
    this.lines.forEach((line, lineIndex) => {
      const lineNum = lineIndex + 1;
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('//')) return;

      if (/\bif\s*\(/.test(trimmedLine)) {
        this.addWarning(
          lineNum,
          trimmedLine.indexOf('if') + 1,
          'IF_STATEMENT',
          'DRL 中不推荐使用 if 语句',
          'DRL 使用 when 子句进行条件判断，考虑重构代码'
        );
      }

      if (/\bfor\s*\(/.test(trimmedLine) || /\bwhile\s*\(/.test(trimmedLine)) {
        this.addWarning(
          lineNum,
          1,
          'LOOP_STATEMENT',
          'DRL 中不推荐使用循环语句',
          '考虑使用 collect、accumulate 等 DRL 特性'
        );
      }

      if (/==\s*null/.test(trimmedLine)) {
        this.addWarning(
          lineNum,
          trimmedLine.indexOf('==') + 1,
          'NULL_CHECK',
          '使用 == null 进行空值检查',
          '在 DRL 中可以使用 == null，但建议确保对象存在'
        );
      }

      const doubleEqualsMatch = trimmedLine.match(/([^=!<>])=([^=])/);
      if (doubleEqualsMatch && !trimmedLine.includes('==')) {
        const isInThenSection = this.isLineInThenSection(lineIndex);
        if (!isInThenSection) {
          this.addError(
            lineNum,
            trimmedLine.indexOf('=') + 1,
            'SINGLE_EQUALS',
            '使用了单等号 = 进行比较',
            '在 DRL 条件中应该使用双等号 == 进行比较'
          );
        }
      }
    });
  }
}

export function checkDrlSyntax(code: string): DrlCheckResult {
  const checker = new DrlSyntaxChecker();
  return checker.check(code);
}
