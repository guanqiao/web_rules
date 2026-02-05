package com.webrules.compiler.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.jar.*;
import java.util.zip.Deflater;

@Slf4j
@Service
public class JarBuilderService {

    public byte[] buildJar(Map<String, byte[]> compiledClasses, String ruleName, 
                          String version, String vendor, String description,
                          boolean includeDrools, String droolsContent) throws IOException {
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try (JarOutputStream jos = new JarOutputStream(baos)) {
            jos.setLevel(Deflater.DEFAULT_COMPRESSION);
            
            addManifest(jos, ruleName, version, vendor, description);
            addCompiledClasses(jos, compiledClasses);
            
            if (includeDrools && droolsContent != null && !droolsContent.isEmpty()) {
                addDroolsFiles(jos, ruleName, droolsContent);
            }
            
            jos.finish();
        }
        
        log.info("Built JAR file: {} classes, {} bytes", compiledClasses.size(), baos.size());
        return baos.toByteArray();
    }

    private void addManifest(JarOutputStream jos, String ruleName, String version, 
                            String vendor, String description) throws IOException {
        Manifest manifest = new Manifest();
        Attributes attrs = manifest.getMainAttributes();
        
        attrs.put(Attributes.Name.MANIFEST_VERSION, "1.0");
        attrs.put(new Attributes.Name("Implementation-Title"), ruleName != null ? ruleName : "Compiled Models");
        attrs.put(new Attributes.Name("Implementation-Version"), version != null ? version : "1.0.0");
        attrs.put(new Attributes.Name("Implementation-Vendor"), vendor != null ? vendor : "Web Rules");
        attrs.put(new Attributes.Name("Implementation-Description"), description != null ? description : "Compiled Data Models");
        attrs.put(new Attributes.Name("Created-By"), "Web Rules Java Compiler Service");
        attrs.put(new Attributes.Name("Build-Time"), LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        
        JarEntry manifestEntry = new JarEntry("META-INF/MANIFEST.MF");
        jos.putNextEntry(manifestEntry);
        manifest.write(jos);
        jos.closeEntry();
        
        log.debug("Added MANIFEST.MF");
    }

    private void addCompiledClasses(JarOutputStream jos, Map<String, byte[]> compiledClasses) throws IOException {
        for (Map.Entry<String, byte[]> entry : compiledClasses.entrySet()) {
            String className = entry.getKey();
            byte[] bytecode = entry.getValue();
            
            String entryName = className.replace('.', '/') + ".class";
            JarEntry jarEntry = new JarEntry(entryName);
            jarEntry.setSize(bytecode.length);
            jarEntry.setTime(System.currentTimeMillis());
            
            jos.putNextEntry(jarEntry);
            jos.write(bytecode);
            jos.closeEntry();
            
            log.debug("Added class: {} ({} bytes)", entryName, bytecode.length);
        }
    }

    private void addDroolsFiles(JarOutputStream jos, String ruleName, String droolsContent) throws IOException {
        String packageName = "com/rules";
        String drlFileName = packageName + "/" + (ruleName != null ? ruleName : "Rules") + ".drl";
        
        JarEntry drlEntry = new JarEntry(drlFileName);
        byte[] drlBytes = droolsContent.getBytes();
        drlEntry.setSize(drlBytes.length);
        
        jos.putNextEntry(drlEntry);
        jos.write(drlBytes);
        jos.closeEntry();
        
        log.debug("Added DRL file: {}", drlFileName);
        
        String kmoduleContent = generateKModuleXml(packageName.replace('/', '.'));
        JarEntry kmoduleEntry = new JarEntry("META-INF/kmodule.xml");
        byte[] kmoduleBytes = kmoduleContent.getBytes();
        kmoduleEntry.setSize(kmoduleBytes.length);
        
        jos.putNextEntry(kmoduleEntry);
        jos.write(kmoduleBytes);
        jos.closeEntry();
        
        log.debug("Added kmodule.xml");
    }

    private String generateKModuleXml(String packageName) {
        return String.format("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
            "<kmodule xmlns=\"http://www.drools.org/xsd/kmodule\">\n" +
            "    <kbase name=\"rulesKBase\" packages=\"%s\">\n" +
            "        <ksession name=\"rulesKSession\" />\n" +
            "    </kbase>\n" +
            "</kmodule>\n", packageName);
    }
}
