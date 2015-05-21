(function () {

	var myFirebaseRef;
	var viewModel;

	function init () {
		console.log('init');

		// create the viewModel from our initial data
		viewModel = ko.mapping.fromJS({
			name: '',
			link: '',
			repertoire: {
				song1: '',
				song2: ''
			}
		});

		ko.applyBindings( viewModel );

		// connect to Firebase
		myFirebaseRef = new Firebase("https://masumi.firebaseio.com/students");

		// myFirebaseRef.set({
		// 	"001": {
		// 		"name": "Annie",
		// 		"link": "www.google.com",
		// 		"repertoire": {
		// 			"song1": "song1name",
		// 			"song2": "song2name"
		// 		}
		// 	}
		// })

		// request the data from Firebase
		myFirebaseRef.child("001").on("value", function(snapshot){
			var data = snapshot.val()

			console.log(viewModel);

			// update the viewModel with the new data
			ko.mapping.fromJS(data, viewModel);
			console.log(viewModel);
			console.log(viewModel.name() + " test name 2");

		});
	}

	init();
})()


