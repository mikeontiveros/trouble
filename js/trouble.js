var player = [
    { name: "Red" },
    { name: "Yellow" },
    { name: "Green" },
    { name: "Blue" },
]

var loop = []
for (var i = 0; i < 4 * 7; i++) {
    loop.push(-1);
}

var active = [], turn = -1, gameOn = false;


$('#requestGame').click(requestGame);
$('#board').click(doMove);


function requestGame() {
    if (gameOn) {
        $('#gamelog').text("Game is in session. Reload page to start a new one.");
    } else {
        if ( atLeast2() ) {
            playGame();
        } else {
            $('#gamelog').text("Please select at least two players.");
        }
    }
}


function atLeast2 () {
    var sumEnabled = 0;
    for (var i = 0; i < 4; i++) {
        sumEnabled = sumEnabled + Number($('#e' + i).text().length);
    }
    return sumEnabled > 1;
}


function playGame() {
    gameOn = true;
    setupGame();
}


function doMove(evt) {
    if (gameOn) {
        // do stuff
    } else {
        if ( $(evt.target).hasClass("enable") ) {
            $(evt.target).text( ["X", ""][$(evt.target).text().length] );
            $('#d' + evt.target.id.substring(1) ).text(4 * $(evt.target).text().length);
        }
    }
}


function setupGame() {
    for (var i = 0; i < 4; i++) {
        player[i].active = $('#e' + i).text() == "X";
        player[i].dugout = 4 * player[i].active;
        player[i].lane = loop.concat( [-1, -1, -1, -1] );
        if (player[i].active) { active.push(i); }
    }
    console.log(active);
    console.log(active.length)
    turn = active[ Math.floor(active.length * Math.random()) ];
    console.log(turn);
    $('#gamelog').text("Game on! " + player[turn].name + " goes first. Click the die to roll.");
}


// while (!over) {

//     console.log(player[turn].name + "'s turn!");

//     var roll = 1 + Math.floor(Math.random());

//     console.log(player[turn].name + " has rolled a " + roll + ".");

//     find
//     // if any of a player's pieces are in his dugout, he is said to have a piece at position -6 in his lane.

// }
