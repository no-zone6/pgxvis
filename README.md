# pgx-vis

Nozomu Onuma 
version 0.1 
last update 2017/9/27

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

３．ToDo 　　
　・もうちょっと簡単なインストール方法の実現 　　
　・PGXサーバURLの設定のプロパティファイル化 　　
　・右クリック機能の追加 　　
　・Log4J対応 　　
　・その他動作上不都合がある部分の解消