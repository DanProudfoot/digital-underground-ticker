$(window).load(function() {

	iteration = 0;
	function repeat(){
		$('.marquee_text')

			.bind('finished', function (){
				var self = $(this);
				$.get('http://localhost:3120/', function(data, status){
					self.marquee('destroy');
					if (data.tweet == true){
						self.html(data.text)
						self.css({
							color :"#5387F7",
							textShadow: '#002866 0 0 15px'
						});
					} else {
						self.html(data.text)
						self.css({
							color : "#C70000",
							textShadow: "red 0 0 15px"
						});
					}
					
					console.log("Iteration: " + iteration + " -- " + data.text);
					iteration++;
					repeat();
				});
			})

			.marquee({
				duration: 3000
			});	
	}

	repeat();

});