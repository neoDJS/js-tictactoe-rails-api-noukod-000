// Code your JavaScript / jQuery solution here
let turn = 0;
let gameId;
let state = ['', '', '', '', '', '', '', '', ''];

$(document).ready(function(){
  attachListeners();
});

function player(){
  const label = (turn % 2 == 0) ? 'X' : 'O';
  return label;
}

function updateState(el){
    var x = parseInt($(el).data("x"));
    var y = parseInt($(el).data("y"));
    state[x+(3*y)] = player();
}

function setMessage(value){
  $('div#message').text(value);
}

function checkWinner(){
  const WIN_COMBINATIONS = [
     [0,1,2], // Top row
     [3,4,5],  // Middle row
     [6,7,8], // Bottom row
     [0,3,6],  // Middle row
     [1,4,7], // Top row
     [2,5,8],  // Middle row
     [0,4,8], // Top row
     [2,4,6]  // Middle row
     // ETC, an array for each win combination
   ]

   let index = WIN_COMBINATIONS.findIndex(
     case_set => case_set.every(
       case_i => state[case_i] == "X") || case_set.every(
         case_i =>state[case_i] == "O"));

  if(index >= 0){
    setMessage(`Player ${state[WIN_COMBINATIONS[index][0]]} Won!`);
    return true;
  }

  return false;
}

function doTurn(elem){
  turn++;
  updateState(elem)
  if (checkWinner()){
    // alert('');
  } else {
    $('div#message').text("Game tied!");
  }
}

function attachListeners(){
  $("#save").on('click', saveGame);
  $("#clear").on('click', clearGame);
  $("#previous").on('click', previousGames);
  $("td").on('click', function(){
    doTurn();
  });
}

function saveGame(event){
  //prevent form from submitting the default way
  event.preventDefault();

  var values = $(state).serialize();
  if (gameId){
    var posting = $.patch(`/games/${gameId}`, values);
  } else {
    var posting = $.post('/games', values);
  }

  posting.done(function(data) {
    // TODO: handle response
  });
}

function clearGame(event){
  //prevent form from submitting the default way
  event.preventDefault();

  // var values = $(this).serialize();
  //
  // var posting = $.post('/posts', values);
  //
  // posting.done(function(data) {
  //   // TODO: handle response
  // });
}

function previousGames(event){
  //prevent form from submitting the default way
  event.preventDefault();

  // var values = $(this).serialize();
  //
  // var posting = $.post('/posts', values);
  //
  // posting.done(function(data) {
  //   // TODO: handle response
  // });
}
