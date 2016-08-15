var express = require('express');
var app = express();
var AWS = require('aws-sdk');

AWS.config.update({ region: process.env.REGION });
let defaultParams = { QueueUrl: process.env.SQS_QUEUE };

app.get('/', (req, res) => {
  res.send('healthy');
});

var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Example app listening on port %s!', port);
});

function queueNextPoll() {
  setTimeout(getNextMessage, 15000);  
}

function getNextMessage() {
  
  let sqs = new AWS.SQS();
  sqs.receiveMessage(defaultParams, (err, data) => {
    if (err) {
      console.error(err, err.stack);
      exit(1); //exit the process, harbor will restart us
    }
    else {
      if (data && data.Messages && data.Messages.length > 0) {      
        let rawMsg = data.Messages[0];
        console.log('received message: ', rawMsg.Body);

        //simulate real work
        let msg = JSON.parse(rawMsg.Body);
        console.log('processing message ', msg.id);
        setTimeout(() => {

          //delete the message since we're done with it
          let params = {
            QueueUrl: defaultParams.QueueUrl,
            ReceiptHandle: rawMsg.ReceiptHandle
          };

          sqs.deleteMessage(params, (err, data) => {
            if (err) {
              console.error(err, err.stack);
            }
            else {
              console.log(data);
              console.log('message deleted');
            }
          });

          queueNextPoll();
        }, 15000);
      }
      else { //no messages
        console.log('no messages');
        queueNextPoll();
      }
    }    
  });
}

//start a loop to poll SQS for messages
queueNextPoll();