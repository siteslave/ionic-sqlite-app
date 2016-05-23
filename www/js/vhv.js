'use strict';

// vhv : Village Health Volunteer

angular.module('starter.Vhv', [])
  .controller('VhvCtrl', function ($scope, $ionicPlatform, $rootScope,
    $log, $ionicPopup, $ionicModal, VhvService) {

    $scope.newVhv = {};
    $scope.infoVhv = {};

    $scope.villages = [
      {village_id: 1, village_name: 'บ้านตำแย หมู่ 24'},
      {village_id: 2, village_name: 'บ้านหนองคู หมู่ 3'},
      {village_id: 3, village_name: 'บ้านทัน หมู่ 25'},
      {village_id: 4, village_name: 'บ้านหนองอุ่ม หมู่ 12'}
    ];

    $ionicModal.fromTemplateUrl('info-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    })
      .then(function (modal) {
        $scope.modalInfo = modal;
      });

    $ionicModal.fromTemplateUrl('new-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    })
      .then(function (modal) {
        $scope.modal = modal;
      });

    $scope.openModal = function () {
      $scope.newVhv.village_id = null;
      $scope.newVhv.fullname = null;
      $scope.newVhv.telephone = null;

      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.closeModalInfo = function() {
      $scope.modal.hide();
    };

    var getVhvList = function () {

      $scope.vhvs = [];

      $ionicPlatform.ready(function () {
        VhvService.getVhvList($rootScope.db)
          .then(function (res) {
            for (var i = 0; i <= res.rows.length - 1; i++) {
              $log.info(res.rows.item(i));
              var obj = {};
              obj.vhv_id = res.rows.item(i).vhv_id;
              obj.fullname = res.rows.item(i).fullname;
              obj.telephone = res.rows.item(i).telephone;
              obj.village_id = res.rows.item(i).village_id;

              $scope.vhvs.push(obj);
            }
          }, function (err) {
            $log.error(err);
          });
      });

    };



    // set complete
    $scope.saveVhv = function (vhv) {

      $log.info(vhv);

      $ionicPlatform.ready(function () {
        VhvService.saveVhv($rootScope.db, vhv)
          .then(function () {
            getVhvList();
          }, function (err) {
            $log.error(err);
          });
      });

      $scope.modal.hide();

    };

    $scope.info = function (vhv) {
      // Clear form
      $scope.infoVhv.village_id = null;
      $scope.infoVhv.fullname = null;
      $scope.infoVhv.telephone = null;

      $scope.infoVhv = vhv;

      // $scope.infoVhv.village.village_id = vhv.village_id;
      $scope.modalInfo.show();
    };

    $scope.update = function (vhv) {
      $log.info(vhv);
      VhvService.updateVhv($rootScope.db, vhv)
        .then(function () {
          $scope.modalInfo.hide();
          getVhvList();
        }, function (err) {
          $log.error(err);
        });
    };

    $scope.remove = function (vhv_id) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Are you sure?',
        template: 'คุณต้องการลบรายการนี้ ใช่หรือไม่?'
      });

      confirmPopup.then(function (res) {
        if (res) {
          VhvService.removeVhv($rootScope.db, vhv_id)
            .then(function () {
              getVhvList();
              $scope.modalInfo.hide();
            }, function (err) {
              $log.error(err);
            });
        }
      });
    };

    // initial task list
    getVhvList();
  })

  .factory('VhvService', function ($q, $cordovaSQLite, $ionicPlatform) {
    return {
      initialDb: function (db) {
        var q = $q.defer();
        var sql0 = 'DELETE FROM vhv';
        var sql1 = 'CREATE TABLE IF NOT EXISTS vhv (vhv_id integer primary key, fullname text, telephone text, village_id integer)';
        var sql2 = 'CREATE TABLE IF NOT EXISTS village (village_id integer primary key, village_name text)';

        $cordovaSQLite.execute(db, sql1, [])
          .then(function () {
            return $cordovaSQLite.execute(db, sql2, []);
          })
          .then(function () {
            return $cordovaSQLite.execute(db, sql0, []);
          })
          .then(function () {
            q.resolve();
          }, function (err) {
            q.reject(err);
          })

        return q.promise;

      },

      getVhvList: function (db) {
        var q = $q.defer();
        var sql = 'SELECT * FROM vhv ORDER BY fullname';
        $cordovaSQLite.execute(db, sql, [])
          .then(function (res) {
            q.resolve(res);
          }, function (err) {
            q.reject(err)
          });

        return q.promise;
      },

      saveVhv: function (db, vhv) {
        var q = $q.defer();
        var sql = 'INSERT INTO vhv(fullname, telephone, village_id) VALUES(?, ?, ?)';
        $cordovaSQLite.execute(db, sql, [vhv.fullname, vhv.telephone, vhv.village_id])
          .then(function (res) {
            q.resolve();
          }, function (err) {
            q.reject(err)
          });

        return q.promise;

      },

      updateVhv: function (db, vhv) {
        var q = $q.defer();
        var sql = 'UPDATE vhv SET fullname=?, telephone=?, village_id=? WHERE vhv_id=?';
          $cordovaSQLite.execute(db, sql, [vhv.fullname, vhv.telephone, vhv.village_id, vhv.vhv_id])
            .then(function (res) {
              q.resolve();
            }, function (err) {
              q.reject(err)
            });

        return q.promise;
      },

      removeVhv: function (db, vhv_id) {
        var q = $q.defer();
        var sql = 'DELETE FROM vhv WHERE vhv_id=?';
          $cordovaSQLite.execute(db, sql, [vhv_id])
            .then(function (res) {
              q.resolve();
            }, function (err) {
              q.reject(err)
            });

        return q.promise;
      }
    }
  });