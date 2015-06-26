var json = require('jsonfile');
var Twit = require('twit');
var express = require('express');
var BodyParser = require('body-parser');
var cors = require('cors');

// var file = './list.json';
var cred = require('./credentials');

var app = express();
var router = express.Router();

app.use(BodyParser.urlencoded({extended: false}));
app.use(cors());

var T = new Twit({
	consumer_key: cred.consumer_key,
	consumer_secret: cred.consumer_secret,
	access_token: cred.access_token,
	access_token_secret: cred.access_token_secret
})

var messages = [];
var defaultMessages = [
	"Welcome to Digital Underground!",
	"Digital Underground - the Digital Media Design grad show!",
	"We're open Thurs 16th and Fri 17th, 11am - 6pm",
	"Tweet us with the hashtag #BUdigital"
];

Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

function pusher(message, keep){
	messages.push({
		message:message,
		keep: keep,
		tweet: false
	});
	// json.writeFile(file,messages,function(err){
	// 	if (err){ 
	// 		console.log(err)
	// 	} else {
	// 		console.log("Message Saved")

	// 	};
	// })
}

var tweetFire = 5;
var tweetIteration = tweetFire;
var twitterQuery = "#BUdigital"

function twitGet(){
	if (tweetIteration == 0 ){
		T.get('search/tweets', { q: twitterQuery, count: 1}, function(err, data, response){
			messages.push({
				message: data.statuses[0].text,
				keep: 0,
				tweet: true
			})
		});
		tweetIteration = tweetFire;
	} else {
		tweetIteration--;
	}
	
}

app.use(express.static(__dirname + '/public'));

app.get('/ticker', function(req, res){
	res.render('ticker.html')
})

app.get('/', function(req, res){
	
	twitGet();

	if (!messages.length == 0) {
		
		res.send({
			text: messages[0].message,
			tweet: messages[0].tweet
		});
		console.log(messages);
		
		if (messages[0].keep > 0){
			messages[0].keep --;
			messages.move(0,messages.length );	
		} else if (messages[0].keep == 0) {
			messages.splice(0,1);
		} else if (messages[0].keep == -1){
			messages.move(0,messages.length );	
		}

	} else {
		var rand = Math.floor(Math.random() * defaultMessages.length);
		res.send({
			text: defaultMessages[rand],
			tweet: false
		});
	}
});

app.post('/', function(req, res){
	var message = req.body.message;
	var keep = req.body.keep;
	console.log(message + " --Keep? " + keep);
	pusher(message, keep);
	res.send("Message Sent");
})

app.use('/', router);


app.listen(3120);
console.log("Running on port 3120");