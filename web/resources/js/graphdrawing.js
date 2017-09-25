/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
    sigma.utils.pkg('sigma.canvas.nodes');

    $(function(){
        /*** URL設定 ***/
        var baseurl = "http://"+location.hostname+":"+location.port;
        /*** PGX用設定ファイルの読み込み ***/
        var graphsetting;
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
        /*** Sigmaインスタンス用変数 ***/
        var graphins;
        $('.rootbutton').click(function(){
            /*** Propertyテーブルの初期化***/
            createPropertiestable();
            /*** Sigmaインスタンスの作成（ない場合）***/
            if(typeof graphins === "undefined" || graphins ==null){
                console.log("creat new Sigma Instance");
                graphins =  new sigma({
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
            var category = $(this).attr("id");
            var graphdepth = $('#basedepth').val();
            $.ajax({
                type:"get",
                url: baseurl + "/PgxRest/vehiclegraphs/graphs/sigma/base/" + category + "/" + graphdepth,
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
                }
            });

        })

        function createPropertiestable(){            
            /*** PGXの設定ファイルを読み込み、参照可能なプロパティをリスト化し、テーブルへ登録 ***/
            $('#properties').empty();
            $('#properties').append("<tr><th>プロパティ</th><th>値</th></tr>");
            $.getJSON(baseurl + "/PgxRest/vehiclegraphs/graphs/pgx/setting/",function(){
            }).done(function(json){
                graphsetting = json;
                for(var i in graphsetting.vertex_props){
                    $('#properties').append("<tr><td class='propheader'>"+graphsetting.vertex_props[i].name+"</td><td id=prop_"+graphsetting.vertex_props[i].name+"></td><?tr>");
                }
            });            
        }

        function clickNodeEvent(e){
            /*** プロパティテーブルへプロパティを登録 ***/
            var nodeid = e.data.node.id;
            $.getJSON(baseurl + "/PgxRest/vehiclegraphs/graphs/sigma/vertexinfo/"+nodeid, function(){
            }).done(function(json){
                for(key in json){
                    $('#prop_'+key).empty();
                    $('#prop_'+key).append(json[key]);
                }
            });
        }

        function rightClickNodeEvent(e){
            /*** （ToDO)子ノードの取得、とかしたい ***/
            /*** できれば、ダイアログウィンドウとか出した上で選択させる形がよい ***/
            var adddepth = Number($('#adddepth').val()) + 1;
            console.log(e.type, e.data.node.label, e.data.node.id, e.data.captor.clientX);
            $("#nodedialog").css({
                'left':e.data.captor.clientX,
                'top':e.data.captor.clientY
            });
            $('#mask').fadeTo("slow",0.5);
            $('#nodedialog').fadeTo("slow",1);
            
            $('#close,#mask').click(function(){
                $('#nodedialog, #mask').hide();
            })
        }    

    })