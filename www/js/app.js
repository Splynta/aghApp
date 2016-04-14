var db = null;

angular.module('aghApp', ['ionic', 'aghApp.services', 'aghApp.controllers', 'ngAnimate', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    db = $cordovaSQLite.openDB({name: 'agh.db'});
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS jobs"
                                + "(id integer primary, name text, "
                                + "addressline1 text, "
                                + "addressline2 text, "
                                + "city text, "
                                + "postcode text, "
                                + "hours integer, "
                                + "materials text, "
                                + "workdone text, "
                                + "clientsignature text)");
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