/*
 * Copyright (C) 2017 Nozomu Onuma

 * Project Name    : PgxRest
 * File Name       : SigmaEdgePropertyBean.java
 * Encoding        : UTF-8
 * Creation Date   : 2017/09/26

 * This source code or any portion thereof must not be
 * reproduced or used in any manner whatsoever.
 */
package noz.pgx.beans;

import java.util.Objects;

/**
 *
 * @author Nozomu Onuma
 */
public class SigmaEdgePropertyBean {
    private Long id;
    private Long source;
    private Long target;

    public SigmaEdgePropertyBean(Long id, Long source, Long target) {
        this.id = id;
        this.source = source;
        this.target = target;
    }

    public SigmaEdgePropertyBean() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSource() {
        return source;
    }

    public void setSource(Long source) {
        this.source = source;
    }

    public Long getTarget() {
        return target;
    }

    public void setTarget(Long target) {
        this.target = target;
    }
    
        @Override
    public boolean equals(Object obj){
        if(obj==null) return false;
        if(!(obj instanceof SigmaEdgePropertyBean)) return false;
        if(this==obj) return true;
        
        SigmaEdgePropertyBean other = (SigmaEdgePropertyBean)obj;
        
        if(!Objects.equals(id, other.id)) return false;
        
        if(Objects.equals(id, other.id) && source.equals(other.source) && target.equals(other.target) ) return true;
        return false;
    }
    
    @Override
    public int hashCode(){
        final int oddPrime = 31;
        int result = oddPrime;
        
        result+=id;
        result*=oddPrime;
        result+=source.hashCode();
        result*=oddPrime;
        result+=target.hashCode();
        result*=oddPrime;
        
        return result;
    }    
}
