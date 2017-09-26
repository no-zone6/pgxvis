/*
 * Copyright (C) 2017 Nozomu Onuma

 * Project Name    : PgxRest
 * File Name       : PgxProps.java
 * Encoding        : UTF-8
 * Creation Date   : 2017/09/26

 * This source code or any portion thereof must not be
 * reproduced or used in any manner whatsoever.
 */
package noz.pgx.beans;

import java.util.Map;
/**
 *
 * @author nonuma
 */
public class PgxProps {
    String db_engine;
    String jdbc_url;
    String username;
    String password;
    String max_num_connections;
    String error_handling;
    String format;
    String name;
    Map vertex_props;
    Map edge_props;
    String loading;

    public String getDb_engine() {
        return db_engine;
    }

    public void setDb_engine(String db_engine) {
        this.db_engine = db_engine;
    }

    public String getJdbc_url() {
        return jdbc_url;
    }

    public void setJdbc_url(String jdbc_url) {
        this.jdbc_url = jdbc_url;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getMax_num_connections() {
        return max_num_connections;
    }

    public void setMax_num_connections(String max_num_connections) {
        this.max_num_connections = max_num_connections;
    }

    public String getError_handling() {
        return error_handling;
    }

    public void setError_handling(String error_handling) {
        this.error_handling = error_handling;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLoading() {
        return loading;
    }

    public void setLoading(String loading) {
        this.loading = loading;
    }
    
    public Map getVertex_props() {
        return vertex_props;
    }

    public void setVertex_props(Map vertex_props) {
        this.vertex_props = vertex_props;
    }

    public Map getEdge_props() {
        return edge_props;
    }

    public void setEdge_props(Map edge_props) {
        this.edge_props = edge_props;
    }
    
    
    
}
