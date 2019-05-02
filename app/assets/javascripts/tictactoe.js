// Code your JavaScript / jQuery solution here
turn = 0;
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
    // var x = parseInt($(el).data("x"));
    // var y = parseInt($(el).data("y"));
    $(el).text(player());
}

function setMessage(value){
  $('div#message').text(value);
}

function checkWinner(){
  const squares = $.makeArray($('td'));
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
   ];

   let index = WIN_COMBINATIONS.findIndex(
     case_set => case_set.every(
       case_i => squares[case_i].innerHTML === 'X') || case_set.every(
         case_i => squares[case_i].innerHTML === 'O'));

  if(index >= 0){
    setMessage(`Player ${squares[WIN_COMBINATIONS[index][0]].innerHTML} Won!`);
    return true;
  }

  return false;
}

function doTurn(elem){
  updateState(elem)
  if (checkWinner()){
    // alert('');
    reset();
  } else if ($.makeArray($('td')).every(e => e.innerHTML != '')) {
    setMessage('Tie game.');
  }
  turn++;
}

function reset(){
  $('td').each( e => {
    e.text('');
  });
  turn = 0;
}

function attachListeners(){
  $("#save").on('click', saveGame);
  $("#clear").on('click', clearGame);
  $("#previous").on('click', previousGames);
  $("td").on('click', function(){
    doTurn(this);
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
