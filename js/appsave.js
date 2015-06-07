(function() {

  var myFirebaseRef;
  var fbStudents;
  var fbMe;
  var fbResource;
  var fbTest;
  var viewModel;

  //do I need init?
  function init() {
    console.log('initing');

    myFirebaseRef = new Firebase('https://masumi.firebaseio.com/site');
    myFirebaseRef.authWithOAuthPopup('google', function(error, authData) {
      if (error) {
        console.log('Login Fail:', error);
      } else {
        console.log(authData);
        fbStudents = myFirebaseRef.child('students');
        fbMe = myFirebaseRef.child('me');
        fbResource = myFirebaseRef.child('resouce');
        fbTest = myFirebaseRef.child('test');

        viewModel = new ViewModel();
        viewModel.userName(authData.google.displayName);

        ko.applyBindings(viewModel);
      }
    });

  }

  function ViewModel() {
    var vm = this;
    vm.userName = ko.observable('');
    vm.students = KnockoutFire.observable(
      fbStudents, {
        //$ means that vm.students is now an observable array
        '$student': {
          'name': true,
          'link': true,
          'repertoire': {
            '$song': {
              'name': true
            }
          }
        }
      }
    );

    vm.me = KnockoutFire.observable(
      fbMe, {
        'bio': true,
        'bioImg': true,
        'name': true
      }
    );

    //UI state
    vm.pages = [
    {
      name: 'about',
      title: 'About'
    },
    {
      name: 'resource',
      title: 'Resources'
    },
    {
      name: 'studentPage',
      title: 'Your Student Page'
    }];
    vm.modes = ['admin', 'student'];
    vm.currentStudent = ko.observable({
      name: ko.observable(''),
      link: ko.observable(''),
      repertoire: ko.observableArray([1, 2])
    });
    vm.currentPage = ko.observable('studentPage');
    vm.currentMode = ko.observable('admin');

    //functions to change UI state
    vm.setPage = function() {
      vm.currentPage(this.name);
    };

    vm.selectStudent = function() {
      vm.currentStudent(this);
      console.log('you clicked on a student', this.name(),
          'current student is ', vm.currentStudent().name());
    };

    vm.addStudent = function() {
      fbStudents.push({
        name: 'New Student',
        link: 'www.google.com',
        repertoire: [{name: 'a'}, {name: 'b'}]
      });
      //how do I console.log this to see the list of rep?
    };

    vm.removeStudent = function(item) {
      if (!confirm('are you sure?')) return false;
      fbStudents.child(item.firebase.key()).remove();
      console.log(item);
    };

    vm.addSong = function(item) {
      vm.currentStudent().firebase
      .child('repertoire').push({name: 'song'});
    };

    vm.removeSong = function(item) {
      vm.currentStudent().firebase
          .child('repertoire').child(item.firebase.key()).remove();
      console.log('removed song');
      console.log(item);
    };
  }

  init();

})();
