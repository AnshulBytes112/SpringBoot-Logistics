package com.sdeintern1.Logistics.Service;


import com.sdeintern1.Logistics.Entity.Booking;
import com.sdeintern1.Logistics.Entity.Load;
import com.sdeintern1.Logistics.Repository.BookingRepository;
import com.sdeintern1.Logistics.Repository.LoadRepository;
import com.sdeintern1.Logistics.Specification.BookingSpecification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingrepo;
    @Autowired
    private LoadRepository loadrepo;

    @Autowired
    private LoadService loadservice;

        @Transactional
    public Booking createentry(Booking book){
            try {

                book.setStatus(Booking.Status.ACCEPTED);


                        return bookingrepo.save(book);
                    }



            catch (Exception e){
                throw new RuntimeException(e);
            }
    }

    public List<Booking> getAll(String transporterId,Double proposedRate){


        Specification<Booking> spec = Specification.where(BookingSpecification.hastransporterId(transporterId))
                .and(BookingSpecification.hasproposedRate(proposedRate));

        return bookingrepo.findAll(spec);
    }





    public Optional<Booking> getbyid(UUID id){
        return bookingrepo.findById(id);
    }

    public void deletebyid(UUID id){

            try{
                Optional<Load> load=loadrepo.findById(id);
                if(load.isPresent()){
                    Load loadentry=load.get();
                    loadentry.setStatus(Load.Status.CANCELLED);
                    loadrepo.save(loadentry);

                }

                bookingrepo.deleteById(id);
            }
            catch(Exception e){
                throw new RuntimeException(e);
            }

    }

    public Booking update(UUID id,Booking newentry) {

        Optional<Booking> oldentry = bookingrepo.findById(id);


        if (oldentry.isPresent()) {
            Booking old = oldentry.get();
            if (old.getLoadId() != null && old.getLoadId().equals(newentry.getLoadId()))
            {
            old.setProposedRate((newentry.getProposedRate() != null && !newentry.getProposedRate().isNaN()) ? newentry.getProposedRate() : old.getProposedRate());

            old.setComment((newentry.getComment() != null && !newentry.getComment().isEmpty()) ? newentry.getComment() : old.getComment());
            old.setStatus(newentry.getStatus() != null ? newentry.getStatus() : old.getStatus());


            return bookingrepo.save(old);}
            else{
                return oldentry.get();
            }

        } else {
            throw new RuntimeException("lOAD WITH ID" + id + "NOT FOUND");
        }

    }







    }
