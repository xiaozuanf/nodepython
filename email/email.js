const cheerio=require('cheerio') // 爬虫数据分析
const path=require('path')
const http=require('http')
const template=require('art-template') // 模版数据
const nodemailer = require("nodemailer"); // 邮箱发送
const superagent = require("superagent"); // 发送爬虫
const schedule = require('node-schedule'); // 定时任务

// 获取 ONE 网页数据
const getOneData = () => {
  return new Promise((resolve,reject) =>{ 
    superagent.get('http://wufazhuce.com/').end((err, res) => {
      if (err) {
        // 如果访问失败或者出错，会这行这里
        console.log(`数据抓取失败 - ${err}`)
        reject(err)
      } else {
      // 访问成功，请求页面所返回的数据会包含在res
      // 抓取热点新闻数据
        const $ = cheerio.load(res.text)
        resolve({
          imgSrc:$('.fp-one-imagen').attr('src'),
          text:$('.fp-one .fp-one-cita-wrapper .fp-one-cita').eq(0).text()
        })
      }
    });
  })

}
// 获取天气数据
const getWhetherData = () => {
  return new Promise((resolve,reject) =>{ 
    superagent.get('https://tianqi.2345.com/').end((err, res) => {
      if (err) {
        // 如果访问失败或者出错，会这行这里
        reject(err)
      } else {
      // 访问成功，请求页面所返回的数据会包含在res
      // 抓取热点新闻数据
        const $ = cheerio.load(res.text)
        resolve({
          temperature:$('.banner-whether-desc1').text(),
          whether:$('.banner-whether-desc2').text()
        })
      }
    });
  })

}

// 发送邮箱
async function send() {
  const oneData=await getOneData()
  const whetherData=await getWhetherData()
  const html=template(path.join(__dirname,'./index.html'),{ oneData, whetherData})
  // 发送方
  const transporter = nodemailer.createTransport({
    host: "smtp.163.com",
    port: 465,//邮箱端口号
    secure: true, // true for 465, false for other ports  开启加密模式
    auth: {
      user: 'hgl1432395474@163.com', 
      pass: 'LCADCZZZJMIFSMOI', // 授权码
    },
  });
  const mailOpts={
    from: '"小钻风" <hgl1432395474@163.com>', 
    to: "hgl1432395474@163.com",// 可通过逗号发送多个
    subject: "Hello ✔", 
    text: "Hello world?",
    html: html, 
  }
  transporter.sendMail(mailOpts,(error,info)=>{
    if(error){
      console.log(error)
    }
    console.log('发送成功')
  })
}

// 邮箱发送
//send();

//定时
schedule.scheduleJob({second:10,hour:24}, function(){
  console.log('The answer to life, the universe, and everything!');
});

// 模版展示
/* var server = http.createServer(async(req,res)=>{
  res.writeHeader(200, {"Content-Type": "text/html"});
  
  const oneData=await getOneData()
  const whetherData=await getWhetherData()
  const html=template(path.join(__dirname,'./index.html'),{oneData,whetherData})
  res.write(html);

  res.end();
});
server.listen(8081,"127.0.0.1"); */
 