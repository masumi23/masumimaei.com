(function() {

  var myFirebaseRef;
  var fbStudents;
  var fbMe;
  var fbResource;
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

        // only do the following if it's the first time, and we can write
        // HOW???
        // studentName = prompt('What is the student\'s name?');
        fbUser.set({
          'dateJoined': Date.now(),
          'readable': {
            'students': {
              '001': {
                'name': 'studentName',
              }
            }
          },
          'writeable': {
            'contact': {
              'name': 'BJÖRK Garcia',
              'address': 'house',
              'email': 'foo',
              'phone': '4155555555',
              'phone2': ''
            }
          }
        });

        fbStudents = myFirebaseRef.child('students');
        fbMe = myFirebaseRef.child('me');
        fbResource = myFirebaseRef.child('resources');

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
            'students': {
              '$student': {
                'name': true
              }
            }
          },
          'writeable': {
            'contact': {
              'name': true,
              'address': true,
              'email': true,
              'phone': true,
              'phone2': true
            }
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

    vm.resources = KnockoutFire.observable(
      fbResource, {
        '$resource': {
          'url': true,
          'comment': true
        }
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
    vm.currentPage = ko.observable('resource');
    //functions to change UI state
    vm.generalUI = {
      setPage: function() {
        vm.currentPage(this.name);
      }
    };

    vm.editStudent = {
      selectStudent: function() {
        vm.currentStudent(this);
        console.log('you clicked on a student', this.name(),
            'current student is ', vm.currentStudent().name());
      },
      addStudent: function() {
        fbStudents.push({
          name: 'New Student',
          link: 'www.google.com',
          repertoire: [{name: 'a'}, {name: 'b'}]
        });
        //how do I console.log this to see the list of rep?
      },
      removeStudent: function(item) {
        if (!confirm('are you sure?')) {
          return false;
        }
        fbStudents.child(item.firebase.key()).remove();
        console.log(item);
      },
      addSong: function(item) {
        vm.currentStudent().firebase
        .child('repertoire').push({name: 'song'});
      },
      removeSong: function(item) {
        vm.currentStudent().firebase
            .child('repertoire').child(item.firebase.key()).remove();
        console.log('removed song');
        console.log(item);
      }
    };

    vm.editUser = {
      currentUser: ko.observable(null),
      studentToAddToUser: ko.observable(null),
      //not working yet. Must be a better way
      matchStudents: function() {
        for (var j = 0; j < vm.editUser.currentUser.students.length; j++) {
          for (var i = 0; i < vm.students.length; i++) {
            if (vm.students[i].name === vm.editUser.currentUser.
              students[j].name) {
              console.log('matched up!');
              vm.editUser.currentUser.
              students[j] = ko.observable(vm.students[i]);
            }
          }
        }
      },
      newStudentList: ko.computed(function() {
        return vm.students;
      }),
      addStudentToUser: function() {
        if (!vm.editUser.currentUser()) {
          vm.editUser.currentUser(this);
          console.log(this);
        } else {
          console.log(vm.editUser.currentUser());
          console.log(vm.editUser.studentToAddToUser());
          vm.editUser.currentUser().firebase.child('readable').
          child('students').push({name: vm.editUser.studentToAddToUser()});
          vm.editUser.currentUser(null);
        }
      }
    };

  }

  init();

})();
