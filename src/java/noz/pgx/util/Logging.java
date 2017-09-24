/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package noz.pgx.util;

import java.util.Date;

/**
 *
 * @author nonuma
 */
public class Logging {
    public static void outputlog (String memo){
        String logstr ="";
        Date d = new Date();
        logstr = d + "Class:" + Thread.currentThread().getStackTrace()[2].getClassName() + " ,Method: " +Thread.currentThread().getStackTrace()[2].getMethodName() + " msg:" +memo;
        
        System.out.println(logstr);
    }    
}
