### node.js 搭建服务端学习  
>介绍 node.js可以看作运行在服务端的JavaScript.

Node.js是一个事件驱动I/O服务端JavaScript环境，基于Google的V8引擎，V8引擎执行Javascript的速度非常快，性能非常好。  
Node.js的一些特性:  
- 内置了文件处理系统 fs  
- Node是单进程单线程应用程序,但因为V8引擎提供的异步执行回调接口,并发性能非常高  
- Node.js的几乎每一个API接口都支持回调函数  
- Node.js 使用事件驱动模型，当web server接收到请求，就把它关闭然后进行处理，然后去服务下一个web请求。
  当这个请求完成，它被放回处理队列，当到达队列开头，这个结果被返回给用户。
- webserver一直接受请求而不等待任何读写操作(这也被称之为非阻塞式IO或者事件驱动IO).


#### 一.服务器环境配置  
> 租用的阿里的 CentOS 服务器,http请求默认监听80端口,https请求默认监听443端口

1.首先使用wget url命令与yum安装node与git  
2.linux系统配置node配置环境变量
3.使用pm2进行node服务器管理
>[PM2官方文档](https://pm2.keymetrics.io/)  

linux服务器目录说明:  
![说明](/nodeSeverBasic/img/linuxContent.png)

#### 二.Node.js常用功能介绍  
##### 1.事件驱动程序(类似vue的$emit和$on来监听事件)  
>events 模块只提供了一个对象： events.EventEmitter。EventEmitter 的核心就是事件触发与事件监听器功能的封装。
示例:  
```
// 引入 events 模块
var events = require('events');
// 创建 eventEmitter 对象
var eventEmitter = new events.EventEmitter();

// 创建事件处理程序
var connectHandler = function connected() {
   console.log('连接成功。');
 
   // 触发 data_received 事件 
   eventEmitter.emit('data_received');
}
 
// 绑定 connection 事件处理程序
eventEmitter.on('connection', connectHandler);
 
// 使用匿名函数绑定 data_received 事件
eventEmitter.on('data_received', function(){
   console.log('数据接收成功。');
});
 
// 触发 connection 事件 
eventEmitter.emit('connection');
 
console.log("程序执行完毕。");
```

##### 2.缓冲区(buffer)[官方文档](http://nodejs.cn/api/buffer.html)  
>JavaScript只有字符数据类型,没有二进制数据类型,在处理像TCP流或文件流时，必须使用到二进制数据。
因此在 Node.js中，定义了一个 Buffer 类，该类用来创建一个专门存放二进制数据的缓存区。
一个 Buffer 类似于一个整数数组，但它对应于 V8 堆内存之外的一块原始内存。

示例:
```
// 创建一个长度为 10、且用 0 填充的 Buffer。
const buf1 = Buffer.alloc(10);

// 创建一个长度为 10、且用 0x1 填充的 Buffer。 
const buf2 = Buffer.alloc(10, 1);

// 返回一个初始值为 runoob 的 Buffer 实例,使用 ascii 编码
const buf = Buffer.from('runoob', 'ascii');

// 写入缓冲区
buf = Buffer.alloc(256);
len = buf.write("www.runoob.com");
console.log("写入字节数 : "+  len);
// 从缓冲区读取数据
buf.toString([encoding[, start[, end]]])
// 将buf转换为json格式
buf.toJSON()
```

##### 3.stream(流)  
>Stream 是一个抽象接口，Node 中有很多对象实现了这个接口。
例如，对http 服务器发起请求的request 对象就是一个 Stream，还有stdout（标准输出）。

示例:
```
// 读取流
var fs = require("fs");
var data = '';

// 创建可读流
var readerStream = fs.createReadStream('input.txt');

// 设置编码为 utf8。
readerStream.setEncoding('UTF8');

// 处理流事件 --> data, end, and error
readerStream.on('data', function(chunk) {
   data += chunk;
});

readerStream.on('end',function(){
   console.log(data);
});

readerStream.on('error', function(err){
   console.log(err.stack);
});
----------------------------
// 写入流
var fs = require("fs");
var data = '测试文本';

// 创建一个可以写入的流，写入到文件 output.txt 中
var writerStream = fs.createWriteStream('output.txt');

// 使用 utf8 编码写入数据
writerStream.write(data,'UTF8');

// 标记文件末尾
writerStream.end();

// 处理流事件 --> finish, error
writerStream.on('finish', function() {
    console.log("写入完成。");
});

writerStream.on('error', function(err){
   console.log(err.stack);
});
----------------------------
// 管道流  
var fs = require("fs");
// 创建一个可读流
var readerStream = fs.createReadStream('input.txt');

// 创建一个可写流
var writerStream = fs.createWriteStream('output.txt');

// 管道读写操作
// 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
readerStream.pipe(writerStream);

```

##### 4.模块系统  
>Nodejs的模块是CommonJs规范的一种实现,使用require导入,module.exports = xxx(或直接exports = xxx)导出

require时模块的获取路径:  
![require图示](/nodeSeverBasic/img/require图示.png)

##### *5.路由与请求参数获取*  
获取参数需要用到两个额外的模块 url 和 queryString
```
                   url.parse(string).query
                                           |
           url.parse(string).pathname      |
                       |                   |
                       |                   |
                     ------|-------------------
http://localhost:8888/start?foo=bar&hello=world
                                ---       -----
                                 |          |
                                 |          |
              querystring.parse(queryString)["foo"]    |
                                            |
                         querystring.parse(queryString)["hello"]
```

##### 6.常用工具库utils 
该工具库用于弥补Node核心JavaScript过于精简不足,常用方法如下:  
```
const utils = require('utils')

utils.inherits(children,parent) // 继承,同时可以继承原型上的方法

utils.inspect(obj) // 将任意对象转化为字符串,一般用于调试

utils.isArray(obj) // 判断是否为数组
utils.isRegExp(obj) // 判断是否为正则
utils.isDate(obj) // 判断是否为日期
utils.isError(obj) // 判断是否为一个而错误

```

##### 7.文件系统  
>node内置了文件管理模块fs  

**文件系统的路径是相对于node主执行文件所在的路径,看主文件是在哪个目录中 "执行" 的,就相对于哪个目录**
```
var fs = require("fs");

// 异步读取
fs.readFile('input.txt', function (err, data) {
   if (err) {
       return console.error(err);
   }
   console.log("异步读取: " + data.toString());
});

// 同步读取
var data = fs.readFileSync('input.txt');
console.log("同步读取: " + data.toString());

console.log("程序执行完毕。");
```

##### *8.处理get/post请求*  
1.get请求可以使用内置的url模块直接获取相应的参数;  

2.post请求  
post请求的内容都在请求体中,要使用request.on('data',function)进行监听,传输结束后,再使用request.on('end',function)进行处理
```
 // 定义了一个post变量，用于暂存请求体的信息
    var post = '';     
 
    // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
    req.on('data', function(chunk){    
        post += chunk;
    });
 
    // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
    req.on('end', function(){    
        post = querystring.parse(post);
        res.end(util.inspect(post));
    });
```

