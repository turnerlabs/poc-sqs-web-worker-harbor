var express = require('express');
var app = express();
var AWS = require('aws-sdk');
var shortid = require('shortid');

AWS.config.update({ region: process.env.REGION });

app.get('/', (req, res) => {
  res.send('healthy');
});

//write message to queue
app.post('/message/:msg', (req, res) => {

  let msg = {
    id: shortid.generate(),
    text: req.params.msg
  };

  let params = {
    QueueUrl: process.env.SQS_QUEUE,
    MessageBody: JSON.stringify(msg),    
    DelaySeconds: 0
  };

  let sqs = new AWS.SQS();
  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.error(err, err.stack);
      send.status(500).send(err);
    }      
    else {
      console.log(data);
      res.send(data);
    }       
  });
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Example app listening on port %s!', port);
});