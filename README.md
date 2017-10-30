# pgxvis

Nozomu Onuma 
version 0.1 
last update 2017/10/30


１．利用前提 

　1-1. PGX

　　・vertex_propsに「name」プロパティが設定されている。->nameプロパティが、画面上のノードの名前になる。    
　　・最初にアクセスするルートノードを指定する必要がある。    
　　・ルートノードは
　　　- 「isroot」プロパティを設定し、値として「1」を持たせる。      
　　　- 「type」プロパティを設定し、ノードの種別を登録する。 ->ルートノードのtypeプロパティが、画面上部のボタンの名前になる。      
　　　必要がある。    
　　・ルートノードは最大６個まで指定可能。７個以上指定した場合は、ボタン配色による分類がなされない。    
　　・ルートノード以外のノードにtypeプロパティの値を設定することは必須ではないが、ルートノードのtypeプロパティの値とそろえることで、画面上のノードの色がボタンの色にそろえられる。 　

　1-2. サーバ構成    
　　・PGXアクセス用設定JSONファイルを、「pgxsetting.json」のファイル名で作製し、web/resourcesフォルダに配置する

２．利用方法 
    
　2-1. 今のところの確実な利用方法  

　　・PGXをサーバモードで起動    
　　・netbeans上のプロジェクトに、Githubから本リポジトリのクローンを作製    
　　・webページ/resourcesフォルダにpgxsetting.jsonファイルを配置    
　　・PgxRestResource.java内のメンバ変数「pgxurl」にPGXサーバのURLを記述    
　　・プロジェクトを実行    
    
  2-2. アプリケーションのみ稼動させる方法  

　　・PGXをサーバモードで起動    
　　・Glassfishサーバ（4.1)をインストールし、起動
  　　　　・インストールディレクトリ配下のbinフォルダからコマンドプロンプトを開き、asadmin start-domainで起動
  　・本リポジトリのdistフォルダにある「PgxRest.war」ファイルをGlassfishにデプロイ
        ・localhost:4848にアクセス
        ・左側のペインから「Application」をクリックし「deploy」をクリック
        ・CDIのチェックボックスをはずし、それ以外はデフォルトのまま
　　・pgxrest.propertiesファイルのプロパティとして「pgxurl」にPGXサーバのURLを記述 
  　・同じく「pgxjson」にPGX設定用jsonファイルの名前とパスを記述
　　・Glassfishのデフォルトドメイン（domain1）配下の「config」フォルダに「pgxrest.properties」ファイルを配置
  　・pgxrest.propertiesファイル内に記載された場所にPGX設定用JSONファイルを配置
　　・ブラウザからlocalhost:8080/PgxRest/index.html二アクセス
  　     ・接続テストとしてlocalhost:8080/PgxRest/oraclepgx/graphs二アクセスしてJSONが帰ってくればOK

３．ToDo     

　・右クリック機能の拡充    
　・Log4J対応     
　　・クローズ処理
　　・エラーハンドリング　等
