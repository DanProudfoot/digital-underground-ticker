$(window).load(function() {

	iteration = 0;
	function repeat(){
		$('.marquee_text')

			.bind('finished', function (){
				var self = $(this);
				$.get('http://localhost:3120/', function(data, status){
					self.marquee('destroy');
					self.html(data)
					console.log("Iteration: " + iteration + " -- " + data);
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