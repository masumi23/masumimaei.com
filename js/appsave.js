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
					"name": true
				}
			}
		);
		
		//UI state
		vm.pages = ["about", "resource", "studentPage"],
		vm.modes = ["admin", "student"],
		vm.currentStudent = ko.observable({
			name: ko.observable("foo")
		}) ,
		vm.currentPage = ko.observable('studentPage'),
		vm.currentMode = ko.observable('student'),

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
				name: "imaNewbee"
			});
		};

		vm.removeStudent = function (item) {
			fbStudents.child(item.firebase.name()).remove();
		};	
	}

	init();
})()


