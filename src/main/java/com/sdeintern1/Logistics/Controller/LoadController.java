package com.sdeintern1.Logistics.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sdeintern1.Logistics.Entity.Load;
import com.sdeintern1.Logistics.Service.LoadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/load")
public class LoadController {
    private static final Logger logger = LoggerFactory.getLogger(LoadController.class);

    @Autowired
    private LoadService loadservice;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Load load){
        logger.info("Creating new load entry: {}", load);
        try {
            logger.info("Creating new load entry: {}", load);
            Load savedload= loadservice.saveentry(load);
            return new ResponseEntity<>(savedload, HttpStatus.CREATED);
        }
        catch(Exception e){
            logger.error("Error while saving Load: {}", e.getMessage());
            return new ResponseEntity<>("Failed to create load: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<?> getfilter(@RequestParam Map<String, String> params){


        try{
            logger.info("Fetching loads with filters - shipperId: {}, productType: {}, truckType: {}", params.get("shipperId"), params.get("productType"), params.get("truckType"));

            List<String> allowed = List.of("shipperId", "productType", "truckType");

            for (String key : params.keySet()) {
                if (!allowed.contains(key)) {
                    logger.warn("Unknown filter used");
                    throw new IllegalArgumentException("Unknown filter parameter: " + key);
                }
            }
            List<Load> list=loadservice.getbyfilter(params.get("shipperId"), params.get("productType"), params.get("truckType"));
            if (list.isEmpty()) {
                logger.info("No loads found with provided filters.");
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);  //
            }
            return new ResponseEntity<>(list,HttpStatus.FOUND);

        }
        catch(Exception e){
            logger.error("Error while fetching loads: {}", e.getMessage());
            return new ResponseEntity<>("Error retrieving loads: " + e.getMessage(), HttpStatus.NOT_FOUND);        }
    }



    @GetMapping("{loadId}")
    public ResponseEntity<?> getbyid(@PathVariable UUID loadId) {
        logger.info("Fetching load by ID: {}", loadId);

        Optional<Load> loadentry = loadservice.getbyid(loadId);
        if (loadentry.isPresent()) {
            return new ResponseEntity<>(loadentry, HttpStatus.FOUND);
        } else {
            logger.warn("Load with ID {} not found", loadId);
            return new ResponseEntity<>("Load not found with ID: " + loadId, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("{loadId}")
    public ResponseEntity<?> deletebyid(@PathVariable UUID loadId){
        logger.info("Deleting load with ID: {}", loadId);

        try {
            loadservice.deletebyid(loadId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        catch(Exception e){
            logger.error("Error deleting load with ID {}: {}", loadId, e.getMessage());
            return new ResponseEntity<>("Failed to delete load: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("{LoadId}")

    public ResponseEntity<?> updateentry(@PathVariable UUID LoadId,@RequestBody Load updatedLoad){
        logger.info("Updating load with ID: {}", LoadId);
        try {
            return new ResponseEntity<>(loadservice.update(LoadId, updatedLoad), HttpStatus.OK);
        }
        catch (Exception e){
            logger.error("Error updating load with ID {}: {}", LoadId, e.getMessage());
            return new ResponseEntity<>("Failed to update load: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }






}
