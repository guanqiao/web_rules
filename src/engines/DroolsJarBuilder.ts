import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { DroolsRule, DataModel } from '@/types/rule.types';
import { JavaModelCompiler } from './JavaModelCompiler';

export interface JarBuildConfig {
  version?: string;
  vendor?: string;
  description?: string;
  includeKModule?: boolean;
  dataModels?: DataModel[];
}

export class DroolsJarBuilder {
  private rule: DroolsRule;
  private config: JarBuildConfig;

  constructor(rule: DroolsRule, config: JarBuildConfig = {}) {
    this.rule = rule;
    this.config = {
      version: config.version || '1.0.0',
      vendor: config.vendor || 'Web Rules',
      description: config.description || 'Generated Drools Rules',
      includeKModule: config.includeKModule !== false,
      dataModels: config.dataModels || []
    };
  }

  async buildJar(): Promise<Blob> {
    const zip = new JSZip();

    this.addManifest(zip);
    this.addDrlFile(zip);

    if (this.config.includeKModule) {
      this.addKModuleXml(zip);
    }

    this.addDataModelClasses(zip);
    this.addPomXml(zip);

    return await zip.generateAsync({ type: 'blob' });
  }

  private addDataModelClasses(zip: JSZip): void {
    if (this.config.dataModels && this.config.dataModels.length > 0) {
      const compiledModels = JavaModelCompiler.compileAll(this.config.dataModels);
      compiledModels.forEach((javaCode, filePath) => {
        zip.file(filePath, javaCode);
      });
    }
  }

  private addManifest(zip: JSZip): void {
    const manifest = `Manifest-Version: 1.0
Implementation-Title: ${this.rule.name}
Implementation-Version: ${this.config.version}
Implementation-Vendor: ${this.config.vendor}
Implementation-Description: ${this.config.description}
Created-By: Web Rules Drools Compiler
Build-Time: ${new Date().toISOString()}
`;

    zip.file('META-INF/MANIFEST.MF', manifest);
  }

  private addDrlFile(zip: JSZip): void {
    const drlContent = this.generateDrlContent();
    const packageName = this.rule.packageName.replace(/\./g, '/');
    zip.file(`${packageName}/${this.rule.name}.drl`, drlContent);
  }

  private addKModuleXml(zip: JSZip): void {
    const kModuleContent = `<?xml version="1.0" encoding="UTF-8"?>
<kmodule xmlns="http://www.drools.org/xsd/kmodule">
    <kbase name="${this.rule.name}KBase" packages="${this.rule.packageName}">
        <ksession name="${this.rule.name}KSession" />
    </kbase>
</kmodule>
`;
    zip.file('META-INF/kmodule.xml', kModuleContent);
  }

  private addPomXml(zip: JSZip): void {
    const pomContent = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>${this.rule.packageName}</groupId>
    <artifactId>${this.rule.name.toLowerCase().replace(/\s+/g, '-')}</artifactId>
    <version>${this.config.version}</version>
    <packaging>jar</packaging>

    <name>${this.rule.name}</name>
    <description>${this.config.description}</description>

    <properties>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <drools.version>8.44.0.Final</drools.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.drools</groupId>
            <artifactId>drools-core</artifactId>
            <version>\${drools.version}</version>
        </dependency>
        <dependency>
            <groupId>org.drools</groupId>
            <artifactId>drools-compiler</artifactId>
            <version>\${drools.version}</version>
        </dependency>
        <dependency>
            <groupId>org.drools</groupId>
            <artifactId>drools-mvel</artifactId>
            <version>\${drools.version}</version>
        </dependency>
        <dependency>
            <groupId>org.kie</groupId>
            <artifactId>kie-api</artifactId>
            <version>\${drools.version}</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>21</source>
                    <target>21</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
`;
    zip.file('pom.xml', pomContent);
  }

  private generateDrlContent(): string {
    let drl = `package ${this.rule.packageName};\n\n`;
    
    if (this.rule.imports && this.rule.imports.length > 0) {
      drl += '// Imports\n';
      this.rule.imports.forEach(imp => {
        drl += `import ${imp};\n`;
      });
      drl += '\n';
    }

    if (this.rule.globals && this.rule.globals.length > 0) {
      drl += '// Globals\n';
      this.rule.globals.forEach(global => {
        drl += `global ${global};\n`;
      });
      drl += '\n';
    }

    drl += '// Rules\n';
    this.rule.rules.forEach(rule => {
      drl += this.formatRule(rule);
      drl += '\n';
    });

    return drl;
  }

  private formatRule(rule: any): string {
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
    rule.when.forEach((clause: string) => {
      ruleStr += `        ${clause}\n`;
    });

    ruleStr += '    then\n';
    rule.then.forEach((statement: string) => {
      ruleStr += `        ${statement}\n`;
    });

    ruleStr += 'end\n';
    return ruleStr;
  }

  async downloadJar(filename?: string): Promise<void> {
    const blob = await this.buildJar();
    const defaultFilename = `${this.rule.name.toLowerCase().replace(/\s+/g, '-')}-${this.config.version}.jar`;
    saveAs(blob, filename || defaultFilename);
  }
}

export async function buildAndDownloadJar(
  rule: DroolsRule,
  config?: JarBuildConfig,
  filename?: string
): Promise<void> {
  const builder = new DroolsJarBuilder(rule, config);
  await builder.downloadJar(filename);
}
