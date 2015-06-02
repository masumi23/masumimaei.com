(function () {

	var myFirebaseRef;
	var viewModel;

	function init () {
		console.log('init');

		// create the viewModel from our initial data
		viewModel = ko.mapping.fromJS({
			
			//individual students
			name: '',
			link: '',
			repertoire: {
				song1: '',
				song2: ''
			},
			
			//me
			info: '',

			//sources
			source1: {
				link: '',
				comment: '',
			},
			source2: {
				link: '',
				comment: '',
			},

			//UI state
			pages: ["about", "resource", "studentPage"],
			modes: ["admin", "student"],
			currentStudent: '' ,
			currentPage: 'studentPage',
			currentMode: 'student',

			//functions to change UI state
			setPage: function (clickedPage) {
				viewModel.currentPage(clickedPage);
				console.log("clicked a page, now on " + viewModel.currentPage());
			},
			
		});
		ko.applyBindings( viewModel );

		// connect to Firebase
		myFirebaseRef = new Firebase("https://masumi.firebaseio.com/site");
		fbStudents = myFirebaseRef.child('students');
		fbMe = myFirebaseRef.child('me');
		fbResource = myFirebaseRef.child('resouce');
		
		// myFirebaseRef.set({
		// 	"001": {	
		// 		name: 'Annie',
		// 		link: 'https://drive.google.com/embeddedfolderview?id=0B_8IPov7ygRpLTFpS1pmSzlsRlE#list" width="800" height="600" frameborder="0"',
		// 		repertoire: {
		// 			song1: 'my heart will go on',
		// 			song2: 'let it go'
		// 		},
		// 	},	
		// });

		// request the data from Firebase
		fbStudents.child("001").on("value", function(snapshot){
			var data = snapshot.val()

			// console.log(viewModel);

			// update the viewModel with the new data
			ko.mapping.fromJS(data, viewModel);
			console.log	(viewModel);
			// console.log(viewModel.name() + " test name 2");
		
		});

		// myFirebaseRef.set({
		// 	info: "<p>Masumi's love of music stems back to her childhood where she performed with local opera and musical theater companies, and at home sang along to her parent's recordings of ragas and the Beatles. In college, she studied voice with Kathryne Jennings of Brown University, and spent three years as a board member of the student opera production company. Favorite memories from that period include directing a fully orchestrated production of Cristoph Willibald Gluck's 'Orpheo ed Euridice', and performing Samuel Barber's 'Knoxville: Summer of 1914.9' with a chamber orchestra.</p><p>After college, she took a break from classical music, doing education research in Sri Lanka, and living in Bali. Upon re-entry to the United States, she began a master of music in music education with kodály emphasis at Holy Names University. She studies privately with Katya Roemer, and takes Hindustani voice lessons (Gwalior Gharana) with Dr. Madhuvanti Mirashi.</p><p>As a teacher, Masumi focuses on teaching voice to younger students and beginning adults with an emphasis on musicianship. She also specializes in musicianship coaching sessions. She is an empathetic teacher and uses creative tools and techniques to engage her students in exploring the many facets of music and music theory.</p><p>Masumi currently collaborates with musician, Ben Jaffe, performing and writing acoustic music. They draw inspiration from a variety of artists including: Joni Mitchell, Sufjan Stevens, Sara Bareilles, Sonya Cotton, Bjork, and Ella Fitzgerald. Masumi also performs classically with a special fondness for German lieder and contemporary American art songs.</p>"
		// });
		
		fbMe.on("value", function(snapshot){
			var data = snapshot.val()
			console.log(data);

			// console.log(viewModel.me.info());

			// update the viewModel with the new data
			ko.mapping.fromJS(data, viewModel);
			// console.log(data);
			console.log(viewModel);
			console.log(viewModel.info());
		});
	}

	init();
})()


