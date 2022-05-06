const fs = require('fs')
const http=require('http')
const request = require("request");
const path = require('path');
const cheerio = require('cheerio')
const superagent = require('superagent')
require('superagent-proxy')(superagent);
const axios = require("axios");

//本地存储目录
var dir = path.join(__dirname + '/images');

//创建目录
fs.mkdir(dir, {recursive: true}, (err) =>{
  if(err){
    console.log(err);
  }
});

// 保存的图片集合
const imageUrl=[]

// 下载文件
var download = (src, dir, filename)=>{
  // pipe前是读文件，pipe后的括号中是写文件
  request(src).pipe(fs.createWriteStream(dir + "/" + filename)).on('close',function(){
      console.log('pic saved!')
  })
}

const main = () => {
  //var url='https://www.bilibili.com/'
  var url= 'https://as.meituan.com/'
  //var proxy = 'http://127.0.0.1:8086';
  var header = {
      'Accept':'*/*',
      'Accept-Encoding':'gzip, deflate, br',
      'Accept-Language':'zh-CN,zh;q=0.9',
      'Cookie':"_uuid=D0786844-82E0-01DC-6E1B-625386B5449537873infoc; buvid3=A5A9273D-00AD-4448-9538-6EF5581ACE0B148804infoc; i-wanna-go-back=-1; b_ut=7; buvid_fp=b72c7d3a50f50266e61a31f255301b2a; buvid4=8BA77011-2E01-1C7C-B657-7537268D61BD65590-022031520-DFPukYbLzf6/7sd1o04ApA%3D%3D; CURRENT_BLACKGAP=0; sid=75603njx; CURRENT_QUALITY=0; rpdid=|(JukYY))Y)0J'uYR~JR)R~R; blackside_state=1; innersign=0; bsource=search_google; PVID=1; b_lsid=BF2D10155_17FDDAB2A6A; CURRENT_FNVAL=80",
      'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36',
  };
  superagent.get(url)
  /* .set('header',header) */
  //.proxy(proxy)
  .end((err, res) => {
    if (err) {
      console.log(`数据抓取失败 - ${err}`)
    } else {
      console.log(res.text)
      const $ = cheerio.load(res.text)
      $('img').each((index,el)=>{
        const src=$(el).attr('src')
        const srcChuli= src.includes('https:') ? src : `https:${src}`
        imageUrl.push(srcChuli)
      })
      imageUrl.map((val,index) =>{
        download(val, dir, index+'.png');
      })
    }
  });

}
main()