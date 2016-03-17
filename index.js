const CONF_ID = '1996';
const PAGES = 9;

var jsdom = require('jsdom').jsdom;
var document = jsdom('<html><body></body></html>', {});
var window = document.defaultView;
var async = require('async');
var _ = require('lodash');
var fs = require('fs');
var he = require('he');

const $ = require('jquery')(window),
      request = require('request');

var page = 1;
async.whilst(
  function () {
    return page <= PAGES},
  function (cb) {
    console.log(`Page ${page} / ${PAGES}`);
    request.post(`http://www.gdcvault.com/api/filter_sessions.php`, {
      form: {
        'conference_id': CONF_ID,
        'page': page
      }
    }, function (err, res, body) {
      page += 1;
      $(body).appendTo("body");
      cb(null);
    });
  }, function (err) {
    var titles = _($(".conference_info p > strong"))
      .toArray()
      .map(e => e.innerHTML)
      .filter(t => !/\.\.\./.test(t))
      .uniq()
      .map(he.decode)
      .value()
      .join('\n');
    fs.writeFileSync(`titles/${CONF_ID}-titles.txt`, titles, 'utf-8');
  }
);
