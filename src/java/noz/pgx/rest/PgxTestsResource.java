/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package noz.pgx.rest;

import java.io.FileReader;
import java.util.HashMap;
import java.util.Map;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.PathParam;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import net.arnx.jsonic.JSON;
import noz.pgx.beans.PgxProps;
import noz.pgx.dao.pgx.GraphDAO;

/**
 * REST Web Service
 *
 * @author nonuma
 */
@Path("/graphs")
public class PgxTestsResource {

    @Context
    private UriInfo context;
    private GraphDAO gdao;
    private PgxProps ppro;
    private int graphdepth = 3;
    private int additionaldepth = 2;

    /**
     * Creates a new instance of PgxTestsResource
     */
    public PgxTestsResource() throws Exception{
        gdao = new GraphDAO("http://192.168.56.122:7007");
        ppro = JSON.decode(new FileReader("C:\\Users\\nonuma\\PgxRest\\web\\resources\\vehiclegraph.json"),PgxProps.class);
    }

    /**
     * Retrieves representation of an instance of noz.pgx.rest.PgxTestsResource
     * @return an instance of java.lang.String
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getJson() {
        //TODO return proper representation object
        return "{test:json}";
    }
    
    @GET
    @Path("/pgx/category/")
    @Produces("application/json;charset=UTF-8")
    public String getRootCategory() throws Exception{
        return gdao.getRootCategory();
    }

    @GET
    @Path("/sigma/base/{category}/{graphdepth}/")
    @Produces("application/json;charset=UTF-8")
//    @Produces(MediaType.APPLICATION_JSON)
    public String getSigmaBaseJson(@PathParam("category") String category, @PathParam("graphdepth") int graphdepth) throws Exception{
        Long rootnodeid = gdao.getGraphRootNodeId(category);
        return gdao.getGraphJsonForSigma(rootnodeid, graphdepth);
    }
    @GET
    @Path("/sigma/additional/{nodeid}/{additionaldepth}")
    @Produces("application/json;charset=UTF-8")
//    @Produces(MediaType.APPLICATION_JSON)
    public String getSigmaAdditionalJson(@PathParam("nodeid") Long nodeid, @PathParam("additionaldepth") int additionaldepth) throws Exception{
        return gdao.getAdditionalGraphJsonForSigma(nodeid, additionaldepth);
    }
    @GET
    @Path("/sigma/vertexinfo/{nodeid}")
    @Produces("application/json;charset=UTF-8")
    public String getVertexInfo(@PathParam("nodeid") Long nodeid) throws Exception{
        String json = "";
        json = gdao.getNodeProperties(nodeid);
        return json;
    }
    
    @GET
    @Path("/pgx/setting")
    @Produces("application/json;charset=UTF-8")
    public String getPgxSetting() throws Exception{
        String json = "";
        Map vertex_props;
        Map edge_props;
        try{
//            PgxProps prop = JSON.decode(new FileReader("C:\\Users\\nonuma\\PgxRest\\web\\resources\\vehiclegraph.json"),PgxProps.class);
            vertex_props = this.ppro.getVertex_props();
            json = "{\"vertex_props\":[";
            for(int i = 0 ; i < vertex_props.size() ; i++){
                Map<String, String> vertexset = new HashMap();
                vertexset = (Map)vertex_props.get(i);
                json = json + "{\"name\":\"" +vertexset.get("name") + "\",\"type\":\"" + vertexset.get("type") + "\"},";
            }
            json = json.substring(0,json.length()-1) + "],";
            edge_props = ppro.getEdge_props();
            json = json + "\"edge_props\":[";
            for(int i = 0 ; i < edge_props.size() ; i++){
                Map<String,String> edgeset = new HashMap();
                edgeset = (Map)edge_props.get(i);
                json = json + "{\"name\":\"" +edgeset.get("name") + "\",\"type\":\"" + edgeset.get("type") + "\"},";
            }
            json = json.substring(0,json.length()-1) + "]}";
            
        }catch(Exception e){
            System.out.println(e);
        }    
            System.out.println(json);
        return json;
    }
    
    
    /**
     * POST method for creating an instance of PgxTestResource
     * @param content representation for the new resource
     * @return an HTTP response with content of the created resource
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response postJson(String content) {
        //TODO
        return Response.created(context.getAbsolutePath()).build();
    }

    /**
     * Sub-resource locator method for {id}
     */
    @Path("{id}")
    public PgxTestResource getPgxTestResource(@PathParam("id") String id) {
        return PgxTestResource.getInstance(id);
    }
}
