const express = require('express');
const app = express()
var server = app.listen(8086, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})