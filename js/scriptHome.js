var app = angular.module('myApp', ['ngSanitize']);
app.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
  ]);
});
app.controller('myCtrl', function($scope) {

  $scope.stream = [
    //Publicación 1
    {
      id: 0,
      textBody: "Nostalgia meets the future",
      user: {
        firstName: "r/gaming"
      },
      timestamp: 1443554687980,
      imgURL: "https://preview.redd.it/bjknvwahmej81.jpg?width=640&crop=smart&auto=webp&s=c80ddab6535e831b26d1c9b0e7dcfd4567adb784",
      sweet: [{
        id: 2
      }, {
        id: 1,
        firstName: "r/gaming"
      }], //comentarios
      comments: [{
        textBody: "Sad.",
        user: {
          firstName: "u/Truand"
        },
        timestamp: 1443554987962
      }, {
        textBody: "Future...",
        user: {
          firstName: "u/NastyLaw",
        },
        timestamp: 1443555998962
      }]
    }, //publicación 2
    {
      id: 1,
      textBody: "What matters the most?",
      user: {
        firstName: "r/gaming"
      },
      timestamp: 1543554687989,
      imgURL: "https://preview.redd.it/abkft2gxakj81.jpg?width=640&crop=smart&auto=webp&s=d4cb55efea282a857c706f46fce4af772eb7d1a1",
      sweet: [{
        id: 1
      }, {
        id: 2
      }], // comentarios
      comments: [{
        textBody: "Increíble.",
        user: {
          firstName: "u/Bakatora34"
        },
        timestamp: 1543554987889
      }, {
        textBody: "Jajajaja",
        user: {
          firstName: "u/thanava96",
        },
        timestamp: 1543555999999
      }]
    }, 
    { //publicacion 3
      id: 2,
      textBody: "iPhone 13 con Ceramic Shield. Más resistente que cualquier vidrio de smartphone. Calma, es un iPhone.",
      user: {
        firstName: "r/gaming"
      },
      timestamp: 1597888988800,
      imgURL: "https://www.apple.com/co/iphone-13/images/overview/hero/hero_1_static__d195o2nfxt26_large.jpg",
      sweet: [{
        id: 2
      }], //comentarios
      comments: [{
        textBody: "Excelente.",
        user: {
          firstName: "u/Bvr87"
        },
        timestamp: 1597997959887
      }, {
        textBody: "¡Maravilloso!",
        user: {
          firstName: "u/chocolombia"
        },
        timestamp: 1598888979987
      }]
    }
  ];

  //Datos del perfil
  $scope.data = {
    user: {
      id: 1,
      firstName: "r/gaming"
    },
    friends: [],
  };

  //nueva publicación
  $scope.newPost = {};

  //nueva imagen
  $scope.newimg = {};

  //img
  $scope.modalImg = {};


  //buscar amigos
  $scope.usersSearchResults = [];

  $scope.pendingFriendRequests = [];

  //funciones angular

  //se realiza la publicación al presionar enter 
  $scope.createNewPostOnEnter = function(event) {
    if (event.which == 13 || event.keyCode == 13) {
      createNewPost();
    }
  }

  //crear una nueva publicación
  var createNewPost = function() {
    $('.upload-photo').hide();
    var postText = "";
    if ($scope.newPost.text) postText = $scope.formatLinks($scope.newPost.text);

    var newPost = {
      id: $scope.stream.length,
      textBody: postText,
      user: $scope.data.user,
      timestamp: Date.now(),
      sweet: [],
      comments: []
    }

    if ($scope.newimg.src) {
      newPost.imgURL = $scope.newimg.src;
    }

    $scope.stream.push(newPost);
    console.log($scope.stream);

    $scope.newPost.text = "";
    var ta = document.querySelector('textarea');
    autosize(ta);
    ta.value = "";
    var evt = document.createEvent('Event');
    evt.initEvent('autosize:update', true, false);
    ta.dispatchEvent(evt);
    $scope.newimg.src = "";
    $("#imginputpreview").attr('src', "");

    return false;
  }

  //Formato para URL 
  $scope.formatLinks = function(string) {
    var stringArray = string.split(" ");
    var i;
    for (i = 0; i < stringArray.length; i++) {
      if (stringArray[i].indexOf("http") == 0 || stringArray[i].indexOf("https") == 0 || stringArray[i].indexOf("HTTP") == 0 || stringArray[i].indexOf("HTTPS") == 0) {
        var newString = "<a href='" + stringArray[i] + "' target='_blank'>" + stringArray[i] + "</a>";
        stringArray[i] = newString;
      }
    }

    return stringArray.join(" ");

  }

  //Crear nuevo comentario
  $scope.createNewReply = function(event, post) {
    if (event.which == 13 || event.keyCode == 13) {
      var newReply = {
        id: post.comments.length,
        textBody: post.newReply.text,
        user: $scope.data.user,
        timestamp: Date.now()
      }
      post.comments.push(newReply);

      var ta = $("#post" + post.id + " textarea");
      ta.val("");
      autosize.update(ta);

      return false;
    }
  }

  //La votación en la publicación
  $scope.upvote = function(post) {
    var index = $scope.indexOfSweet(post);
    if (index < 0) {
      post.sweet.push($scope.data.user);
    } else {
      post.sweet.splice(index, 1);
    }
  }

//Cambiar el estado de la votación
  $scope.indexOfSweet = function(post) {
    for (i = 0; i < post.sweet.length; i++) {
      if (post.sweet[i].id == $scope.data.user.id) return i;
    }
    return -1;
  }

  //verificar si se ha realizado un voto en la publicación
  $scope.isUpvoted = function(post) {
    for (i = 0; i < post.sweet.length; i++) {
      if (post.sweet[i].id == $scope.data.user.id) return true;
    }
    return false;
  }

  //Expandir la sección de comentarios en la publicación
  $scope.openComments = function(post) {
    $scope.setAutoResize(post);
    $("#post" + post.id + " .comments").toggle('ease');
    $("#post" + post.id + " .comments").find('textarea').focus();
  }

  $scope.setAutoResize = function(post) {
    var ta = $("#post" + post.id + " textarea");
    ta.val("");
    autosize(ta);
  }

  //Cargar una nueva foto de perfil
  $scope.newProfileImg = function() {
    $("#profileImgInput").click();
  }
  $("#profileImgInput").change(function() {
    var input = this;
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function(e) {
        $scope.data.user.imgURL = e.target.result;
        $("#profile-img").attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]);
    }
  });

  //Buscar amigos
  $scope.searchUsers = function() {
    $scope.usersSearchResults = [];

    var inputText = $scope.friendSearchInput.text.toLowerCase();
    var inputTextArray = inputText.split(" ");
    var inputTextFirst = inputTextArray[0];
    var inputTextSecond = inputTextArray[1];

    var i;
    for (i = 0; i < worldUserList.length; i++) {
      var friend = worldUserList[i];
      var firstName = friend.firstName.toLowerCase();
      var lastName = friend.lastName.toLowerCase();
      var iOfFirst = firstName.indexOf(inputTextFirst);
      var iOfLast = lastName.indexOf(inputTextFirst);
      var iOfLastSecond = lastName.indexOf(inputTextSecond);
      var areFriends = $scope.userIsFriend(worldUserList[i]);
      if (
        (iOfFirst == 0 && !inputTextSecond && !areFriends) //comprueba el nombre
        || (iOfLast == 0 && !inputTextSecond && !areFriends) //comprueba el apellido
        || (iOfFirst == 0 && iOfLastSecond == 0 && !areFriends) //comprueba ambos (nombre y apellido)
      ) {
        $scope.usersSearchResults.push(worldUserList[i]);
      }
    }
  }

  $scope.userIsFriend = function(user) {
    var i;
    for (i = 0; i < $scope.pendingFriendRequests.length; i++) {
      if (user.id == $scope.pendingFriendRequests[i].id) return true;
    }
    for (i = 0; i < $scope.data.friends.length; i++) {
      if (user.id == $scope.data.friends[i].id) return true;
    }
    return false;
  }

  $scope.sendFriendRequest = function(friend) {
    $scope.pendingFriendRequests.push(friend);
    $scope.usersSearchResults = [];
    $scope.friendSearchInput = "";
  }

  $scope.approveFriendRequest = function(friend) {
    var indexOfFriend = $scope.pendingFriendRequests.indexOf(friend);
    $scope.pendingFriendRequests.splice(indexOfFriend, 1);
    $scope.data.friends.push(friend);
  }

});


//el tamaño del area de la publicación 
autosize($('textarea'));


function getProfileImage(imgSrc) {
  var img = new Image();
  img.src = imgSrc;
  img.onload = function() {
    if (img.width <= img.height) img.style.width = '100%';
    else img.style.height = '100%';
  }
  return img;
}

function loadImg(imgContainer, img) {
  imgContainer.append(img);
}

//Lista de amigos

var worldUserList = [{
  id: 0,
  firstName: "Jessica",
  lastName: "Zambrano",
  friendsInCommon: 12,
  imgURL: "https://media.istockphoto.com/vectors/woman-female-avatar-character-vector-id943945990?k=20&m=943945990&s=170667a&w=0&h=V9iQLs_fw7YzKZQFV36X5xPcpTSBiHzKyRzPBZXU31k="
}, {
  id: 1,
  firstName: "Alvaro",
  lastName: "Lopez",
  friendsInCommon: 4,
  imgURL: "https://static.vecteezy.com/system/resources/previews/002/275/847/non_2x/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg"
}, {
  id: 2,
  firstName: "Andrea",
  lastName: "Llerena",
  friendsInCommon: 7,
  imgURL: "https://www.royallogistic.com.ar/wp-content/uploads/2016/06/iconfinder-11-avatar-2754576_120520.png"
}, {
  id: 3,
  firstName: "Naomi",
  lastName: "Cuello",
  friendsInCommon: 2,
  imgURL: "https://static.vecteezy.com/system/resources/previews/002/275/818/non_2x/female-avatar-woman-profile-icon-for-network-vector.jpg"
}, ];