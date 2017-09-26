/*
 * Copyright (C) 2017 Nozomu Onuma

 * Project Name    : PgxRest
 * File Name       : Logging.java
 * Encoding        : UTF-8
 * Creation Date   : 2017/09/26

 * This source code or any portion thereof must not be
 * reproduced or used in any manner whatsoever.
 */
package noz.pgx.util;

import java.util.Date;

/**
 *
 * @author Nozomu Onuma
 */
public class Logging {
    public static void outputlog (String memo){
        String logstr ="";
        Date d = new Date();
        logstr = d + "Class:" + Thread.currentThread().getStackTrace()[2].getClassName() + " ,Method: " +Thread.currentThread().getStackTrace()[2].getMethodName() + " msg:" +memo;
        
        System.out.println(logstr);
    }    
}
