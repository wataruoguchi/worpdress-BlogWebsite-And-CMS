//not required, I want to do them by graduate
//TODO: add validation(tags page)
//TODO: add modal
//TODO: add slag
//TODO: 2 transactions in 1 save(edit view). Unite them to one
//TODO: add super admin
//TODO: add category selection. now it's blank
//TODO: auto save draft function (set interval)

(function() {
	var app = angular.module('app.controllers', ['ngResource','textAngular','ngTagsInput','ui.router','cropme','ui.bootstrap','app.filters']);

	/*= = = = = = = = MAIN PAGE - START = = = = = = = = */
	app.controller('MainController', function($scope, sharedObject){
		$scope.setInfo = function (userId,displayName,roleId) {
			sharedObject.userId = userId;
			sharedObject.roleId = roleId;
			$scope.userId = userId;
			$scope.displayName = displayName;
			$scope.roleId = roleId;
		};

		$scope.getEditUserId = function() {
			sharedObject.editUserId = $scope.userId;
		};
	});
	/*= = = = = = = = MAIN PAGE - END = = = = = = = = */

	/*= = = = = = = = START PAGE - START = = = = = = = = */
	app.controller('DashboardController', function($scope, $resource, sharedObject){
		//DATABASE INTERFACE START--------------------
		//ADD METHOD
		$scope.dataResEditView = $resource('./dataRes/dataResDashboard.php', {
			userId:sharedObject.userId
		}, {});

		//SELECT
		$scope.oneRecordData = $scope.dataResEditView.query();
		//DATABASE INTERFACE END--------------------

	});
	/*= = = = = = = = START PAGE - END = = = = = = = = */

	/*= = = = = = = = POSTS LIST PAGE - START = = = = = = = = */
	//qiita.com/naga3/items/cacb8182ad79dbbf6e64
	app.controller('TableController', function($scope, $resource, $filter, sharedObject){
		//initialize
		sharedObject.postId = null;
		$scope.results = [];
		$scope.filteredResults = [];
		$scope.pageSize = 10;
		$scope.currentPage = 0;

		$scope.numberOfPages = function() {
			return Math.ceil($scope.filteredResults.length/$scope.pageSize);
		};

		$scope.jumpPage = function(pageNumber) {
			$scope.currentPage = pageNumber;
		};

		//FILTERS START--------------------
		//stackoverflow.com/questions/22258570/angularjs-3-button-group-acting-as-radio-buttons		
		$scope.setActive = function(type) {
			$scope.filter = type;
		};
		$scope.isActive = function (type) {
			return type == $scope.filter;
		};
		//FILTERS END--------------------

		//SEARCH START--------------------
		$scope.getReSearchResult = function() {
			$scope.currentPage = 0;
			$scope.getSearchResult();
		};

		$scope.getSearchResult = function() {
			$scope.filteredResults = $filter('filter')($scope.results, $scope.searchBox);
			$filteredResultsPlusButton = [];

			switch($scope.filter) {
				case 'all':
				angular.forEach($scope.filteredResults, function(result) {
					if(result['isDeletedFlag']!="1") {
						$filteredResultsPlusButton.push(result);
					}
				});
				$scope.filteredResults = $filteredResultsPlusButton;
				break;
				case 'published':
				angular.forEach($scope.filteredResults, function(result) {
					if(result['isPublishedFlag']=="1" && result['isDeletedFlag']!="1") {
						$filteredResultsPlusButton.push(result);
					}
				});
				$scope.filteredResults = $filteredResultsPlusButton;
				break;
				case 'draft':
				angular.forEach($scope.filteredResults, function(result) {
					if(result['isPublishedFlag']!="1" && result['isDeletedFlag']!="1") {
						$filteredResultsPlusButton.push(result);
					}
				});
				$scope.filteredResults = $filteredResultsPlusButton;
				break;
				case 'delete':
				angular.forEach($scope.filteredResults, function(result) {
					if(result['isDeletedFlag']=="1") {
						$filteredResultsPlusButton.push(result);
					}
				});
				$scope.filteredResults = $filteredResultsPlusButton;
				break;
				default:
				break;
			}
		};

		$scope.$watch('searchBox', function(newSearchBox) {
			$scope.currentPage = 0;
			$scope.getSearchResult();
		});
		//SEARCH END--------------------

		$scope.autoPaging = function() {
			if(($scope.currentPage)*$scope.pageSize+1 > $scope.filteredResults.length) {
				//If user is seeing last page
				//Jump to the last page
				$scope.currentPage-=1;
				//delegate
				$scope.jumpPage($scope.currentPage);
			}
		};

		//DATABASE INTERFACE START--------------------
		//ADD METHOD
		$scope.dataResPostList = $resource('./dataRes/dataResPostList.php', {
			userId:sharedObject.userId
		}, {});

		//SELECT
		$scope.results = $scope.dataResPostList.query(function() {
			//AFTER GET DATA
			$scope.filter = 'all';
			$scope.getSearchResult();
		});

		$scope.add = function() {
			sharedObject.postId = null;
		};

		// TRASH
		$scope.trash = function(index) {
			// goes to trush
			//I want to make this parameter with just id.
			var $param = new $scope.dataResPostList();
			$param['postId'] = $scope.filteredResults[index]['postId'];
			$scope.filteredResults[index].$delete($param);
			$scope.filteredResults[index].isDeletedFlag = "1";
			$scope.getSearchResult();
			$scope.autoPaging();
		};

		// DELETE
		$scope.delete = function(index) {
			// delete from database
			//I want to make this parameter with just id.
			var $param = new $scope.dataResPostList();
			$param['postId'] = $scope.filteredResults[index]['postId'];
			$scope.filteredResults[index].$delete($param);

			var deleteIndex = 0, isFinished = false;
			angular.forEach($scope.results, function(deletedRecord) {
				if(!isFinished) {
					if(deletedRecord['postId'] == $param['postId']) {
						$scope.filteredResults.splice(index,1);
						$scope.results.splice(deleteIndex,1);
						isFinished = true;
					}
				}
				deleteIndex++;
			});
			$scope.autoPaging();
		};
		//DATABASE INTERFACE END--------------------
	});

	//Record controller
	app.controller('RecordController', function($scope, $resource, sharedObject) {
		$tagsOnListRes = $resource('./dataRes/dataResEditViewTags.php', {
			postId:$scope.result['postId'],
			userId:sharedObject.userId
		}, {});
		$scope.tagsOnList = $tagsOnListRes.query(function(){
			//add tags on search result
			$scope.result.tags = $scope.tagsOnList;
		});

		//COPY and PASTE... I don't like...
		$scope.autoPaging = function() {
			if(($scope.currentPage)*$scope.pageSize+1 > $scope.filteredResults.length) {
				//If user is seeing last page
				//Jump to the last page
				$scope.currentPage-=1;
				//delegate
				$scope.jumpPage($scope.currentPage);
			}
		};

		// UPDATE
		$scope.update = function() {
			sharedObject.postId = $scope.result['postId'];
		};
		$scope.updateViaComment = function() {
			sharedObject.postId = $scope.result['rootId'];
		};

		//DATABASE INTERFACE START--------------------
		$scope.changeToApprove = function() {
			$scope.result.isApprovedFlag = "1";
			$scope.dataResCommentsList = $resource('./dataRes/dataResCommentsList.php', {
				postId:$scope.result['postId'],
				apF:$scope.result['isApprovedFlag'],
				spF:$scope.result['isSpamFlag']
			}, {
				// add PUT for update
				update: {method: 'PUT'}
			});
			$scope.dataResCommentsList.update();
			$scope.getSearchResult();
			$scope.autoPaging();
		};
		$scope.changeToSpam = function() {
			$scope.result.isSpamFlag = "1";
			$scope.dataResCommentsList = $resource('./dataRes/dataResCommentsList.php', {
				postId:$scope.result['postId'],
				apF:$scope.result['isApprovedFlag'],
				spF:$scope.result['isSpamFlag']
			}, {
				// add PUT for update
				update: {method: 'PUT'}
			});
			$scope.dataResCommentsList.update();
			$scope.getSearchResult();
			$scope.autoPaging();
		};
		//DATABASE INTERFACE END--------------------
	});
/*= = = = = = = = POSTS LIST PAGE - END = = = = = = = = */

/*= = = = = = = = EDIT PAGE - START = = = = = = = = */
app.controller('EditPageController', function($scope, $resource, sharedObject, $state){
		$scope.postId = sharedObject.postId;

		$scope.saveDraft = function() {
			$scope.oneRecordData[0]['isPublishedFlag'] = "0";
			$scope.oneRecordData[0]['isDeletedFlag'] = "0";
			$scope.update();
		};
		$scope.publish = function() {
			$scope.oneRecordData[0]['isPublishedFlag'] = "1";
			$scope.oneRecordData[0]['isDeletedFlag'] = "0";
			$scope.update();
		};
		//DATABASE INTERFACE START--------------------
		//ADD METHOD
		$scope.dataResEditView = $resource('./dataRes/dataResEditView.php', {
			postId:sharedObject.postId,
			userId:sharedObject.userId
		}, {
			// add PUT for update
			update: {method: 'PUT'}
		});

		//SELECT
		$scope.oneRecordData = $scope.dataResEditView.query(function() {
			$scope.postId = $scope.oneRecordData[0]['postId'];
			sharedObject.postId = $scope.postId;
		});

		// UPDATE
		$scope.update = function() {
			sharedObject.postId = $scope.postId;
			$scope.oneRecordData[0].$update(function(){
				$scope.updateTags();
			});
		};

		// DELETE
		$scope.trash = function(index) {
			// delete from database
			//I want to make this parameter with just id.
			var $param = new $scope.dataResEditView();
			$param['postId'] = $scope.oneRecordData[0]['postId'];
			$scope.oneRecordData[0].$delete($param, function() {
				sharedObject.postId = null;
				$state.go('page2');
			});
		};
		//DATABASE INTERFACE END--------------------

		$scope.tags = [];
		$scope.storedTags = [];

		$scope.addTag = function($addingTag){
			//Check if the chosen tag is on the list
			isOnList = false;
			angular.forEach($scope.tags, function(tag){
				if(tag['text'] == $addingTag) {
					isOnList = true;
					return;
				}
			});
			if(!isOnList) {
				$scope.tags.push({text: $addingTag});
			}
		};
		//DATABASE INTERFACE START--------------------
		getDataResEditViewTagsResource = function() {
			return $resource('./dataRes/dataResEditViewTags.php', {
				postId:sharedObject.postId,
				userId:sharedObject.userId
			}, {
				saveData:{method:'POST', isArray: true}
			});
		};

		//ADD METHOD
		$scope.dataResEditViewTags = getDataResEditViewTagsResource();

		//SELECT
		$scope.tags = $scope.dataResEditViewTags.query();

		// UPDATE
		$scope.updateTags = function() {
			$updateDataResource = getDataResEditViewTagsResource();
			$updateDataResource.saveData({},$scope.tags, function() {
					//initialize
					sharedObject.postId = null;
					$state.go('page2');
				});
		};
		//DATABASE INTERFACE END--------------------		
		//DATABASE INTERFACE START--------------------
		//ADD METHOD
		$scope.dataResEditViewGetTagMaster = $resource('./dataRes/dataResEditViewGetTagMaster.php', {
			userId:sharedObject.userId
		}, {});

		//SELECT
		$scope.storedTags = $scope.dataResEditViewGetTagMaster.query();
		//DATABASE INTERFACE END--------------------
		//UPLOAD FILE INTERFACE START--------------------
		$scope.$on("cropme:done", function(e, result, canvasEl) {
			var file = result.croppedImage;
			var xhr = new XMLHttpRequest();
			if(xhr.upload && file.type == canvasEl) {
				xhr.onreadystatechange = function(e) {
					if(this.readyState == 4 && this.status == 200) {
						console.log('done');
					} else if (this.readyState == 4 && this.status !== 200) {
						console.log('error');
					}
				};
				// initialize request, async is true
				xhr.open("POST", './dataRes/dataResEditViewPostImage.php', true);
				//set request header
				xhr.setRequestHeader("X-FILENAME", file.name);
				xhr.setRequestHeader("POSTID", sharedObject.postId);
				// send request
				xhr.send(file);
			}
		});
		//UPLOAD FILE INTERFACE END--------------------
	});
/*= = = = = = = = EDIT PAGE - END = = = = = = = = */

/*= = = = = = = = COMMENTS PAGE - START = = = = = = = = */
	//COPY and PASTE... I don't like... how to combine?
	app.controller('CommentsTableController', function($scope, $resource, $filter, sharedObject){
		//initialize
		sharedObject.postId = null;
		$scope.results = [];
		$scope.filteredResults = [];
		$scope.pageSize = 10;
		$scope.currentPage = 0;

		$scope.numberOfPages = function() {
			return Math.ceil($scope.filteredResults.length/$scope.pageSize);
		};

		$scope.jumpPage = function(pageNumber) {
			$scope.currentPage = pageNumber;
		};

		//FILTERS START--------------------
		$scope.setActive = function(type) {
			$scope.filter = type;
		};
		$scope.isActive = function (type) {
			return type == $scope.filter;
		};

		$scope.getCommentSearchResult = function() {
			$scope.getSearchResult();
			$scope.currentPage = 0;
		};
		//FILTERS END--------------------

		//SEARCH START--------------------
		$scope.getSearchResult = function() {
			$scope.filteredResults = $filter('filter')($scope.results, $scope.searchBox);
			$filteredResultsPlusButton = [];
			if($scope.filter == 'pending') {
				angular.forEach($scope.filteredResults, function(result) {
					if(result['isApprovedFlag']!="1" && result['isSpamFlag']!="1") {
						$filteredResultsPlusButton.push(result);
					}
				});
				$scope.filteredResults = $filteredResultsPlusButton;
			} else if($scope.filter == 'approved') {
				angular.forEach($scope.filteredResults, function(result) {
					if(result['isApprovedFlag']=="1") {
						$filteredResultsPlusButton.push(result);
					}
				});
				$scope.filteredResults = $filteredResultsPlusButton;
			} else if($scope.filter == 'spam') {
				angular.forEach($scope.filteredResults, function(result) {
					if(result['isSpamFlag']=="1") {
						$filteredResultsPlusButton.push(result);
					}
				});
				$scope.filteredResults = $filteredResultsPlusButton;
			}
		};

		$scope.$watch('searchBox', function(newSearchBox) {
			$scope.currentPage = 0;
			$scope.getSearchResult();
		});
		//SEARCH END--------------------

		//DATABASE INTERFACE START--------------------
		//ADD METHOD
		$scope.dataResCommentsList = $resource('./dataRes/dataResCommentsList.php', {userId:sharedObject.userId}, {
			// add PUT for update
			update: {method: 'PUT'}
		});

		//SELECT
		$scope.results = $scope.dataResCommentsList.query(function() {
			//AFTER GET DATA
			$scope.filter = 'pending';
			$scope.getSearchResult();
		});
		//DATABASE INTERFACE END--------------------
	});
/*= = = = = = = = COMMENTS PAGE - END = = = = = = = = */

/*= = = = = = = = USERS PAGE - START = = = = = = = = */
	//COPY and PASTE... I don't like... how to combine?
	app.controller('UsersTableController', function($scope, $resource, $filter, sharedObject, $state){
		$scope.results = [];
		$scope.filteredResults = [];
		$scope.pageSize = 10;
		$scope.currentPage = 0;
		$scope.currentUserId = sharedObject.userId;

		//prevent illegal access
		if(sharedObject.roleId != '1') {
			$state.go('page1');
			return;
		}

		$scope.numberOfPages = function() {
			return Math.ceil($scope.filteredResults.length/$scope.pageSize);
		};

		$scope.jumpPage = function(pageNumber) {
			$scope.currentPage = pageNumber;
		};

		//FILTERS START--------------------
		$scope.setActive = function(type) {
			$scope.filter = type;
		};
		$scope.isActive = function (type) {
			return type == $scope.filter;
		};

		$scope.getCommentSearchResult = function() {
			$scope.getSearchResult();
			$scope.currentPage = 0;
		};
		//FILTERS END--------------------

		//SEARCH START--------------------
		$scope.getSearchResult = function() {
			$scope.filteredResults = $filter('filter')($scope.results, $scope.searchBox);
			$filteredResultsPlusButton = [];
			if ($scope.filter == 'all') {
				angular.forEach($scope.filteredResults, function(result) {
					if(result['isDeletedFlag']!="1") {
						$filteredResultsPlusButton.push(result);
					}
				});
				$scope.filteredResults = $filteredResultsPlusButton;
			} else if($scope.filter == 'admin') {
				angular.forEach($scope.filteredResults, function(result) {
					if(result['isDeletedFlag']!="1" && result['roleId']=="1") {
						$filteredResultsPlusButton.push(result);
					}
				});
				$scope.filteredResults = $filteredResultsPlusButton;
			} else if($scope.filter == 'general') {
				angular.forEach($scope.filteredResults, function(result) {
					if(result['isDeletedFlag']!="1" && result['roleId']=="2") {
						$filteredResultsPlusButton.push(result);
					}
				});
				$scope.filteredResults = $filteredResultsPlusButton;
			} else if($scope.filter == 'deleted') {
				angular.forEach($scope.filteredResults, function(result) {
					if(result['isDeletedFlag']=="1") {
						$filteredResultsPlusButton.push(result);
					}
				});
				$scope.filteredResults = $filteredResultsPlusButton;
			}
		};

		$scope.$watch('searchBox', function(newSearchBox) {
			$scope.getSearchResult();
		});
		//SEARCH END--------------------

		//COPY and PASTE... I don't like...
		$scope.autoPaging = function() {
			if(($scope.currentPage)*$scope.pageSize+1 > $scope.filteredResults.length) {
				//If user is seeing last page
				//Jump to the last page
				$scope.currentPage-=1;
				//delegate
				$scope.jumpPage($scope.currentPage);
			}
		};

		// UPDATE
		$scope.getEditUserId = function(index) {
			sharedObject.editUserId = $scope.filteredResults[index]['userId'];
		};

		//DATABASE INTERFACE START--------------------
		//ADD METHOD
		$scope.dataResUsersList = $resource('./dataRes/dataResUsersList.php', {userId:sharedObject.userId}, {});

		//SELECT
		$scope.results = $scope.dataResUsersList.query(function() {
			//AFTER GET DATA
			$scope.filter = 'all';
			$scope.getSearchResult();
		});

		//INSERT
		$scope.add = function() {
			sharedObject.editUserId = null;
		};

		// DELETE
		$scope.trash = function(index) {
			// delete from database
			//I want to make this parameter with just id.
			var $param = new $scope.dataResUsersList();
			$param['userId'] = $scope.filteredResults[index]['userId'];
			$scope.filteredResults[index].$delete($param);
			$scope.filteredResults[index].isDeletedFlag = "1";
			$scope.getSearchResult();
			$scope.autoPaging();
		};
		//DATABASE INTERFACE END--------------------
	});
/*= = = = = = = = USERS PAGE - END = = = = = = = = */

/*= = = = = = = = PROFILE PAGE - START = = = = = = = = */
app.controller('profilePageController', function($scope, $resource, sharedObject, $state){
		//RELOAD
		if(angular.isUndefined(sharedObject.editUserId)) {
			$state.go('page1');
			return;
		}
		//TODO: When the user opens this page, and clicks "profile", the page won't be reloaded.
		//Priority: low

		$scope.roleIsDisabled = function() {
			if(sharedObject.roleId != '1') {
				//if user is not an admin user, disable
				return true;
			}
			else if(sharedObject.userId == sharedObject.editUserId) {
				//if it's user itself, diable
				return true;
			}
		};

		$scope.availabilityIsDisabled = function() {
			if(sharedObject.roleId != '1') {
				//if user is not an admin user, disable
				return true;
			}
			else if(sharedObject.userId == sharedObject.editUserId) {
				//if it's user itself, diable
				return true;
			}
		};

		$scope.userAvailabilityOptions = [
		{label:'Available', value:'0'},
		{label:'Unavailable', value:'1'}
		];

		//DATABASE INTERFACE START--------------------
		//ADD METHOD
		$scope.dataResEditUser = $resource('./dataRes/dataResEditUser.php', {
			userId:sharedObject.editUserId
		}, {
			// add PUT for update
			update: {method: 'PUT'}
		});

		//SELECT
		$scope.oneRecordUserData = $scope.dataResEditUser.query(function() {
			sharedObject.editUserId = $scope.oneRecordUserData[0].userId;

			//initialize dropdown
			$scope.initUserAvailability = function() {
				if($scope.oneRecordUserData[0].isDeletedFlag == "1") {
					$scope.oneRecordUserData[0].userAvailabilitySelected = $scope.userAvailabilityOptions[1];
				} else {
					$scope.oneRecordUserData[0].userAvailabilitySelected = $scope.userAvailabilityOptions[0];
				}
			};
			$scope.initUserAvailability();

			$scope.dataResEditUserGetUserroleMaster = $resource('./dataRes/dataResEditUserGetUserroleMaster.php', {}, {});
			$scope.userRoleOptions = $scope.dataResEditUserGetUserroleMaster.query( function() {
				var index = 0;
				angular.forEach($scope.userRoleOptions, function(record) {
					if(record['value'] == $scope.oneRecordUserData[0].RoleId) {
						$scope.oneRecordUserData[0].userRoleSelected = $scope.userRoleOptions[index];
					}
					index++;
				});
			});

			$scope.oneRecordUserData[0].currentPassword = null;
			$scope.oneRecordUserData[0].newPassword = null;
			$scope.oneRecordUserData[0].newPassword2 = null;
		});

		//DATABASE INTERFACE END--------------------

		$scope.saveProfile = function() {
			if($scope.oneRecordUserData[0].Email==null || sharedObject.editUserId==null) {
				return;
			}
			//DATABASE INTERFACE START--------------------
			//ADD METHOD
			$scope.dataResEditUserGetUserMaster = $resource('./dataRes/dataResEditUserGetUserMaster.php', {
				userId:sharedObject.editUserId,
				email:$scope.oneRecordUserData[0].Email
			}, {});
			//DATABASE INTERFACE END--------------------

			$scope.existEmail = $scope.dataResEditUserGetUserMaster.query(
				function(){
					if($scope.existEmail.length != 0) {
						//if the email address is not used by another user
						console.log("email address is used");
						return;
					}

					if ($scope.oneRecordUserData[0].password != null) {
						//existed user
						if($scope.oneRecordUserData[0].currentPassword != null || $scope.oneRecordUserData[0].newPassword != null || $scope.oneRecordUserData[0].newPassword2 != null)
						{
							if($scope.oneRecordUserData[0].currentPassword == $scope.oneRecordUserData[0].password) {
								if($scope.oneRecordUserData[0].newPassword == $scope.oneRecordUserData[0].newPassword2) {
									$scope.oneRecordUserData[0].password = $scope.oneRecordUserData[0].newPassword;
								} else {
									// repeat password error
									console.log("repeat password error");
									return;
								}
							} else {
								//current password error
								console.log("current password error");
								return;
							}
						}
					} else if ($scope.oneRecordUserData[0].password == null) {
						//new user
						if ($scope.oneRecordUserData[0].newPassword != null || $scope.oneRecordUserData[0].newPassword2 != null) {
							if($scope.oneRecordUserData[0].newPassword == $scope.oneRecordUserData[0].newPassword2) {
								//if the passwords are mached
								$scope.oneRecordUserData[0].password = $scope.oneRecordUserData[0].newPassword;
							} else {
								// repeat password error
								console.log("repeat password error(new)");
								return;
							}					
						} else {
							// no password error
							console.log("no password error");
							return;
						}
					}
					$scope.oneRecordUserData[0].userId = sharedObject.editUserId;
					$scope.oneRecordUserData[0].isDeletedFlag = $scope.oneRecordUserData[0].userAvailabilitySelected['value'];
					$scope.oneRecordUserData[0].RoleId = $scope.oneRecordUserData[0].userRoleSelected['value'];
					$scope.oneRecordUserData[0].$update(function(){
						//compromised router
						if(sharedObject.userId == sharedObject.editUserId) {
							//from profile(If user chose itself on users, it should jump to page4)
							$state.go('page1');
						} else {
							//from users
							$state.go('page4');
						}
					});
		});
};
});
/*= = = = = = = = PROFILE PAGE - END = = = = = = = = */

/*= = = = = = = = CONTACTS PAGE - START = = = = = = = = */
	//COPY and PASTE... I don't like... how to combine?
	app.controller('contactsPageController', function($scope, $resource, $filter, sharedObject){
		$scope.results = [];
		$scope.filteredResults = [];
		$scope.pageSize = 10;
		$scope.currentPage = 0;

		$scope.numberOfPages = function() {
			return Math.ceil($scope.filteredResults.length/$scope.pageSize);
		};

		$scope.jumpPage = function(pageNumber) {
			$scope.currentPage = pageNumber;
		};

		//FILTERS START--------------------
		$scope.getCommentSearchResult = function() {
			$scope.getSearchResult();
			$scope.currentPage = 0;
		};
		//FILTERS END--------------------

		//SEARCH START--------------------
		$scope.getSearchResult = function() {
			$scope.filteredResults = $filter('filter')($scope.results, $scope.searchBox);
		};

		$scope.$watch('searchBox', function(newSearchBox) {
			$scope.getSearchResult();
		});
		//SEARCH END--------------------

		//DATABASE INTERFACE START--------------------
		//ADD METHOD
		$scope.dataResContacts = $resource('./dataRes/dataResContacts.php');

		//SELECT
		$scope.results = $scope.dataResContacts.query(function() {
			//AFTER GET DATA
			$scope.getSearchResult();
		});
		//DATABASE INTERFACE END--------------------
	});
/*= = = = = = = = CONTACTS PAGE - END = = = = = = = = */

/*= = = = = = = = TAGS PAGE - START = = = = = = = = */
	//COPY and PASTE... I don't like... how to combine?
	app.controller('tagsPageController', function($scope, $resource, $filter, sharedObject){
		$scope.results = [];
		$scope.filteredResults = [];
		$scope.pageSize = 10;
		$scope.currentPage = 0;

		$scope.numberOfPages = function() {
			return Math.ceil($scope.filteredResults.length/$scope.pageSize);
		};

		$scope.jumpPage = function(pageNumber) {
			$scope.currentPage = pageNumber;
		};

		$scope.addToggleVal = false;
		$scope.addToggle = function() {
			$scope.addToggleVal = !$scope.addToggleVal;
		};

		$scope.addTagName = '';
		$scope.addDescription = '';
		$scope.bindNewTagNameManually = function(param) {
			$scope.addTagName=param;
		};
		$scope.bindNewTagDescManually = function(param) {
			$scope.addDescription=param;
		};
		$scope.add = function() {
			dataResTags = $resource('./dataRes/dataResTags.php', {
				tagName: $scope.addTagName,
				description: $scope.addDescription,
				userId: sharedObject.userId
			}, {
				// add PUT for update
				update: {method: 'PUT'}
			});
			dataResTags.save(function(){
				//Get data again
				$scope.results = dataResTags.query(function() {
					//AFTER GET DATA
					$scope.getSearchResult();
					$scope.addTagName = '';
					$scope.addDescription = '';
					$scope.addToggleVal = false;
				});
			});
		};

		$scope.update = function(index) {
			dataResTags = $resource('./dataRes/dataResTags.php', {
				tagId:$scope.filteredResults[index]['tagId'],
				tagName:$scope.filteredResults[index]['tagName'],
				description:$scope.filteredResults[index]['description']
			}, {
				// add PUT for update
				update: {method: 'PUT'}
			});
			dataResTags.update();
		};

		// DELETE
		$scope.delete = function(index) {
			// delete from database
			//I want to make this parameter with just id.
			var $param = new $scope.dataResTags();
			$param['tagId'] = $scope.filteredResults[index]['tagId'];
			$scope.dataResTags.delete($param);

			var deleteIndex = 0, isFinished = false;
			angular.forEach($scope.results, function(deletedRecord) {
				if(!isFinished) {
					if(deletedRecord['tagId'] == $param['tagId']) {
						$scope.filteredResults.splice(index,1);
						$scope.results.splice(deleteIndex,1);
						isFinished = true;
					}
				}
				deleteIndex++;
			});
			$scope.autoPaging();
		};

		//COPY and PASTE... I don't like...
		$scope.autoPaging = function() {
			if(($scope.currentPage)*$scope.pageSize+1 > $scope.filteredResults.length) {
				//If user is seeing last page
				//Jump to the last page
				$scope.currentPage-=1;
				//delegate
				$scope.jumpPage($scope.currentPage);
			}
		};

		//FILTERS START--------------------
		$scope.getCommentSearchResult = function() {
			$scope.getSearchResult();
			$scope.currentPage = 0;
		};
		//FILTERS END--------------------

		//SEARCH START--------------------
		$scope.getSearchResult = function() {
			$scope.filteredResults = $filter('filter')($scope.results, $scope.searchBox);
		};

		$scope.$watch('searchBox', function(newSearchBox) {
			$scope.getSearchResult();
		});
		//SEARCH END--------------------

		//DATABASE INTERFACE START--------------------
		//ADD METHOD
		$scope.dataResTags = $resource('./dataRes/dataResTags.php', {
			userId: sharedObject.userId
		});

		//SELECT
		$scope.results = $scope.dataResTags.query(function() {
			//AFTER GET DATA
			$scope.getSearchResult();
		});
		//DATABASE INTERFACE END--------------------
	});
/*= = = = = = = = TAGS PAGE - END = = = = = = = = */
}());
