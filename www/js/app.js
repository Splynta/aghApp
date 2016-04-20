var db = null;

var errorsqlcb = function(error) {
    console.log('SQL ERR: ' + error.message);  
};

angular.module('aghApp', ['ionic', 'aghApp.services', 'aghApp.controllers', 'ngAnimate', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite, Jobs) {
  $ionicPlatform.ready(function() {
    /*if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }*/
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    db = $cordovaSQLite.openDB({name: 'agh.db', location: 'default'});
      
    var successsqlcb = function(res) {
        console.log('SQL: ' + res.rowsAffected);  
    };
      
    var query = "DROP TABLE jobs";
    //db.executeSql(query, ['drop-table'], successsqlcb, errorsqlcb);
    
    var query = "CREATE TABLE IF NOT EXISTS jobs (id INTEGER PRIMARY KEY AUTOINCREMENT, status INTEGER, name TEXT, addressline1 TEXT, addressline2 TEXT, city TEXT, postcode TEXT, hours INTEGER, materials TEXT, workdone TEXT, clientsignature TEXT)";
    db.executeSql(query, ['create-table'], successsqlcb, errorsqlcb);
      
    query = 'INSERT INTO jobs (status, name, addressline1, addressline2, city, postcode, hours, materials, workdone) VALUES(0, "Anna Park", "9 Clement Road", "Swinton", "Manchester", "M27 0IA", 12, "Timber~Plug", "Installation")';
    //db.executeSql(query, ['insert-job'], successsqlcb, errorsqlcb); 
    //db.executeSql(query, ['insert-job'], successsqlcb, errorsqlcb);
    
    Jobs.retrieve();
  });
})

.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    
    $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })
    
    .state('forgotPassword', {
        url: '/forgotpassword',
        templateUrl: 'templates/forgot-password.html'
    })
    
    .state('home', {
        abstract: true,
        url: '/home',
        templateUrl: 'templates/home.html'
    })
    
    .state('home.list', {
        url: '/home/list',
        views: {
            'home-list': {
                templateUrl: 'templates/list.html',
                controller: 'JobsCtrl'
            }
        }
    })
    .state('home.job-detail', {
        url: '/home/list/:jobid',
        params: {
            jobid: 0
        },
        views: {
            'home-list': {
                templateUrl: 'templates/job-details.html',
                controller: 'JobDetailsCtrl'
            }
        }
    })
    
    .state('home.addjob', {
        url: '/home/addjob',
        views: {
            'home-add-job': {
                templateUrl: 'templates/add-job.html',
                controller: 'AddJobCtrl'
            }
        }
    })
    
    .state('home.settings', {
        url: '/home/settings',
        views: {
            'home-settings': {
                templateUrl: 'templates/settings.html',
                controller: 'SettingsCtrl'
            }
        }
    })
})

.filter('capitalize', function() {
  return function(token) {
      return token.charAt(0).toUpperCase() + token.slice(1);
   }
})

.constant('Enum', {
   StatusList: [
       { id: 0, status: 'success', title: 'Completed' },
       { id: 1, status: 'pending', title: 'Pending' },
       { id: 2, status: 'error', title: 'Incomplete'},
       { id: 3, status: 'all', title: 'All'}
   ]
})