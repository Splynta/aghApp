angular.module('aghApp.controllers', [])

.controller('LoginCtrl', function($scope, $state) {
    $scope.username = '';
    $scope.password = '';
    
    $scope.login = function() {
        // TODO: Check login details against database
        $state.go('home.list');
    };
})

.controller('JobsCtrl', function($scope, Jobs, Enum) {
    $scope.jobs = Jobs.getAll();
    $scope.searchStatus = Enum.StatusList[3];
    
    $scope.changeStatus = function() {
        var x = $scope.searchStatus.id + 1;
        if (x >= Enum.StatusList.length) {
            $scope.searchStatus = Enum.StatusList[0];
        } else {
            $scope.searchStatus = Enum.StatusList[x];
        }
    };
    $scope.getJobStatus = function(id) {
        return Enum.StatusList[id].status;
    }
})

.controller('JobDetailsCtrl', function($scope, $stateParams, Jobs, SignatureCanvas) {
    $scope.$on('$ionicView.loaded', function () {
        SignatureCanvas.setCanvas('signatureCanvas');
        $scope.job = Jobs.get($stateParams.jobid);
        SignatureCanvas.loadImage($scope.job);
        console.log(window.devicePixelRatio);
        
    });
    $scope.$on('$ionicView.unloaded', function () {
        SignatureCanvas.saveImage($scope.job);
        Jobs.saveJob($scope.job);
    });
    
    $scope.addMaterial = function() {
        Jobs.addMaterial($scope.job);
    };
    $scope.removeMaterial = function(materialid) {
        Jobs.removeMaterial($scope.job, materialid);
    };
    $scope.clearCanvas = function() {
        SignatureCanvas.clearCanvas();
    };
    $scope.sendEmail = function() {
        SignatureCanvas.saveImage($scope.job);
        Jobs.sendEmail($scope.job);
    };
})

.controller('AddJobCtrl', function($scope, Jobs, SignatureCanvas) {
    $scope.$on('$ionicView.loaded', function () {
        SignatureCanvas.setCanvas('signatureCanvas');
        $scope.job = Jobs.createJob();
    });
    $scope.$on('$ionicView.unloaded', function () {
        // If the main details aren't blank then save job
        if(!$scope.job.name == '' ||
           !scope.job.addressLine1 == '' ||
           !$scope.job.addressLine2 == '' ||
           !$scope.job.postcode == '') {
            SignatureCanvas.saveImage($scope.job);
            Jobs.addJob($scope.job);
        } 
    });
    
    $scope.addMaterial = function() {
        Jobs.addMaterial($scope.job);
    };
    $scope.removeMaterial = function(materialid) {
        Jobs.removeMaterial($scope.job, materialid);
    };
    $scope.clearCanvas = function() {
        SignatureCanvas.clearCanvas();
    };
    $scope.sendEmail = function() {
        SignatureCanvas.saveImage($scope.job);
        Jobs.sendEmail($scope.job);
    };
})

.controller('SettingsCtrl', function() {
    
})