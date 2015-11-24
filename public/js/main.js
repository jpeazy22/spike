angular.module('App', [])

angular.module('App')
	.service('authService', ['$http', '$location', function($http){
		
		this.authCheck = function(cb){
			$http.get('/api/me')
				.then( function(returnData){
					cb(returnData.data)

				})
		}
						
	}])

angular.module('App')
	.controller('mainController', ['$scope', '$http', 'authService', function($scope, $http, authService){
		console.log('AUTH', authService)
		
		authService.authCheck(function(user){
			console.log('USER!', user)
			$scope.user = user
		})

	}])
	