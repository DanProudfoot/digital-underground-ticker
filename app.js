var json = require('jsonfile');
var Twit = require('twit');
var express = require('express');
var BodyParser = require('body-parser');
var cors = require('cors');

var file = './list.json';

var app = express();
var router = express.Router();

app.use(BodyParser.urlencoded({extended: false}));
app.use(cors());

var T = new Twit({
	consumer_key:'...'
	, consumer_secret:'...'
	, access_token:'...'
	, access_token_secret:'...'
})

var messages = [];
var defaultMessages = [
	"Here's a test one",
	"Here's another test",
	"Here's the final one"
];

Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

function pusher(message, keep){
	messages.push({
		message:message,
		keep: keep
	});
	// json.writeFile(file,messages,function(err){
	// 	if (err){ 
	// 		console.log(err)
	// 	} else {
	// 		console.log("Message Saved")

	// 	};
	// })
}

app.get('/', function(req, res){
	
	if (!messages.length == 0) {
		res.send(messages[0].message);
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
		res.send(defaultMessages[rand]);
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