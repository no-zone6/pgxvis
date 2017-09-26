/*
 * Copyright (C) 2017 Nozomu Onuma

 * Project Name    : PgxRest
 * File Name       : PgxTestResource.java
 * Encoding        : UTF-8
 * Creation Date   : 2017/09/26

 * This source code or any portion thereof must not be
 * reproduced or used in any manner whatsoever.
 */
package noz.pgx.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.DELETE;
import javax.ws.rs.core.MediaType;

/**
 * REST Web Service
 *
 * @author nonuma
 */
public class PgxTestResource {

    private String id = "id1";

    /**
     * Creates a new instance of PgxTestResource
     */
    private PgxTestResource(String id) {
        this.id = id;
    }

    /**
     * Get instance of the PgxTestResource
     */
    public static PgxTestResource getInstance(String id) {
        // The user may use some kind of persistence mechanism
        // to store and restore instances of PgxTestResource class.
        return new PgxTestResource(id);
    }

    /**
     * Retrieves representation of an instance of noz.pgx.rest.PgxTestResource
     * @return an instance of java.lang.String
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getJson() {
        //TODO return proper representation object
        return "{test:" + this.id + "}";
    }

    /**
     * PUT method for updating or creating an instance of PgxTestResource
     * @param content representation for the resource
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public void putJson(String content) {
    }

    /**
     * DELETE method for resource PgxTestResource
     */
    @DELETE
    public void delete() {
    }
}
