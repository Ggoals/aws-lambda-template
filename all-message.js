console.log('Loading function');
 
const https = require('https');
const url = require('url');
// to get the slack hook url, go into slack admin and create a new "Incoming Webhook" integration

const ENV = process.env
const slack_url = ENV.slack_url;
const slack_channel = ENV.slackChannel;
const slack_req_opts = url.parse(slack_url);
slack_req_opts.method = 'POST';
slack_req_opts.headers = {'Content-Type': 'application/json'};
 
exports.handler = function(event, context) {

  (event.Records || []).forEach(function (rec) {
    if (rec.Sns) {
      var req = https.request(slack_req_opts, function (res) {
        if (res.statusCode === 200) {
          context.succeed('posted to slack');
        } else {
          context.fail('status code: ' + res.statusCode);
        }
      });
      
      req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
        context.fail(e.message);
      });
      
      req.write(JSON.stringify({text: JSON.stringify("[CloudWatchAlarmtoSlack] :"+rec.Sns.Message, null, '  ')})); 
      
      req.end();
    }
  });
};