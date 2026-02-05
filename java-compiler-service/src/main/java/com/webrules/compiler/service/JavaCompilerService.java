package com.webrules.compiler.service;

import com.webrules.compiler.dto.DataModelDTO;
import com.webrules.compiler.dto.DataModelFieldDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.tools.*;
import java.io.*;
import java.net.URI;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class JavaCompilerService {

    private static final Map<String, String> TYPE_MAP = Map.of(
        "string", "String",
        "number", "double",
        "boolean", "boolean",
        "date", "java.time.LocalDateTime",
        "enum", "String",
        "object", "Object",
        "array", "java.util.List"
    );

    private static final Map<String, List<String>> IMPORT_MAP = Map.of(
        "date", List.of("import java.time.LocalDateTime;"),
        "array", List.of("import java.util.List;", "import java.util.ArrayList;")
    );

    public Map<String, byte[]> compileDataModels(List<DataModelDTO> dataModels) throws Exception {
        Map<String, byte[]> compiledClasses = new HashMap<>();
        
        for (DataModelDTO model : dataModels) {
            String javaCode = generateJavaCode(model);
            String className = model.getPackageName() + "." + model.getName();
            
            log.info("Compiling class: {}", className);
            byte[] bytecode = compileJavaCode(className, javaCode);
            
            if (bytecode != null) {
                compiledClasses.put(className, bytecode);
                log.info("Successfully compiled: {} ({} bytes)", className, bytecode.length);
            }
        }
        
        return compiledClasses;
    }

    private String generateJavaCode(DataModelDTO model) {
        StringBuilder sb = new StringBuilder();
        
        sb.append("package ").append(model.getPackageName()).append(";\n\n");
        
        Set<String> imports = new LinkedHashSet<>();
        for (DataModelFieldDTO field : model.getFields()) {
            List<String> fieldImports = IMPORT_MAP.get(field.getType());
            if (fieldImports != null) {
                imports.addAll(fieldImports);
            }
        }
        
        if (!imports.isEmpty()) {
            for (String imp : imports) {
                sb.append(imp).append("\n");
            }
            sb.append("\n");
        }
        
        sb.append("public class ").append(model.getName()).append(" {\n\n");
        
        for (DataModelFieldDTO field : model.getFields()) {
            if (field.getDescription() != null && !field.getDescription().isEmpty()) {
                sb.append("    /**\n");
                sb.append("     * ").append(field.getDescription()).append("\n");
                sb.append("     */\n");
            }
            
            String javaType = getJavaType(field);
            sb.append("    private ").append(javaType).append(" ").append(field.getName()).append(";\n\n");
        }
        
        sb.append(generateConstructors(model));
        sb.append(generateGettersAndSetters(model));
        sb.append(generateToString(model));
        sb.append(generateEquals(model));
        sb.append(generateHashCode(model));
        
        sb.append("}\n");
        
        return sb.toString();
    }

    private String getJavaType(DataModelFieldDTO field) {
        String baseType = TYPE_MAP.getOrDefault(field.getType(), "Object");
        
        if ("array".equals(field.getType()) && field.getItemsType() != null) {
            String itemType = TYPE_MAP.getOrDefault(field.getItemsType(), field.getItemsType());
            return "List<" + itemType + ">";
        }
        
        if ("object".equals(field.getType()) && field.getObjectType() != null) {
            return field.getObjectType();
        }
        
        return baseType;
    }

    private String generateConstructors(DataModelDTO model) {
        StringBuilder sb = new StringBuilder();
        
        sb.append("    public ").append(model.getName()).append("() {");
        
        for (DataModelFieldDTO field : model.getFields()) {
            if (field.getDefaultValue() != null) {
                sb.append("\n        this.").append(field.getName())
                  .append(" = ").append(formatDefaultValue(field)).append(";");
            } else if ("array".equals(field.getType())) {
                sb.append("\n        this.").append(field.getName())
                  .append(" = new ArrayList<>();");
            }
        }
        
        sb.append("\n    }\n\n");
        
        List<DataModelFieldDTO> requiredFields = model.getFields().stream()
            .filter(DataModelFieldDTO::isRequired)
            .collect(Collectors.toList());
        
        if (!requiredFields.isEmpty()) {
            sb.append("    public ").append(model.getName()).append("(");
            sb.append(requiredFields.stream()
                .map(f -> getJavaType(f) + " " + f.getName())
                .collect(Collectors.joining(", ")));
            sb.append(") {\n");
            
            for (DataModelFieldDTO field : requiredFields) {
                sb.append("        this.").append(field.getName())
                  .append(" = ").append(field.getName()).append(";\n");
            }
            
            for (DataModelFieldDTO field : model.getFields()) {
                if (!field.isRequired()) {
                    if (field.getDefaultValue() != null) {
                        sb.append("        this.").append(field.getName())
                          .append(" = ").append(formatDefaultValue(field)).append(";\n");
                    } else if ("array".equals(field.getType())) {
                        sb.append("        this.").append(field.getName())
                          .append(" = new ArrayList<>();\n");
                    }
                }
            }
            
            sb.append("    }\n\n");
        }
        
        return sb.toString();
    }

    private String formatDefaultValue(DataModelFieldDTO field) {
        Object value = field.getDefaultValue();
        if (value == null) return "null";
        
        return switch (field.getType()) {
            case "string", "enum" -> "\"" + value + "\"";
            case "number" -> value.toString();
            case "boolean" -> value.toString();
            case "date" -> value.toString().isEmpty() 
                ? "LocalDateTime.now()" 
                : "LocalDateTime.parse(\"" + value + "\")";
            case "array" -> "new ArrayList<>()";
            default -> "null";
        };
    }

    private String generateGettersAndSetters(DataModelDTO model) {
        StringBuilder sb = new StringBuilder();
        
        for (DataModelFieldDTO field : model.getFields()) {
            String capitalizedName = capitalizeFirstLetter(field.getName());
            String javaType = getJavaType(field);
            
            sb.append("    public ").append(javaType).append(" get")
              .append(capitalizedName).append("() {\n");
            sb.append("        return ").append(field.getName()).append(";\n");
            sb.append("    }\n\n");
            
            sb.append("    public void set").append(capitalizedName)
              .append("(").append(javaType).append(" ").append(field.getName()).append(") {\n");
            sb.append("        this.").append(field.getName()).append(" = ").append(field.getName()).append(";\n");
            sb.append("    }\n\n");
        }
        
        return sb.toString();
    }

    private String generateToString(DataModelDTO model) {
        StringBuilder sb = new StringBuilder();
        sb.append("    @Override\n");
        sb.append("    public String toString() {\n");
        sb.append("        return \"").append(model.getName()).append("{");
        
        for (int i = 0; i < model.getFields().size(); i++) {
            DataModelFieldDTO field = model.getFields().get(i);
            if (i > 0) sb.append(", ");
            sb.append(field.getName()).append("='").append(" + ")
              .append(field.getName()).append(" + '\''");
        }
        
        sb.append("}';\n");
        sb.append("    }\n\n");
        return sb.toString();
    }

    private String generateEquals(DataModelDTO model) {
        StringBuilder sb = new StringBuilder();
        sb.append("    @Override\n");
        sb.append("    public boolean equals(Object o) {\n");
        sb.append("        if (this == o) return true;\n");
        sb.append("        if (o == null || getClass() != o.getClass()) return false;\n");
        sb.append("        ").append(model.getName()).append(" that = (").append(model.getName()).append(") o;\n");
        sb.append("        return ");
        
        for (int i = 0; i < model.getFields().size(); i++) {
            DataModelFieldDTO field = model.getFields().get(i);
            if (i > 0) sb.append(" &&\n               ");
            
            String type = field.getType();
            if ("string".equals(type) || "array".equals(type) || "object".equals(type)) {
                sb.append("java.util.Objects.equals(").append(field.getName())
                  .append(", that.").append(field.getName()).append(")");
            } else {
                sb.append(field.getName()).append(" == that.").append(field.getName());
            }
        }
        
        sb.append(";\n");
        sb.append("    }\n\n");
        return sb.toString();
    }

    private String generateHashCode(DataModelDTO model) {
        StringBuilder sb = new StringBuilder();
        sb.append("    @Override\n");
        sb.append("    public int hashCode() {\n");
        sb.append("        return java.util.Objects.hash(");
        
        for (int i = 0; i < model.getFields().size(); i++) {
            if (i > 0) sb.append(", ");
            sb.append(model.getFields().get(i).getName());
        }
        
        sb.append(");\n");
        sb.append("    }\n\n");
        return sb.toString();
    }

    private byte[] compileJavaCode(String className, String javaCode) throws Exception {
        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        if (compiler == null) {
            throw new IllegalStateException("No Java compiler available. Ensure you are running on JDK, not JRE.");
        }

        InMemoryJavaFileObject fileObject = new InMemoryJavaFileObject(className, javaCode);
        Iterable<? extends JavaFileObject> compilationUnits = Collections.singletonList(fileObject);

        InMemoryFileManager fileManager = new InMemoryFileManager(
            compiler.getStandardFileManager(null, null, null)
        );

        List<String> options = Arrays.asList("-source", "21", "-target", "21");
        
        DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<>();
        JavaCompiler.CompilationTask task = compiler.getTask(
            null, fileManager, diagnostics, options, null, compilationUnits
        );

        boolean success = task.call();
        
        if (!success) {
            String errors = diagnostics.getDiagnostics().stream()
                .map(d -> d.getMessage(null))
                .collect(Collectors.joining("\n"));
            throw new RuntimeException("Compilation failed:\n" + errors);
        }

        return fileManager.getClassBytes(className);
    }

    private String capitalizeFirstLetter(String str) {
        if (str == null || str.isEmpty()) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }

    private static class InMemoryJavaFileObject extends SimpleJavaFileObject {
        private final String code;

        InMemoryJavaFileObject(String className, String code) {
            super(URI.create("string:///" + className.replace('.', '/') + Kind.SOURCE.extension), Kind.SOURCE);
            this.code = code;
        }

        @Override
        public CharSequence getCharContent(boolean ignoreEncodingErrors) {
            return code;
        }
    }

    private static class InMemoryFileManager extends ForwardingJavaFileManager<StandardJavaFileManager> {
        private final Map<String, InMemoryClassFileObject> classObjects = new HashMap<>();

        InMemoryFileManager(StandardJavaFileManager fileManager) {
            super(fileManager);
        }

        @Override
        public JavaFileObject getJavaFileForOutput(Location location, String className, JavaFileObject.Kind kind, FileObject sibling) {
            InMemoryClassFileObject fileObject = new InMemoryClassFileObject(className, kind);
            classObjects.put(className, fileObject);
            return fileObject;
        }

        byte[] getClassBytes(String className) {
            InMemoryClassFileObject fileObject = classObjects.get(className);
            return fileObject != null ? fileObject.getBytes() : null;
        }
    }

    private static class InMemoryClassFileObject extends SimpleJavaFileObject {
        private final ByteArrayOutputStream baos = new ByteArrayOutputStream();

        InMemoryClassFileObject(String className, Kind kind) {
            super(URI.create("mem:///" + className.replace('.', '/') + kind.extension), kind);
        }

        @Override
        public OutputStream openOutputStream() {
            return baos;
        }

        byte[] getBytes() {
            return baos.toByteArray();
        }
    }
}
