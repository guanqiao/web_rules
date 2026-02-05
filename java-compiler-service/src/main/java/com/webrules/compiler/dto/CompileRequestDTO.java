package com.webrules.compiler.dto;

import lombok.Data;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

@Data
public class CompileRequestDTO {
    @NotEmpty(message = "Data models cannot be empty")
    @Valid
    private List<DataModelDTO> dataModels;

    private String ruleName;
    private String rulePackage;
    private String version;
    private boolean includeDrools;
    private String droolsContent;
}
