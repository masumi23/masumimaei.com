(function () {

	var myFirebaseRef;
	var viewModel;

	function init () {
		console.log('init');

		// connect to Firebase
		myFirebaseRef = new Firebase("https://masumi.firebaseio.com/site");
		fbStudents = myFirebaseRef.child('students');
		fbMe = myFirebaseRef.child('me');
		fbResource = myFirebaseRef.child('resouce');
		fbTest = myFirebaseRef.child('test')
		
		function viewModel() {
			var vm = this;
			vm.students = KnockoutFire.observable(
				fbStudents, {
					"$students": {
						"content": true
					}
				}
			);
			console.log(vm.students);
			
			//UI state
			//needs to be made back into observables
			vm.pages = ko.observableArray(["about", "resource", "studentPage"]),
			vm.modes = ko.observableArray(["admin", "student"]),
			vm.currentStudent = ko.observable('') ,
			vm.currentPage = ko.observable('studentPage'),
			vm.currentMode = ko.observable('student'),

			//functions to change UI state
			function setPage(clickedPage) {
				viewModel.currentPage(clickedPage);
				console.log("clicked a page, now on " + viewModel.currentPage());
			}

			function selectStudent (clickedStudent) {
				viewModel.currentStudent(clickedStudent);
				console.log("you clicked on a student")
			}			
		}
		
		ko.applyBindings( viewModel );

	}

	init();
})()


