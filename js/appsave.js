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
      var studentName;

      if (error) {
        console.log('Login Fail:', error);
      } else {
        console.log(authData);

        fbUsers = myFirebaseRef.child('users');
        fbUser = fbUsers.child(authData.uid);

        // // only do the following if it's the first time, and we can write
        // studentName = prompt('What is the student\'s name?');
        // fbUser.set({
        //   'dateJoined': Date.now(),
        //   'readable': {
        //     'studentName': studentName
        //   },
        //   'writeable': {
        //     'contact': {
        //       'name': '',
        //       'address': '',
        //       'email': 'foo',
        //       'phone': '',
        //       'phone2': ''
        //     }
        //   }
        // });

        fbStudents = myFirebaseRef.child('students');
        fbMe = myFirebaseRef.child('me');
        fbResource = myFirebaseRef.child('resouce');
        fbTest = myFirebaseRef.child('test');

        viewModel = new ViewModel();
        viewModel.userName(authData.google.displayName);

        if (authData.uid === 'google:117783533189040685811') {
          viewModel.adminMode(true);
        }

        ko.applyBindings(viewModel);
      }
    });

  }

  function ViewModel() {
    var vm = this;
    vm.adminMode = ko.observable(false);
    vm.userName = ko.observable('');
    vm.users = KnockoutFire.observable(
      fbUsers, {
        '$user': {
          'readable': {
            'name': true
          }
        }
      }
    );
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
      name: 'userPage',
      title: 'All Users'
    },
    {
      name: 'studentPage',
      title: 'Student Page'
    }];

    vm.currentStudent = ko.observable({
      name: ko.observable(''),
      link: ko.observable(''),
      repertoire: ko.observableArray([1, 2])
    });
    vm.currentPage = ko.observable('userPage');


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
