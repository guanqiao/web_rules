package com.webrules.compiler.dto;

import lombok.Data;
import java.util.List;

@Data
public class DataModelDTO {
    private String id;
    private String name;
    private String packageName;
    private List<DataModelFieldDTO> fields;
    private String description;
    private String version;
    private String createdAt;
    private String updatedAt;
}
