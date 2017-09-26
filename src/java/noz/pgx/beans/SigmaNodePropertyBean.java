/*
 * Copyright (C) 2017 Nozomu Onuma

 * Project Name    : PgxRest
 * File Name       : SigmaNodePropertyBean.java
 * Encoding        : UTF-8
 * Creation Date   : 2017/09/26

 * This source code or any portion thereof must not be
 * reproduced or used in any manner whatsoever.
 */
package noz.pgx.beans;

import java.util.Objects;

/**
 *
 * @author nonuma
 */
public class SigmaNodePropertyBean {
    private Long id;
    private String label;
    private float x;
    private float y;
    private int size;
    private String color;

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public SigmaNodePropertyBean(Long id, String label, float x, float y, int size) {
        this.id = id;
        this.label = label;
        this.x = x;
        this.y = y;
        this.size = size;
    }

    public SigmaNodePropertyBean() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public float getX() {
        return x;
    }

    public void setX(float x) {
        this.x = x;
    }

    public float getY() {
        return y;
    }

    public void setY(float y) {
        this.y = y;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }
    
    @Override
    public boolean equals(Object obj){
        if(obj==null) return false;
        if(!(obj instanceof SigmaNodePropertyBean)) return false;
        if(this==obj) return true;
        
        SigmaNodePropertyBean other = (SigmaNodePropertyBean)obj;
        
        if(!Objects.equals(id, other.id)) return false;
        
        if(Objects.equals(id, other.id) && label.equals(other.label) ) return true;
        return false;
    }
    
    @Override
    public int hashCode(){
        final int oddPrime = 31;
        int result = oddPrime;
        
        result+=id;
        result*=oddPrime;
        result+=label.hashCode();
        result*=oddPrime;
        
        return result;
    }    
}
