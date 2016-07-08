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

var active = [], options = [];
var turn = -1, turnIndex = -1, roll = 0;
var gameOn = false, gameWon = false, rolling = false;
var message = "";

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
    if (!gameWon) {
    if (gameOn) {
        if (rolling) {
            if ( evt.target.id = "die" ) {
                rolling = false;
                roll = 1 + Math.floor(6 * Math.random());
                $(evt.target).text(roll);
                message = player[turn].name + " rolled a " + roll;
                loop2lane();
                findOptions();
                if (options.length > 0) {
                    message = message + ". Make a move, " + player[turn].name + "."
                    $('#gamelog').text(message);
                } else {
                    message = message + " and has no options. "
                    nextTurn();
                    $('#gamelog').text(message)
                }
            }
        } else {
            message = "";
        }
    } else {
        if ( $(evt.target).hasClass("enable") ) {
            $(evt.target).text( ["X", ""][$(evt.target).text().length] );
            $('#d' + evt.target.id.substring(1) ).text(4 * $(evt.target).text().length);
        }
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
    turnIndex = Math.floor(active.length * Math.random())
    turn = active[turnIndex];
    $('#gamelog').text("Game on! " + player[turn].name + " goes first. Click the die to roll.");
    rolling = true;
}


function loop2lane() {
    for (var i = 0; i < 4 * 7; i++) {
        player[turn].lane[i] = loop[7 * turn + i];
    }
}


function lane2loop() {
    for (var i = 0; i < 4 * 7; i++) {
        loop[7 * turn + i] = player[turn].lane[i];
    }
}


function findOptions() {
    options = [];
    if (player[turn].dugout > 0 && roll == 6 && player[turn].lane[0] != turn) {
        options.push(-6);
    }
    for (var i = 0; i < 4 * 7; i++) {
        if (i + roll < 4 * 7 + 4) {
            if (player[turn].lane[i] == turn &&
                player[turn].lane[i + roll] != turn ) {
                options.push(i);
            }
        }
    }
}


function nextTurn() {
    turnIndex = turnIndex + 1 - Math.floor(roll / 6);
    turnIndex = turnIndex % active.length;
    turn = active[turnIndex];
    message = message + player[turn].name + ' is next. Click to roll the die.'
    rolling = true
}

// if any of a player's pieces are in his dugout, he is said to have a piece at position -6 in his lane.


