package com.sdeintern1.Logistics.Service;


import com.sdeintern1.Logistics.Entity.Load;

import com.sdeintern1.Logistics.Repository.LoadRepository;
import com.sdeintern1.Logistics.Specification.LoadSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LoadService {

    @Autowired
    private LoadRepository loadrepo;


    //    @Transactional
    public Load saveentry(Load load){
        load.setDatePosted(new Timestamp(System.currentTimeMillis()));
        return loadrepo.save(load);

    }

    public List<Load> getbyfilter(String shipperId, String productType, String truckType){

        Specification<Load> spec = Specification.where(LoadSpecification.hasShipperId(shipperId))
                .and(LoadSpecification.hasProductType(productType))
                .and(LoadSpecification.hasTruckType(truckType));

        return loadrepo.findAll(spec);
    }




    public Optional<Load> getbyid(UUID id){
        return loadrepo.findById(id);
    }
    public void deletebyid(UUID id){
        loadrepo.deleteById(id);
    }

    public Load update(UUID id,Load newentry){

        Optional<Load> oldentry=loadrepo.findById(id);

        if(oldentry.isPresent()){
            Load old=oldentry.get();
            old.setShipperId((newentry.getShipperId() != null && !newentry.getShipperId().isEmpty()) ? newentry.getShipperId() : old.getShipperId());
            old.setProductType((newentry.getProductType() != null && !newentry.getProductType().isEmpty()) ? newentry.getProductType() : old.getProductType());
            old.setTruckType((newentry.getTruckType() != null && !newentry.getTruckType().isEmpty()) ? newentry.getTruckType() : old.getTruckType());
            old.setNoOfTrucks(newentry.getNoOfTrucks() > 0 ? newentry.getNoOfTrucks() : old.getNoOfTrucks());
            old.setWeight(newentry.getWeight() > 0 ? newentry.getWeight() : old.getWeight());
            old.setComment((newentry.getComment() != null && !newentry.getComment().isEmpty()) ? newentry.getComment() : old.getComment());
            old.setStatus(newentry.getStatus() != null ? newentry.getStatus() : old.getStatus());

            if (newentry.getFacility() != null) {
                Load.Facility oldFacility = getFacility(newentry, old);

                old.setFacility(oldFacility);
            }
            return loadrepo.save(old);

        } else{
            throw new RuntimeException("lOAD WITH ID" + id +"NOT FOUND");
        }





    }

    private static Load.Facility getFacility(Load newentry, Load old) {
        Load.Facility oldFacility = old.getFacility() != null ? old.getFacility() : new Load.Facility();
        Load.Facility newFacility = newentry.getFacility();

        oldFacility.setLoadPoint((newFacility.getLoadPoint() != null && !newFacility.getLoadPoint().isEmpty()) ? newFacility.getLoadPoint() : oldFacility.getLoadPoint());
        oldFacility.setUnloadingPoint((newFacility.getUnloadingPoint() != null && !newFacility.getUnloadingPoint().isEmpty()) ? newFacility.getUnloadingPoint() : oldFacility.getUnloadingPoint());
        oldFacility.setLoadingDate(newFacility.getLoadingDate() != null ? newFacility.getLoadingDate() : oldFacility.getLoadingDate());
        oldFacility.setUnloadingDate(newFacility.getUnloadingDate() != null ? newFacility.getUnloadingDate() : oldFacility.getUnloadingDate());
        return oldFacility;
    }


}
