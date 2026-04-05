package com.sdeintern1.Logistics.Mapper;

import com.sdeintern1.Logistics.DTO.BookingRequestDTO;
import com.sdeintern1.Logistics.DTO.BookingResponseDTO;
import com.sdeintern1.Logistics.Entity.Booking;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BookingMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    Booking toEntity(BookingRequestDTO requestDTO);

    BookingResponseDTO toResponseDTO(Booking entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(BookingRequestDTO dto, @MappingTarget Booking entity);
}
