const eventproxy = require('eventproxy'); // 重复异步操作处理
const superagent = require('superagent');
const cheerio = require('cheerio');
const url = require('url');

const cnodeUrl = 'https://cnodejs.org/';

superagent.get(cnodeUrl)
  //.set('header',header)
  //.proxy(proxy)
  .end(function (err, res) {
    if (err) {
      return console.error(err);
    }
    const topicUrls = [];
    //console.log(res)
    //console.log(res.text)
    const $ = cheerio.load(res.text);
    $('#topic_list .topic_title').each(function (idx, element) {
      const $element = $(element);
      const href = url.resolve(cnodeUrl, $element.attr('href'));
      topicUrls.push(href);
    });

    const ep = new eventproxy();

    ep.after('topic_html', topicUrls.length, function (topics) {
      topics = topics.map(function (topicPair) {
        const topicUrl = topicPair[0];
        const topicHtml = topicPair[1];
        const $ = cheerio.load(topicHtml);
        return ({
          title: $('.topic_full_title').text().trim(),
          href: topicUrl,
          comment1: $('.reply_content').eq(0).text().trim(),
        });
      });

      console.log('final:');
      console.log(topics);
    });

    topicUrls.forEach(function (topicUrl) {
      superagent.get(topicUrl)
        .end(function (err, res) {
          console.log('fetch ' + topicUrl + ' successful');
          ep.emit('topic_html', [topicUrl, res.text]);
        });
    });
  });

