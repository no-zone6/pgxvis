/*
 * Copyright (C) 2017 Nozomu Onuma

 * Project Name    : PgxRest
 * File Name       : graphdrawing.js
 * Encoding        : UTF-8
 * Creation Date   : 2017/09/26

 * This source code or any portion thereof must not be
 * reproduced or used in any manner whatsoever.
 */
    sigma.utils.pkg('sigma.canvas.nodes');

    $(function(){
        var baseurl = "http://"+location.hostname+":"+location.port;
        /*** プロパティテーブルの作成機能 ***/
        function createPropertiestable(){            
            /*** PGXの設定ファイルを読み込み、参照可能なプロパティをリスト化し、テーブルへ登録 ***/
            $('#properties').empty();
            $('#properties').append("<tr><th>Property</th><th>Value</th></tr>");
            $.getJSON(baseurl + "/PgxRest/oraclepgx/graphs/pgx/setting/",function(){
            }).done(function(json){
                graphsetting = json;
                for(var i in graphsetting.vertex_props){
                    $('#properties').append("<tr><td class='propheader'>"+graphsetting.vertex_props[i].name+"</td><td id=prop_"+graphsetting.vertex_props[i].name+"></td><?tr>");
                }
            });            
        }
        /*** ルートカテゴリボタンの作製機能+グラフインスタンス作製機能***/
        function createRootCateboryButton(){
            $('#caetgorytable').empty();
            $.getJSON(baseurl + "/PgxRest/oraclepgx/graphs/pgx/category/", function(){
            }).done(function(json){                
                for(var key in json){
                    $('#categorytable').append("<td><button id=\"ctg" + key +"\" class=\"rootbutton\">"+json[key].toUpperCase()+"</button></td>");
                }
                /*** インスタンス作成のクリックイベント登録 カテゴリ取得後じゃないと、うまくイベント登録できない***/
                $('.rootbutton').click(function(){
                    $('#container').css('display','none');
                    $('#load_container, #load_circle,#load_comment').css('display','block');
                    /*** Propertyテーブルの初期化***/
                    createPropertiestable();
                    /*** Sigmaインスタンスの作成（ない場合）***/
                    if(typeof graphins === "undefined" || graphins ==null){
                        message_header("creat new Sigma Instance");
                        graphins = new sigma({
                            renderers:[
                                {
                                    container: document.getElementById('container'),
                                    type: 'canvas'
                                }
                            ]
                        });
                        graphins.settings({
                            defaultNodeColor: '#ec5148',
                            sideMargin: 25,
                            edgeColor:'target',
                            defaultEdgeColor:'#080808',
                            borderSize: 2
                        });      
                    /*** Sigmaインスタンスに対するイベント設定***/
                        graphins.bind('rightClickNode',rightClickNodeEvent);
                        graphins.bind('clickNode', clickNodeEvent);
                        graphins.bind('doubleClickStage', doubleClickStageEvent);
                    }else{
                        message_header("Sigma Instance has been already created");
                    }
                    /*** サーバへの問い合わせ ***/         
                    var category = $(this).text().toLowerCase();
                    var graphdepth = $('#basedepth').val();
                    $.ajax({
                        type:"get",
                        url: baseurl + "/PgxRest/oraclepgx/graphs/sigma/base/" + category + "/" + graphdepth,
                        dataType: "json",
                        success : function(graphdata){

                    /*** sigmaインスタンスへのデータの登録 ***/
                            graphins.graph.clear();
                            graphins.graph.read(graphdata);
                    /*** sigmaインスタンスへのForceAtlas登録（ノード配置） ***/
                            graphins.startForceAtlas2({
                                gravity:100,
                                scalingRatio:40,
                                slowDown:100
                            });
                            setTimeout(function(){ graphins.stopForceAtlas2(); }, 8000);

                            graphins.refresh();
                            $('#load_container, #load_circle, #load_comment').css('display','none');
                            $('#container').css('display','block');
                        }
                    });
                });                
            });
            
        }
        
        function clickNodeEvent(e){
            /*** プロパティテーブルへプロパティを登録 ***/
            var nodeid = e.data.node.id;
            $.getJSON(baseurl + "/PgxRest/oraclepgx/graphs/sigma/vertexinfo/"+nodeid, function(){
            }).done(function(json){
                for(var key in json){
                    $('#prop_'+key).empty();
                    $('#prop_'+key).append(json[key]);
                }
            });
        }

        function rightClickNodeEvent(e){
            /*** （ToDO)子ノードの取得、とかしたい ***/
            eventdata = e.data;
            message_header(e.type, e.data.node.label, e.data.node.id, e.data.captor.clientX);
            /*** ダイアログ表示 ***/
            $('#addnodeid').empty();
            $('#addnodelabel').empty();
            $('#addnodeid').append(e.data.node.id);
            $('#addnodelabel').append(e.data.node.label);
            $("#nodedialog").css({
                'left':e.data.captor.clientX,
                'top':e.data.captor.clientY
            });
            $('#mask').fadeTo("slow",0.5);
            $('#nodedialog').fadeTo("slow",1);           
            
            /***  ダイアログのクローズ ***/
            $('#close,#mask').click(function(){
                $('#nodedialog, #mask').hide();                
            })
        }    
        
        function doubleClickStageEvent(e){
            message_header(e.data.captor.clientX, e.data.captor.clientY, e.data.captor.x,e.data.captor.y);
            if(!(typeof graphins === "undefined" || graphins ==null)){
                for(var i in graphsetting.vertex_props){
                    $('#createproperties').append("<tr><td class='propheader'>"+graphsetting.vertex_props[i].name+"</td><td id=prop_"+graphsetting.vertex_props[i].name+"><input type='text' id=form_"+graphsetting.vertex_props[i].name+"></input></td><?tr>");
                }            
                $('#nodecreatedialog').css({
                    'left':e.data.captor.clientX,
                    'top':e.data.captor.clientY
                });
                $('#mask').fadeTo("slow",0.5);
                $('#nodecreatedialog').fadeTo("slow",1);     
            }
            $('#createnodesubmit').click(function(e1){
                var newnode = {};
                for(var i in graphsetting.vertex_props){
                    var key = "#form_"+graphsetting.vertex_props[i].name;
                    newnode[graphsetting.vertex_props[i].name] = $(key).val();
                }
                message_header(JSON.stringify(newnode));
                $.ajax({
                    type:"POST",
                    dataType:"JSON",
                    contentType: 'application/json',
                    url: baseurl + "/PgxRest/oraclepgx/graphs/pgx/createnode/" ,
                    data: JSON.stringify(newnode)
                }).done(function(nodedata){
                    graphins.stopForceAtlas2();    
                    graphins.graph.addNode({
                        id:nodedata.id,
                        label:nodedata.label,
                        //位置決めがやっぱり問題
                        x:e.data.captor.x,
                        y:e.data.captor.y,
                        size:nodedata.size,
                        color:nodedata.color
                    });
                    graphins.refresh();
                }).fail(function(xhr, status, error){
                    message_header(xhr, status, error);
                });

                $('#createproperties').empty();
                $('#nodecreatedialog, #mask').hide();     
            });
            $('#creaetnodecancel').click(function(e2){
                $('#createproperties').empty();
                $('#nodecreatedialog, #mask').hide();                
            });            
        }
        
        /**** 初期フロー ***/
        /*** ルートボタンの設定 ***/
        createRootCateboryButton();
        /*** PGX用設定ファイルの読み込み ***/
        var graphsetting;
        /*** Sigmaインスタンス用変数 ***/
        var graphins;
        /*** ノードクリックイベント対応用関数 ***/
        var eventdata;
        /*** 右クリック時にブラウザのコンテキストメニューが出ないようにする +***/
        
        if (document.addEventListener) {
            document.addEventListener('contextmenu', function(e) {
              //my custom functionality on right click
                e.preventDefault();
            }, false);
        } else {
            document.attachEvent('oncontextmenu', function() {
                //my custom functionality on right click
                window.event.returnValue = false;
            });
        };
        
        /*** 右クリックメニューにイベントをバインド ***/
        $('#addLowerNodes').click(function(e){
            $('#nodedialog, #mask').hide();
            //自分を含まずに１っこ先のグラフノード ＝　自分を含めた深さにするため1を足す
            var graphdepth = Number($('#adddepth').val()) + 1;
            $.ajax({
                type:"get",
                url:baseurl + "/PgxRest/oraclepgx/graphs/sigma/additional/" + eventdata.node.id + "/" + graphdepth,
                dataType: "json",
                success : function(graphdata){
                    //ノードデータの追加
                    for(var i in graphdata.nodes){
                        if(!(graphins.graph.nodes(graphdata.nodes[i].id))){
                            //ノードIDの存在判定ロジックがおかしい
                            message_header("add node " + graphdata.nodes[i].label + " to graphinstance");
                            graphins.graph.addNode({
                                id:graphdata.nodes[i].id,
                                label:graphdata.nodes[i].label,
                                //位置決めが課題
                                x:Number(graphdata.nodes[i].x),
                                y:Number(graphdata.nodes[i].y),
                                size:graphdata.nodes[i].size,
                                color:graphdata.nodes[i].color
                            });
                        }else{
                            message_header("Node ID:" + graphdata.nodes[i].id + " has already existed. ");
                        }
                    }
                    //エッジデータの追加
                    for(var k in graphdata.edges){
                        if(!(graphins.graph.edges(graphdata.edges[k].id))){
                            //エッジIDの存在判定ロジックがおかしい
                            message_header("add edge " + graphdata.edges[k].id + " to graphinstance");
                            graphins.graph.addEdge({
                                id:graphdata.edges[k].id,
                                source:graphdata.edges[k].source,
                                target:graphdata.edges[k].target
                            })
                        }else{
                            message_header("Edge ID:" + graphdata.edges[k].id + " has already existed. ");
                        }
                    }
                    graphins.startForceAtlas2();
                    graphins.refresh();
                }
            })
        });
        $('#addAllNodes').click(function(e){
            $('#nodedialog, #mask').hide();
            //自分を含まずに１っこ先のグラフノード ＝　自分を含めた深さにするため1を足す
            var graphdepth = Number($('#adddepth').val()) + 1;
            $.ajax({
                type:"get",
                url:baseurl + "/PgxRest/oraclepgx/graphs/sigma/bothdirect/" + eventdata.node.id + "/" + graphdepth,
                dataType: "json",
                success : function(graphdata){
                    //ノードデータの追加
                    for(var i in graphdata.nodes){
                        if(!(graphins.graph.nodes(graphdata.nodes[i].id))){
                            message_header("add node " + graphdata.nodes[i].label + " to graphinstance");
                            graphins.graph.addNode({
                                id:graphdata.nodes[i].id,
                                label:graphdata.nodes[i].label,
                                //位置決めが課題
                                x:Number(graphdata.nodes[i].x),
                                y:Number(graphdata.nodes[i].y),
                                size:graphdata.nodes[i].size,
                                color:graphdata.nodes[i].color
                            });
                        }else{
                            message_header("Node ID:" + graphdata.nodes[i].id + " has already existed. ");
                        }
                    }
                    //エッジデータの追加
                    for(var k in graphdata.edges){
                        if(!(graphins.graph.edges(graphdata.edges[k].id))){
                            message_header("add edge " + graphdata.edges[k].id + " to graphinstance");
                            graphins.graph.addEdge({
                                id:graphdata.edges[k].id,
                                source:graphdata.edges[k].source,
                                target:graphdata.edges[k].target
                            })
                        }else{
                            message_header("Edge ID:" + graphdata.edges[k].id + " has already existed. ");
                        }
                    }
                    graphins.startForceAtlas2();
                    graphins.refresh();
                }
            })
            
        });
        $('#redrawGraph').click(function(e){
            $('#nodedialog, #mask').hide();
            $('#container').css('display','none');
            $('#load_container, #load_circle,#load_comment').css('display','block');
            var graphdepth = $('#basedepth').val();
            $.ajax({
                type:"get",
                url: baseurl + "/PgxRest/oraclepgx/graphs/sigma/redraw/" + eventdata.node.id + "/" + graphdepth,
                dataType: "json",
                success : function(graphdata){

            /*** sigmaインスタンスへのデータの登録 ***/
                    graphins.graph.clear();
                    graphins.graph.read(graphdata);
            /*** sigmaインスタンスへのForceAtlas登録（ノード配置） ***/
                    graphins.startForceAtlas2({
                        gravity:100,
                        scalingRatio:10,
                        slowDown:100
                    });
                    setTimeout(function(){ graphins.stopForceAtlas2(); }, 8000);

                    graphins.refresh();
                    $('#load_container, #load_circle, #load_comment').css('display','none');
                    $('#container').css('display','block');
                }
            });            
        });
        $('#removeNode').click(function(e){
            graphins.graph.dropNode(eventdata.node.id);
            graphins.refresh();
            $('#nodedialog, #mask').hide();    
        });
        $('#createEdge').click(function(e){
            
        });
        /*** CANVASイベント ***/
        
        function message_header(message){
            $('#header_message').empty();
            $('#header_message').append(message);
            if(message.slice(1,5) == "ERROR"){
                $('#header').css('color','red');
            }else{
                $('#header').css('color','#ffffff');                
            }
        }
        
    })
