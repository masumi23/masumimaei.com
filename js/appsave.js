(function () {

	var myFirebaseRef = new Firebase("https://masumi.firebaseio.com/site");
	var fbStudents = myFirebaseRef.child('students');
	var fbMe = myFirebaseRef.child('me');
	var fbResource = myFirebaseRef.child('resouce');
	var fbTest = myFirebaseRef.child('test');
	var viewModel = new ViewModel();

	//do I need init?
	function init () {
		console.log('init');
		
		ko.applyBindings( viewModel );

	}
	
	function ViewModel() {
		var vm = this;
		vm.students = KnockoutFire.observable(
			fbStudents, {
				//$ means that vm.students is now an observable array
				"$student": {
					"name": true,
					"link": true,
					"repertoire": {
						"$song": {
							"name": true
						}
					}
				}
			}
		);
		
		//UI state
		vm.pages = ["about", "resource", "studentPage"],
		vm.modes = ["admin", "student"],
		vm.currentStudent = ko.observable({
			name: ko.observable("foo"),
			link: ko.observable("www.google.com"),
			repertoire: ko.observable([1,2])
		}) ,
		vm.currentPage = ko.observable('studentPage'),
		vm.currentMode = ko.observable('admin'),

		//functions to change UI state
		vm.setPage = function(clickedPage) {
			vm.currentPage(clickedPage);
			console.log("clicked a page, now on " + viewModel.currentPage());
		};

		vm.selectStudent = function() {
			vm.currentStudent(this);
			console.log("you clicked on a student", this.name(), "current student is ", vm.currentStudent().name());
		};	

		vm.addStudent = function() {
			fbStudents.push({
				name: "imaNewbee",
				link: "www.google.com",
				repertoire: ['a', 'b']
			});
			//how do I console.log this to see the list of rep?
		};

		vm.removeStudent = function (item) {
			fbStudents.child(item.firebase.key()).remove();
			console.log(item);
		};	

		vm.addSong = function(item) {
			vm.currentStudent().firebase.child('repertoire').push({name:"song"});
		};

		vm.removeSong = function(item) {
			vm.currentStudent().firebase.child('repertoire').child(item.firebase.key()).remove();
			console.log("removed song");
			console.log(item);
		};
	}

	init();
})()


