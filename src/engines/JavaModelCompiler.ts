import { DataModel, DataModelField } from '@/types/rule.types';

export class JavaModelCompiler {
  private static readonly TYPE_MAP: Record<string, string> = {
    'string': 'String',
    'number': 'double',
    'boolean': 'boolean',
    'date': 'java.time.LocalDateTime',
    'enum': 'String',
    'object': 'Object',
    'array': 'List'
  };

  private static readonly IMPORT_MAP: Record<string, string[]> = {
    'date': ['import java.time.LocalDateTime;'],
    'array': ['import java.util.List;', 'import java.util.ArrayList;']
  };

  private static capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private static camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  private static validateFieldName(name: string): string {
    if (!name.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/)) {
      throw new Error(`Invalid field name: ${name}. Field names must start with a letter, underscore, or dollar sign, and can only contain letters, digits, underscores, and dollar signs.`);
    }
    return name;
  }

  private static validateClassName(name: string): string {
    if (!name.match(/^[A-Z][a-zA-Z0-9_$]*$/)) {
      throw new Error(`Invalid class name: ${name}. Class names must start with an uppercase letter and can only contain letters, digits, underscores, and dollar signs.`);
    }
    return name;
  }

  private static generateImports(model: DataModel): string[] {
    const imports = new Set<string>();
    
    model.fields.forEach(field => {
      const fieldImports = JavaModelCompiler.IMPORT_MAP[field.type] || [];
      fieldImports.forEach(imp => imports.add(imp));
    });
    
    return Array.from(imports);
  }

  private static generateFieldDeclaration(field: DataModelField): string {
    const fieldName = JavaModelCompiler.validateFieldName(field.name);
    const javaType = JavaModelCompiler.TYPE_MAP[field.type] || 'Object';
    const fieldType = field.type === 'array' && field.itemsType 
      ? `List<${JavaModelCompiler.TYPE_MAP[field.itemsType] || field.itemsType}>` 
      : field.type === 'object' && field.objectType 
      ? field.objectType 
      : javaType;
    
    let declaration = `    private ${fieldType} ${fieldName};`;
    
    if (field.description) {
      declaration = `    /**
     * ${field.description}
     */
${declaration}`;
    }
    
    return declaration;
  }

  private static generateConstructor(model: DataModel): string {
    const requiredFields = model.fields.filter(field => field.required);
    const allFields = model.fields;
    
    let constructor = `    public ${model.name}() {`;
    
    allFields.forEach(field => {
      if (field.defaultValue !== undefined) {
        constructor += `
        this.${field.name} = ${JavaModelCompiler.formatDefaultValue(field)};`;
      } else if (field.type === 'array') {
        constructor += `
        this.${field.name} = new ArrayList<>();`;
      }
    });
    
    constructor += `
    }`;
    
    if (requiredFields.length > 0) {
      constructor += `

    public ${model.name}(${requiredFields.map(field => {
      const javaType = JavaModelCompiler.TYPE_MAP[field.type] || 'Object';
      const fieldType = field.type === 'array' && field.itemsType 
        ? `List<${JavaModelCompiler.TYPE_MAP[field.itemsType] || field.itemsType}>` 
        : field.type === 'object' && field.objectType 
        ? field.objectType 
        : javaType;
      return `${fieldType} ${field.name}`;
    }).join(', ')}) {`;
      
      requiredFields.forEach(field => {
        constructor += `
        this.${field.name} = ${field.name};`;
      });
      
      allFields.filter(field => !field.required).forEach(field => {
        if (field.defaultValue !== undefined) {
          constructor += `
        this.${field.name} = ${JavaModelCompiler.formatDefaultValue(field)};`;
        } else if (field.type === 'array') {
          constructor += `
        this.${field.name} = new ArrayList<>();`;
        }
      });
      
      constructor += `
    }`;
    }
    
    return constructor;
  }

  private static formatDefaultValue(field: DataModelField): string {
    const { defaultValue, type } = field;
    
    switch (type) {
      case 'string':
        return `"${defaultValue || ''}"`;
      case 'number':
        return String(defaultValue || 0);
      case 'boolean':
        return String(defaultValue || false);
      case 'date':
        return defaultValue 
          ? `LocalDateTime.parse("${defaultValue}")` 
          : 'LocalDateTime.now()';
      case 'enum':
        return `"${defaultValue || ''}"`;
      case 'object':
        return defaultValue || 'null';
      case 'array':
        return 'new ArrayList<>()';
      default:
        return 'null';
    }
  }

  private static generateGetter(field: DataModelField): string {
    const fieldName = field.name;
    const capitalizedName = JavaModelCompiler.capitalizeFirstLetter(fieldName);
    const javaType = JavaModelCompiler.TYPE_MAP[field.type] || 'Object';
    const fieldType = field.type === 'array' && field.itemsType 
      ? `List<${JavaModelCompiler.TYPE_MAP[field.itemsType] || field.itemsType}>` 
      : field.type === 'object' && field.objectType 
      ? field.objectType 
      : javaType;
    
    return `    public ${fieldType} get${capitalizedName}() {
        return ${fieldName};
    }`;
  }

  private static generateSetter(field: DataModelField): string {
    const fieldName = field.name;
    const capitalizedName = JavaModelCompiler.capitalizeFirstLetter(fieldName);
    const javaType = JavaModelCompiler.TYPE_MAP[field.type] || 'Object';
    const fieldType = field.type === 'array' && field.itemsType 
      ? `List<${JavaModelCompiler.TYPE_MAP[field.itemsType] || field.itemsType}>` 
      : field.type === 'object' && field.objectType 
      ? field.objectType 
      : javaType;
    
    return `    public void set${capitalizedName}(${fieldType} ${fieldName}) {
        this.${fieldName} = ${fieldName};
    }`;
  }

  private static generateToString(model: DataModel): string {
    let toString = `    @Override
    public String toString() {
        return "${model.name}{" +`;
    
    model.fields.forEach((field, index) => {
      const separator = index === model.fields.length - 1 ? '' : ' + ", " +';
      toString += `
            "${field.name}=${'${' + field.name + '}'}"` + separator;
    });
    
    toString += `
        + "}";
    }`;
    
    return toString;
  }

  private static generateEquals(model: DataModel): string {
    let equals = `    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ${model.name} that = (${model.name}) o;
        return `;
    
    model.fields.forEach((field, index) => {
      const separator = index === model.fields.length - 1 ? '' : ' &&';
      const fieldName = field.name;
      const fieldType = JavaModelCompiler.TYPE_MAP[field.type] || 'Object';
      
      if (fieldType === 'String' || fieldType === 'List' || fieldType === 'Object') {
        equals += `java.util.Objects.equals(${fieldName}, that.${fieldName})` + separator;
      } else {
        equals += `${fieldName} == that.${fieldName}` + separator;
      }
    });
    
    equals += `;
    }`;
    
    return equals;
  }

  private static generateHashCode(model: DataModel): string {
    let hashCode = `    @Override
    public int hashCode() {
        return java.util.Objects.hash(`;
    
    model.fields.forEach((field, index) => {
      const separator = index === model.fields.length - 1 ? '' : ', ';
      hashCode += field.name + separator;
    });
    
    hashCode += `);
    }`;
    
    return hashCode;
  }

  public static compile(model: DataModel): string {
    const className = JavaModelCompiler.validateClassName(model.name);
    const packageName = model.packageName;
    
    let javaCode = `package ${packageName};

`;
    
    const imports = JavaModelCompiler.generateImports(model);
    if (imports.length > 0) {
      javaCode += imports.join('\n') + '\n\n';
    }
    
    javaCode += `public class ${className} {

`;
    
    model.fields.forEach(field => {
      javaCode += JavaModelCompiler.generateFieldDeclaration(field) + '\n\n';
    });
    
    javaCode += JavaModelCompiler.generateConstructor(model) + '\n\n';
    
    model.fields.forEach(field => {
      javaCode += JavaModelCompiler.generateGetter(field) + '\n\n';
      javaCode += JavaModelCompiler.generateSetter(field) + '\n\n';
    });
    
    javaCode += JavaModelCompiler.generateToString(model) + '\n\n';
    javaCode += JavaModelCompiler.generateEquals(model) + '\n\n';
    javaCode += JavaModelCompiler.generateHashCode(model) + '\n';
    
    javaCode += `}
`;
    
    return javaCode;
  }

  public static compileAll(models: DataModel[]): Map<string, string> {
    const compiledModels = new Map<string, string>();
    
    models.forEach(model => {
      try {
        const javaCode = JavaModelCompiler.compile(model);
        const packagePath = model.packageName.replace(/\./g, '/');
        const fileName = `${packagePath}/${model.name}.java`;
        compiledModels.set(fileName, javaCode);
      } catch (error) {
        console.error(`Error compiling model ${model.name}:`, error);
        throw error;
      }
    });
    
    return compiledModels;
  }

  public static getJavaFileName(model: DataModel): string {
    return `${model.name}.java`;
  }

  public static getJavaFilePath(model: DataModel): string {
    const packagePath = model.packageName.replace(/\./g, '/');
    return `${packagePath}/${model.name}.java`;
  }
}

export function compileDataModel(model: DataModel): string {
  return JavaModelCompiler.compile(model);
}

export function compileDataModels(models: DataModel[]): Map<string, string> {
  return JavaModelCompiler.compileAll(models);
}