package com.sdeintern1.Logistics.Controller;


import com.sdeintern1.Logistics.Entity.Booking;
import com.sdeintern1.Logistics.Entity.Load;
import com.sdeintern1.Logistics.Repository.LoadRepository;

import com.sdeintern1.Logistics.Service.BookingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/book")
public class BookingController {
    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

    @Autowired
    private BookingService bookingservice;

    @Autowired
    private LoadRepository loadrepo;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Booking Book){


        try {
            logger.info("Received booking request: {}", Book);

            UUID loadId = Book.getLoadId();
            Optional<Load> loadcheck = loadrepo.findById(loadId);
            if (loadcheck.isPresent()) {
                Load load = loadcheck.get();
                logger.info("Load found with ID: {}", loadId);
            } else {
                logger.warn("Load not found with ID: {}", loadId);

                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }


            if (loadcheck.get().getStatus() == Load.Status.CANCELLED) {
                logger.warn("Cannot book, load is CANCELLED: {}", loadId);
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            loadcheck.get().setStatus(Load.Status.BOOKED);
            loadrepo.save(loadcheck.get());
            logger.info("Load status updated to BOOKED for load ID: {}", loadId);

            Booking savedBooking = bookingservice.createentry(Book);
            logger.info("Booking created successfully with ID: {}", savedBooking.getId());


            return new ResponseEntity<>(savedBooking, HttpStatus.CREATED);
        }
        catch(Exception e){
            logger.error("Error occurred while creating booking", e);

            throw new RuntimeException(e);
        }
    }


    @GetMapping
    public ResponseEntity<?> getall(@RequestParam Map<String, String> params){
        try {
            logger.info("Fetching all bookings with transporterId: {} and proposedRate: {}", params.get("transporterId"),params.get("proposedRate"));

            List<String> allowed = List.of("transporterId", "proposedRate");

            for (String key : params.keySet()) {
                if (!allowed.contains(key)) {
                    logger.warn("Unknown filter used");
                    throw new IllegalArgumentException("Unknown filter parameter: " + key);
                }
            }
            String transporterId = params.get("transporterId");
            Double proposedRate = null;

            if (params.get("proposedRate") != null) {
                proposedRate = Double.valueOf(params.get("proposedRate"));
            }
            List<Booking> list=bookingservice.getAll(transporterId, proposedRate);
            if (list.isEmpty()) {
                logger.info("No Booking found with provided filters.");
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);  //
            }
            return new ResponseEntity<>(list,HttpStatus.FOUND);


        } catch (Exception e) {
            logger.error("No entry found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        }

    @GetMapping("{Id}")
    public ResponseEntity<?> getbyid(@PathVariable UUID Id){
        try {
            logger.info("Fetching booking by ID: {}", Id);
            Optional<Booking> bookingentry = bookingservice.getbyid(Id);
            if (bookingentry.isPresent()) {
                Optional<Load> load = loadrepo.findById(bookingentry.get().getLoadId());
                if (load.isPresent()) {
                    logger.info("Booking and associated Load found for booking ID: {}", Id);
                    return new ResponseEntity<>(bookingentry, HttpStatus.FOUND);
                } else {
                    logger.warn("Associated Load not found for booking ID: {}", Id);
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            } else {
                logger.warn("Booking not found with ID: {}", Id);

                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        catch(Exception e){
            logger.error("Error occurred while fetching booking by ID", e);
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("{loadId}")
    public ResponseEntity<?> deletebyid(@PathVariable UUID loadId){
        try {
            logger.info("Deleting booking with Load ID: {}", loadId);
            bookingservice.deletebyid(loadId);
            logger.info("Booking deleted successfully for Load ID: {}", loadId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        catch(Exception e){
            logger.error("Error occurred while deleting booking", e);
            throw new RuntimeException(e);
        }
    }
    @PutMapping("{BookId}")

    public ResponseEntity<?> updateentry(@PathVariable UUID BookId,@RequestBody Booking updatedLoad){
        try {
            logger.info("Updating booking with ID: {} with data: {}", BookId, updatedLoad);
            return new ResponseEntity<>(bookingservice.update(BookId, updatedLoad), HttpStatus.OK);
        }
        catch(Exception  e){
            logger.error("Error occurred while updating booking", e);
            throw new RuntimeException(e);
        }

    }



}
