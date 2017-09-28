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
            $('#properties').append("<tr><th>プロパティ</th><th>値</th></tr>");
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
                        console.log("creat new Sigma Instance");
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
                    }else{
                        console.log("Sigma Instance has been already created");
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
                                gravity:10,
                                scalingRatio:10,
                                slowDown:10
                            });
                            setTimeout(function(){ graphins.stopForceAtlas2(); }, 10000);

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
            console.log(e.type, e.data.node.label, e.data.node.id, e.data.captor.clientX);
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
        /*
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
        */
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
                            console.log("add node " + graphdata.nodes[i].label + " to graphinstance");
                            graphins.graph.addNode({
                                id:graphdata.nodes[i].id,
                                label:graphdata.nodes[i].label,
                                //位置決めが課題
                                x:Number(graphdata.nodes[i].x) + Number(eventdata.captor.clientX),
                                y:Number(graphdata.nodes[i].y) + Number(eventdata.captor.clientY),
                                size:graphdata.nodes[i].size,
                                color:graphdata.nodes[i].color
                            });
                                console.log(eventdata.captor.clientX, eventdata.captor.scerenX,eventdata.captor.pageX );
                                console.log(eventdata.captor.clientY, eventdata.captor.scerenY,eventdata.captor.pageY );
                        }else{
                            console.log("Node ID:" + graphdata.nodes[i].id + " has already existed. ");
                        }
                    }
                    //エッジデータの追加
                    for(var k in graphdata.edges){
                        if(!(graphins.graph.edges(graphdata.edges[k].id))){
                            console.log("add edge " + graphdata.edges[k].id + " to graphinstance");
                            graphins.graph.addEdge({
                                id:graphdata.edges[k].id,
                                source:graphdata.edges[k].source,
                                target:graphdata.edges[k].target
                            })
                        }else{
                            console.log("Edge ID:" + graphdata.edges[k].id + " has already existed. ");
                        }
                    }
                    graphins.refresh();
                }
            })
        });
        $('#addAllNodes').click(function(e){
                $('#nodedialog, #mask').hide();
            
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
                        gravity:10,
                        scalingRatio:10,
                        slowDown:10
                    });
                    setTimeout(function(){ graphins.stopForceAtlas2(); }, 10000);

                    graphins.refresh();
                    $('#load_container, #load_circle, #load_comment').css('display','none');
                    $('#container').css('display','block');
                }
            });            
        });

    })
