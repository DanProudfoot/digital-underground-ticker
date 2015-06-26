$(window).load(function() {
	
	var form = $('#postform');

	form.submit(function(event) {
		event.preventDefault();

		var formData = {
			message: form.find("textarea").val(),
			keep: parseInt(form.find("#repeat").val())
		}

		var url = "http://localhost:3120/"

		var posting = $.post(url,formData);

		posting.done(function(data){
			alert("Sent, server: " + data)
		})
		
	});

});

