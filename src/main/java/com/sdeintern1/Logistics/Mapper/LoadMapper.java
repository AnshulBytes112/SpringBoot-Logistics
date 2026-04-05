package com.sdeintern1.Logistics.Mapper;

import com.sdeintern1.Logistics.DTO.LoadRequestDTO;
import com.sdeintern1.Logistics.DTO.LoadResponseDTO;
import com.sdeintern1.Logistics.Entity.Load;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LoadMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    Load toEntity(LoadRequestDTO requestDTO);

    LoadResponseDTO toResponseDTO(Load entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(LoadRequestDTO dto, @MappingTarget Load entity);
}
