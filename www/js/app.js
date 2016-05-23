'use strict';

angular.module('starter', ['ionic', 'ngCordova', 'starter.Vhv'])

.run(function($ionicPlatform, $log, $cordovaSQLite, $rootScope, VhvService) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    $rootScope.db = $cordovaSQLite.openDB({
      name: "vhv.db",
      location: 'default',
      iosDatabaseLocation: 'Library'
    });

    VhvService.initialDb($rootScope.db)
      .then(function () {
        $log.info('Create table success');
      }, function (err) {
        $log.info('Create table failed: ' + err);
      })

  });
})
