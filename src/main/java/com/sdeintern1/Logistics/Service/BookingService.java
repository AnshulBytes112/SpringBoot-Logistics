package com.sdeintern1.Logistics.Service;

import com.sdeintern1.Logistics.DTO.BookingRequestDTO;
import com.sdeintern1.Logistics.DTO.BookingResponseDTO;
import com.sdeintern1.Logistics.Entity.Booking;
import com.sdeintern1.Logistics.Entity.Load;
import com.sdeintern1.Logistics.Mapper.BookingMapper;
import com.sdeintern1.Logistics.Repository.BookingRepository;
import com.sdeintern1.Logistics.Repository.LoadRepository;
import com.sdeintern1.Logistics.Specification.BookingSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final LoadRepository loadRepository;
    private final BookingMapper bookingMapper;

    @Transactional
    @CacheEvict(value = "bookings", allEntries = true)
    public BookingResponseDTO createEntry(BookingRequestDTO requestDTO) {
        log.debug("Creating booking for load: {} by transporter: {}", requestDTO.getLoadId(), requestDTO.getTransporterId());
        
        Load load = loadRepository.findById(requestDTO.getLoadId())
                .orElseThrow(() -> new RuntimeException("Load not found with ID: " + requestDTO.getLoadId()));

        if (load.getStatus() != Load.Status.POSTED) {
            throw new RuntimeException("Cannot book a load that is not in POSTED status");
        }

        Booking booking = bookingMapper.toEntity(requestDTO);
        booking.setStatus(Booking.Status.PENDING);
        Booking savedBooking = bookingRepository.save(booking);
        
        return bookingMapper.toResponseDTO(savedBooking);
    }

    @Cacheable(value = "bookings", key = "#transporterId + '-' + #proposedRate")
    public List<BookingResponseDTO> getAll(String transporterId, Double proposedRate) {
        log.debug("Fetching bookings with filter - Transporter: {}, Rate: {}", transporterId, proposedRate);
        Specification<Booking> spec = Specification.where(BookingSpecification.hastransporterId(transporterId))
                .and(BookingSpecification.hasproposedRate(proposedRate));

        return bookingRepository.findAll(spec).stream()
                .map(bookingMapper::toResponseDTO)
                .toList();
    }

    @Cacheable(value = "bookings", key = "#id")
    public BookingResponseDTO getById(UUID id) {
        log.debug("Fetching booking by ID: {}", id);
        return bookingRepository.findById(id)
                .map(bookingMapper::toResponseDTO)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));
    }

    @Transactional
    @CacheEvict(value = "bookings", key = "#id")
    public void deleteById(UUID id) {
        log.debug("Soft deleting booking with ID: {}", id);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        bookingRepository.deleteById(id);
    }

    @Transactional
    @CachePut(value = "bookings", key = "#id")
    public BookingResponseDTO update(UUID id, BookingRequestDTO requestDTO) {
        log.debug("Updating booking with ID: {}", id);
        Booking existingBooking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        bookingMapper.updateEntityFromDTO(requestDTO, existingBooking);
        
        // Logical check: if status is changed to ACCEPTED, update the load status
        if (existingBooking.getStatus() == Booking.Status.ACCEPTED) {
            Load load = loadRepository.findById(existingBooking.getLoadId())
                    .orElseThrow(() -> new RuntimeException("Load not found for this booking"));
            load.setStatus(Load.Status.BOOKED);
            loadRepository.save(load);
        }

        Booking updatedBooking = bookingRepository.save(existingBooking);
        return bookingMapper.toResponseDTO(updatedBooking);
    }
}
