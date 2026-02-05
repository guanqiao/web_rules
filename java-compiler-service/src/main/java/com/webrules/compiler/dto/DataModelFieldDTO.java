package com.webrules.compiler.dto;

import lombok.Data;
import java.util.List;

@Data
public class DataModelFieldDTO {
    private String id;
    private String name;
    private String type;
    private boolean required;
    private Object defaultValue;
    private String description;
    private List<String> enumValues;
    private String itemsType;
    private String objectType;
}
