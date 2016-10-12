前端服务

docker build -t joehe/nginx:1.0.0 .

docker exec -it nginx /bin/sh  

线上
docker run -d -p 80:80 -v "$(pwd)"/web:/web --name nginx joehe/nginx:1.0.0
线上测试
docker run -d -p 8080:8080 -v "$(pwd)"/web:/web --name nginx joehe/nginx:1.0.0

docker run -it -p 8080:8080 --name vue node:argon /bin/bash

06-05-29
+0，各地区负责人进入公司管理页面勾选需要自动检测身份证功能的公司（新增功能） 
1， 客户下团队单 （现有功能） 
2， 客户生成送机单并进入送机单编辑模式 （现有功能） 
3， 客户保存送机单（现有功能） 
+ 4， 系统自动验证名单，生成检测历史纪录 （新增功能）
+ 5， 送机单一旦生成，则不能删除（新增功能）
6， 客户可以修改送机单，包括增减名单 （现有功能）
7，客户保存修改 （现有功能） 
+8，系统自动验证名单，生成检测历史纪录 （新增功能） 
9， 月对账单生成 （现有功能） 
+10，对账单增加本月检测历史记录总条数，增加送机单人数，两者之差就是本月应收验证费（新增功能）

* zx.shell.js               // 去掉广告
* assets/js/custom-image.js // 加本地储存
* zx.getusers.js            // 加本地储存
* schemas/company.js        // 加 isidcard 字段，是否需要自动验证身份证
* zx.companylist.js         // 加 isidcard 字段
* zx.model.js               // changeIsidcard
* io_routes.js              // emit-changeIsidcard
