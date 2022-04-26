var { TwitterApi } = require('twitter-api-v2');
var { MongoClient } = require('mongodb')
var config = require('./config.js');
var uri = "mongodb+srv://andrewtpalo:Hast1ngs1066@cluster0.xmqxm.mongodb.net/songRatings?retryWrites=true&w=majority";
var Twitter = new TwitterApi(config);
var messages;
var minimumTweetNum;

var writeTweet = function() {
    MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var dbo = db.db("songRatings");
    console.log("0");
    dbo.collection("collection").aggregate(
        [{
            $group: {
                _id: {},
                minNumTweets: {
                $min: "$numTweets"
                }
            }
        }]).toArray().then(result=>{
            minimumTweetNum = result[0].minNumTweets;
            console.log("1");
            console.log(result[0].minNumTweets);
            dbo.collection("collection").aggregate(
        [{
            $match: {
              numTweets: minimumTweetNum
            }
          },
          {
            $sample: {
              size: 1
            }
          }]).toArray().then(result=>{
            messages = result[0];
            console.log(messages);        
var myquery = { _id: messages._id };
    var newvalues = {$set: {numTweets: messages.numTweets+1}}
    dbo.collection("collection").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        db.close();
      });     


    
    Twitter.v2.tweet(messages.name + " - " + messages.artist + 
                "\n\n" + messages.lyrics + "\n" + messages.link).then((val)=>{
        console.log(val)
    }).catch((err) => {
        console.log(err)
    });
}); 
 });
 });
};

 writeTweet()

 setInterval(writeTweet, 21600000);


// module.exports = {messages};