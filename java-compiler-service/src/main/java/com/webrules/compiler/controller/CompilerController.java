package com.webrules.compiler.controller;

import com.webrules.compiler.dto.CompileRequestDTO;
import com.webrules.compiler.service.JavaCompilerService;
import com.webrules.compiler.service.JarBuilderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/compiler")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CompilerController {

    private final JavaCompilerService compilerService;
    private final JarBuilderService jarBuilderService;

    @PostMapping("/compile")
    public ResponseEntity<byte[]> compileAndDownloadJar(@Valid @RequestBody CompileRequestDTO request) {
        log.info("Received compile request for {} data models", request.getDataModels().size());
        
        try {
            Map<String, byte[]> compiledClasses = compilerService.compileDataModels(request.getDataModels());
            
            if (compiledClasses.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body("No classes were compiled successfully".getBytes());
            }
            
            String ruleName = request.getRuleName() != null ? request.getRuleName() : "compiled-models";
            String version = request.getVersion() != null ? request.getVersion() : "1.0.0";
            
            byte[] jarBytes = jarBuilderService.buildJar(
                compiledClasses,
                ruleName,
                version,
                "Web Rules",
                "Compiled data models from Web Rules Editor",
                request.isIncludeDrools(),
                request.getDroolsContent()
            );
            
            String filename = ruleName.toLowerCase().replaceAll("\\s+", "-") + "-" + version + ".jar";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(jarBytes.length);
            
            log.info("Successfully compiled and packaged JAR: {} ({} bytes)", filename, jarBytes.length);
            
            return new ResponseEntity<>(jarBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            log.error("Compilation failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(("Compilation failed: " + e.getMessage()).getBytes());
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Java Compiler Service is running");
    }
}
