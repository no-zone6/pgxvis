/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package noz.pgx.dao.pgx;

import java.io.FileReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import oracle.pgx.api.*;
import oracle.pgx.config.*;
import net.arnx.jsonic.JSON;
import noz.pgx.beans.PgxProps;
import noz.pgx.beans.SigmaEdgePropertyBean;
import noz.pgx.beans.SigmaNodePropertyBean;
import static noz.pgx.util.Logging.outputlog;
/**
 *
 * @author Nozomu Onuma
 */
public class GraphDAO {
    private final PgxGraph graph;
    private final PgxProps ppro;
    
    public GraphDAO(String pgxserver) throws Exception{
        outputlog(":GraphDAO has been constructed.");
        
        ServerInstance instance = Pgx.getInstance(pgxserver);
        PgxSession session = instance.createSession("my-session");
        GraphConfig config = GraphConfigFactory.forAnyFormat().fromPath("C:\\Users\\nonuma\\PgxRest\\web\\resources\\vehiclegraph.json");
        
        graph = session.readGraphWithProperties(config);
        ppro = JSON.decode(new FileReader("C:\\Users\\nonuma\\PgxRest\\web\\resources\\vehiclegraph.json"),PgxProps.class);
    }
    
    public Long getGraphRootNodeId(String graphtype){
        outputlog( ":get Graph Root Node ID");
        Long nodeid =0l;
        try{
            //ルートノードの取得
            PgqlResultSet resultSet = graph.queryPgql("SELECT x.id() WHERE (x),x.isroot = 1,  x.type = '" + graphtype +"'");
            for(PgqlResult result : resultSet.getResults()){
                nodeid = result.getLong(0);
                  outputlog(":Graph Root Node ID is " + nodeid);   
            }
        }catch(Exception e){
            System.out.println(e);            
        }
        return nodeid;
    }
   
    public String getGraphJsonForSigma(Long rootnodeid, int depth) throws Exception{
        //本命
        outputlog(":get Graph data for Sigma JSON");
        
        String json = "";
        //Sigma似合わせたJSON出力用HashMap
        HashMap map = new HashMap<String,List>();
        //ループ処理用リストの雛形
        List[] rooplist = new ArrayList[depth];
        //ルートノード用リスト
        List rootlist = new ArrayList();
        
        try{            
            //ノード情報の取得
            List nodelist = new ArrayList();            
            //重複排除
            Set<SigmaNodePropertyBean> constset_n = new HashSet<>();
            //ルートノードの取得
            PgqlResultSet resultSet = graph.queryPgql("SELECT x.id(), x.name, x.type WHERE (x), x.id() = " + rootnodeid );
            int x = 0;
            int y = 0;
            int size = 2;
            String color = "#c0392b";
            for(PgqlResult result : resultSet.getResults()){
                SigmaNodePropertyBean node = new SigmaNodePropertyBean();
                node.setId(result.getLong(0));
                node.setLabel(result.getString(1));
                node.setX(x);
                node.setY(y);
                node.setSize(size);
                node.setColor(color);
                rootlist.add(node);
                outputlog(":Graph Root Node Class has " + node.getId());
            }
            int i = 0;
            nodelist.addAll(rootlist);
            rooplist[i] = rootlist;
            while(i < depth - 1){
                List sublist = new ArrayList();
                outputlog(":call the Graph Sub Node List for Depth No." + i);
                sublist = this.getSubGraphNodeList(rooplist[i], i+1);
                i++;
                rooplist[i] = sublist;
                nodelist.addAll(sublist);
            }
            constset_n.addAll(nodelist);
            nodelist.clear();
            nodelist.addAll(constset_n);
            map.put("nodes",nodelist);
            
            //エッジリストの作成
            List edgelist = new ArrayList();     
            //重複排除
            Set<SigmaEdgePropertyBean> constset_e = new HashSet<>();
            int k = 0;
            while(k < depth -1){
                List sublist = new ArrayList();
                outputlog(":call the Graph Edge List for Depth No." +k);
                sublist = this.getSubGraphEdgeList(rooplist[k]);
                k++;
                edgelist.addAll(sublist);
            }
            constset_e.addAll(edgelist);
            edgelist.clear();
            edgelist.addAll(constset_e);
            map.put("edges",edgelist);
                
        }catch(Exception e){
            System.out.println(e);            
        }
        
        //JSONへの変換
        json = JSON.encode(map);
        //JSONを念のためファイルで出力
/*        File file = new File("C:\\Users\\nonuma\\Documents\\NetBeansProjects\\JavaApplication2\\sigmalog.txt");
        PrintWriter pw = new PrintWriter(new BufferedWriter(new FileWriter(file)));
        pw.println(json);
        pw.close();
*/            
        return json;
    }
    
    public String getAdditionalGraphJsonForSigma(Long rootnodeid, int depth) throws Exception{
        outputlog(":get additional Graph data for Sigma JSON. root node id is " + rootnodeid + "  depth is " + depth);
        String json = "";
        //Sigma似合わせたJSON出力用HashMap
        HashMap map = new HashMap<String,List>();
        //ループ処理用リストの雛形
        List[] rooplist = new ArrayList[depth];
        //ルートノード用リスト
        List rootlist = new ArrayList();
        
        try{            
            //ノード情報の取得
            List nodelist = new ArrayList();            
            //重複排除
            Set<SigmaNodePropertyBean> constset_n = new HashSet<>();
            //ルートノードの取得
            PgqlResultSet resultSet = graph.queryPgql("SELECT x.id(), x.name, x.type WHERE (x), x.id() = " + rootnodeid );
            int x = 0;
            int y = 0;
            int size = 2;
            String color = "";
            for(PgqlResult result : resultSet.getResults()){
                SigmaNodePropertyBean node = new SigmaNodePropertyBean();
                node.setId(result.getLong(0));
                node.setLabel(result.getString(1));
                node.setX(x);
                node.setY(y);
                node.setSize(size);
                node.setColor(color);
                rootlist.add(node);
                outputlog(":Graph Root Node Class has " + node.getId());
            }
            int i = 0;
//            nodelist.addAll(rootlist);
            rooplist[i] = rootlist;
            while(i < depth - 1){
                List sublist = new ArrayList();
                outputlog(":call the Graph Sub Node List for Depth No." + i);
                sublist = this.getSubGraphNodeList(rooplist[i], i+1);
                i++;
                rooplist[i] = sublist;
                nodelist.addAll(sublist);
            }
            constset_n.addAll(nodelist);
            nodelist.clear();
            nodelist.addAll(constset_n);
            map.put("nodes",nodelist);
            
            //エッジリストの作成
            List edgelist = new ArrayList();     
            //重複排除
            Set<SigmaEdgePropertyBean> constset_e = new HashSet<SigmaEdgePropertyBean>();
            int k = 0;
            while(k < depth -1){
                List sublist = new ArrayList();
                outputlog(":call the Graph Edge List for Depth No." +k);
                sublist = this.getSubGraphEdgeList(rooplist[k]);
                k++;
                edgelist.addAll(sublist);
            }
            constset_e.addAll(edgelist);
            edgelist.clear();
            edgelist.addAll(constset_e);
            map.put("edges",edgelist);
                
        }catch(Exception e){
            System.out.println(e);            
        }
        
        //JSONへの変換
        json = JSON.encode(map);
        //JSONを念のためファイルで出力
/*        File file = new File("C:\\Users\\nonuma\\Documents\\NetBeansProjects\\JavaApplication2\\sigmalog.txt");
        PrintWriter pw = new PrintWriter(new BufferedWriter(new FileWriter(file)));
        pw.println(json);
        pw.close();
*/            
        return json;
    }
    
    public String getNodeProperties(Long nodeid) throws Exception{
        String json ="{";
        String pgqlstr = "SELECT";
        try{
            Map vertex_props = ppro.getVertex_props();
            for(int i = 0 ; i < vertex_props.size() ; i++){
                Map<String, String> vertexset = new HashMap();
                vertexset = (Map)vertex_props.get(i);
                pgqlstr = pgqlstr + " x."+vertexset.get("name") +",";
            }
            pgqlstr = pgqlstr.substring(0,pgqlstr.length()-1) + " WHERE (x), x.id() = "+ nodeid;
            System.out.println(pgqlstr);
            
            PgqlResultSet resultSet = graph.queryPgql(pgqlstr);
            for(PgqlResult result : resultSet.getResults()){
                for(int k =0 ; k < vertex_props.size() ; k++){
                    Map<String, String> vertexset = new HashMap();
                    vertexset = (Map)vertex_props.get(k);
                    json = json + "\"" + vertexset.get("name") + "\":";
                    switch (vertexset.get("type")) {
                        case "integer":
                            json = json + result.getInteger(k) + ",";
                            break;
                        case "float":
                            json = json + result.getFloat(k) + ",";
                            break;
                        default:
                            json = json + "\"" + result.getString(k) + "\",";
                            break;
                    }
                }                
            }
            json = json.substring(0,json.length()-1) + "}";
                    
        }catch(Exception e){
            System.out.println(e);
        }
        return json;
    }
    
    public String getRootCategory() throws Exception{
        String json ="";
        HashMap map = new HashMap();
        List list = new ArrayList();
        int i = 0;
        try{
            //ルートノードの取得
            PgqlResultSet resultSet = graph.queryPgql("SELECT x.type WHERE (x),x.isroot = 1");
            for(PgqlResult result : resultSet.getResults()){
                list.add(i,result.getString(0));
                map.put(i,result.getString(0) );
                i++;
            }
            json = JSON.encode(map);
        }catch(Exception e){
            System.out.println(e);            
        }
        outputlog(json);
        return json;
    }
    
    private List getSubGraphNodeList(List<SigmaNodePropertyBean> rootnodelist, int depth) throws Exception{        
        List<SigmaNodePropertyBean> list = new ArrayList();
        try{
            for(SigmaNodePropertyBean rootnode : rootnodelist){
                //ノード取得
                outputlog(":additional Sub graph execution. base node id is " + rootnode.getId());
                PgqlResultSet resultSet = graph.queryPgql("SELECT y.id(), y.name, y.type WHERE (x)-[]->(y), y.isroot != 1, x.id() = " + rootnode.getId() );
                int x = 1;
                int y = depth;
                int size = 2;
                
                for(PgqlResult result : resultSet.getResults()){
                    x++;
                    SigmaNodePropertyBean node = new SigmaNodePropertyBean();
                    node.setId(result.getLong(0));
                    node.setLabel(result.getString(1));
                    node.setX(x);
                    node.setY(y);
                    node.setSize(size);
                    node.setColor(this.getColorHex(result.getString(2)));
                    list.add(node);
                }
            }
        }catch(Exception e){
            System.out.println(e);
        }
        
        return list;
    }

    private List getSubGraphEdgeList(List<SigmaNodePropertyBean> rootnodelist){
        List<SigmaEdgePropertyBean> list = new ArrayList();
        try{
            for(SigmaNodePropertyBean node : rootnodelist){
                PgqlResultSet resultEdgeSet = graph.queryPgql("SELECT x.id(), e.id(), y.id() WHERE (x)-[e]->(y), y.isroot != 1,x.id() = " + node.getId());
                for(PgqlResult edgeResult : resultEdgeSet.getResults()){
                    SigmaEdgePropertyBean edge = new SigmaEdgePropertyBean();
                    edge.setId(edgeResult.getLong(1));
                    edge.setSource(edgeResult.getLong(0));
                    edge.setTarget(edgeResult.getLong(2));
                    list.add(edge);                
                }
            }           
            
        }catch(Exception e){
            System.out.println(e);
        }        
        return list;
    }
    
  
    private String getColorHex(String type){
        //汎用化するためには変更が必要
        String colorhex = "";
        
        switch (type) {
            case "company":
                colorhex = "#1abc9c";
                break;
            case "vehicle":
                colorhex = "#3498db";
                break;
            case "parts":
                colorhex = "#f1c40f";
                break;
            case "factory":
                colorhex = "#e67e22";
                break;
            default:
                colorhex = "#8f8f8f";
                break;
        }
        
        return colorhex;
    }    
}
