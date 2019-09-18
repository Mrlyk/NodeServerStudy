const http = require('http')
const url = require('url')
const querystring = require('querystring')
const fs = require('fs')

var postHTML =
  '<html><head><meta charset="utf-8"><title>nodeServer测试</title></head>' +
  '<body>' +
  '<form method="post">' +
  'id： <input name="id"><br>' +
  'pwd： <input name="pwd"><br>' +
  '<input type="submit">' +
  '</form>' +
  '</body></html>';

function start(route){
  http.createServer(function (request, response) {
    let pathName = url.parse(request.url).pathname
    // console.log(`recivedPathName:${pathName}`)
    // console.log(request.url)
    route(pathName)

    // var body = ''
    // request.on('data',(chunk) => {
    //   console.log(`chunk:${chunk}`)
    //   body += chunk  //chunk就是post请求体中的数据
    // })

    // request.on('end',()=>{
    //   console.log(`没解析:${body}`)
    //   //解析参数
    //   body = querystring.parse(body);
    //   console.log(body)
    //   // 设置响应头部信息及编码
    //   response.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
    //
    //   if(body.id && body.pwd) { // 输出提交的数据
    //     response.write("id：" + body.id);
    //     response.write("<br>");
    //     response.write("pwd：" + body.pwd);
    //   } else {  // 输出表单
    //     response.write(postHTML);
    //   }
    //   response.end()
    // })

    // response.writeHead(200, {'Content-Type': 'text/plain'})
    // response.end('hello world')
    if (pathName === '/' || pathName === '/index.html') {
      fs.readFile('./index.html',(err,data)=>{
        if (err){
          return console.log(err)
        }
        response.writeHead(200,{'Content-Type':'text/html'})
        response.write(data.toString())
        response.end()
      })
    }

  }).listen('6666')

  console.log('Server running at http://127.0.0.1:80/');
}

exports.start = start
