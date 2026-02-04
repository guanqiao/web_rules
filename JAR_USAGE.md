# Drools JAR 编译功能使用说明

## 功能概述

新增了将可视化规则编译成 Drools JAR 文件的功能，支持一键下载包含规则文件的 JAR 包。

## 使用方法

1. **创建规则流程**
   - 从左侧节点面板拖拽节点到画布
   - 支持的节点类型：开始、结束、条件、动作、决策、分组

2. **配置节点属性**
   - 点击节点选中
   - 在右侧属性面板配置节点参数
   - 连接节点形成规则流程

3. **下载 JAR 文件**
   - 点击工具栏的"下载 JAR"按钮
   - 系统会自动生成并下载 JAR 文件
   - 文件名格式：`{规则名称}-{版本号}.jar`

## JAR 文件内容

生成的 JAR 文件包含以下内容：

```
my-rules-1.0.0.jar
├── META-INF/
│   ├── MANIFEST.MF          # JAR 清单文件
│   └── kmodule.xml          # Drools KIE 模块配置
├── com/rules/
│   └── GeneratedRules.drl   # 编译后的 Drools 规则文件
└── pom.xml                  # Maven 项目配置文件
```

## MANIFEST.MF

包含 JAR 文件的元数据信息：

```properties
Manifest-Version: 1.0
Implementation-Title: GeneratedRules
Implementation-Version: 1.0.0
Implementation-Vendor: Web Rules
Implementation-Description: Generated Drools Rules
Created-By: Web Rules Drools Compiler
Build-Time: 2024-01-01T00:00:00.000Z
```

## kmodule.xml

Drools KIE 模块配置文件，定义了知识库和会话：

```xml
<kmodule xmlns="http://www.drools.org/xsd/kmodule">
    <kbase name="GeneratedRulesKBase" packages="com.rules">
        <ksession name="GeneratedRulesKSession" />
    </kbase>
</kmodule>
```

## pom.xml

Maven 项目配置文件，包含 Drools 依赖：

```xml
<dependencies>
    <dependency>
        <groupId>org.drools</groupId>
        <artifactId>drools-core</artifactId>
        <version>8.44.0.Final</version>
    </dependency>
    <dependency>
        <groupId>org.drools</groupId>
        <artifactId>drools-compiler</artifactId>
        <version>8.44.0.Final</version>
    </dependency>
    <dependency>
        <groupId>org.drools</groupId>
        <artifactId>drools-mvel</artifactId>
        <version>8.44.0.Final</version>
    </dependency>
    <dependency>
        <groupId>org.kie</groupId>
        <artifactId>kie-api</artifactId>
        <version>8.44.0.Final</version>
    </dependency>
</dependencies>
```

## 在 Java 项目中使用

### 方法 1：使用 KIE API

```java
import org.kie.api.KieServices;
import org.kie.api.builder.KieBuilder;
import org.kie.api.builder.KieFileSystem;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;

public class DroolsExample {
    public static void main(String[] args) {
        // 创建 KIE 服务
        KieServices kieServices = KieServices.Factory.get();
        
        // 创建 KIE 文件系统
        KieFileSystem kieFileSystem = kieServices.newKieFileSystem();
        
        // 加载 JAR 文件中的规则
        kieFileSystem.write(kieServices.getResources()
            .newClasspathResource("com/rules/GeneratedRules.drl"));
        
        // 构建 KIE 模块
        KieBuilder kieBuilder = kieServices.newKieBuilder(kieFileSystem);
        kieBuilder.buildAll();
        
        // 创建 KIE 容器
        KieContainer kieContainer = kieServices.newKieContainer(
            kieServices.getRepository().getDefaultReleaseId());
        
        // 创建 KIE 会话
        KieSession kieSession = kieContainer.newKieSession();
        
        // 插入事实并执行规则
        Object fact = new Object();
        kieSession.insert(fact);
        kieSession.fireAllRules();
        
        // 释放资源
        kieSession.dispose();
    }
}
```

### 方法 2：使用 Maven 项目

1. 将 JAR 文件解压到 Maven 项目结构中
2. 确保 `src/main/resources/com/rules/` 目录下有 `.drl` 文件
3. 确保 `src/main/resources/META-INF/` 目录下有 `kmodule.xml` 文件
4. 运行 `mvn clean install` 构建项目

### 方法 3：直接使用 JAR 文件

将 JAR 文件添加到项目的 classpath 中，然后使用 KIE API 加载：

```java
KieServices kieServices = KieServices.Factory.get();
KieContainer kieContainer = kieServices.getKieClasspathContainer();
KieSession kieSession = kieContainer.newKieSession("GeneratedRulesKSession");
```

## 配置选项

可以通过代码配置 JAR 文件的生成参数：

```typescript
import { compileToJar } from '@/engines/DroolsCompiler';

await compileToJar(nodes, connections, {
  version: '1.0.0',
  vendor: 'Your Company',
  description: 'Custom description',
  includeKModule: true
}, 'custom-name.jar');
```

## 技术实现

- **JSZip**: 用于创建 JAR 文件结构
- **file-saver**: 用于触发浏览器下载
- **DroolsCompiler**: 编译可视化规则为 DRL 格式

## 注意事项

1. JAR 文件包含的是规则源代码（.drl 文件），不是编译后的字节码
2. 需要在 Java 环境中使用 Drools 运行时来执行规则
3. 确保项目依赖 Drools 8.44.0.Final 或兼容版本
4. 生成的 JAR 文件可以直接用于开发和测试环境

## 常见问题

**Q: 为什么 JAR 文件中没有 .class 文件？**
A: Drools 规则在运行时动态编译，不需要预先编译成字节码。JAR 文件包含规则源代码和配置文件。

**Q: 如何自定义规则包名？**
A: 可以在 DroolsCompiler 中设置 packageName，默认为 'com.rules'。

**Q: 支持哪些 Drools 版本？**
A: 默认配置使用 Drools 8.44.0.Final，可以在 pom.xml 中修改版本号。
