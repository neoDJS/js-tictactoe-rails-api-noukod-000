// Code your JavaScript / jQuery solution here
turn = 0;
let gameId;

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
       case_i => $(squares[case_i]).text() === 'X') || case_set.every(
         case_i => $(squares[case_i]).text() === 'O'));

  if(index >= 0){
    setMessage(`Player ${$(squares[WIN_COMBINATIONS[index][0]]).text()} Won!`);
    return true;
  }

  return false;
}

function doTurn(elem){
  if($(elem).text() == ''){
    updateState(elem);
    turn++;
  }

  if (checkWinner()){
    // alert('');
    $("#save").trigger("click");
    reset();
  } else if ($.makeArray($('td')).every(e => $(e).text() != '')) {
    $("#save").trigger( "click" );
    setMessage('Tie game.');
    reset();
  }
}

function reset(){
  turn = 0;
  gameId = null;
  $('td').empty();
  $('#games').empty();
  $('#message').empty();
  // console.log(turn);
}

function attachListeners(){
  $("#save").on('click', saveGame);
  $("#clear").on('click', clearGame);
  $("#previous").on('click', previousGames);
  $("td").on('click', function(){
    if((!checkWinner()) && (turn <= 9)){
      doTurn(this);
    }
  });
}

function saveGame(event){
  //prevent form from submitting the default way
  event.preventDefault();
  let tab = [];
  $('td').text(c => {
    tab.push(c);
  });
  var values = {state: $.makeArray($('td').text())}
  if (gameId){
    var posting = $.ajax({
        type: 'PATCH',
        url: `/games/${gameId}`,
        data: values
      });
  } else {
    var posting = $.post('/games', values);
  }

  posting.done(function(game) {
    // TODO: handle response
    gameId = game.data.id;
  });
}

function clearGame(event){
  reset();
}

function previousGames(event){
  $('#games').empty();

    $.getJSON('/games', res => {
        res["data"].length && res["data"].forEach(game => {
            $('#games').append(`<button id="game-${game.id}" data-id="${game.id}">${game.id}</button>`);
            $(`#game-${game.id}`).on('click', openGame);
        });
    }).fail(function(error) {
        console.log('Something went wrong: ' + error.statusText);
  });
}

function openGame(event){
  reset();
  const id = $(this).data("id");
  $.getJSON(`/games/${id}`, res => {
    let ci;
    res["data"]["attributes"]["state"].forEach((val, i)=>{
          $($('td')[i]).text(val);
          if (val != ''){ci = i;}
    });
    turn = res["data"]["attributes"]["state"].join('').length;
    gameId = res["data"]["id"];
    if (ci) {
      doTurn($('td')[ci]);
    }
  }).fail(function(error) {
        console.log('Chargement du jeu non reussi: ' + error.statusText);
  });
}
