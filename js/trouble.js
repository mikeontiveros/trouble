// SETUP GAME INTERFACE

// An array of all four possible player objects, in clockwise
// order as they appear on the board.  enabled indicates whether
// a player is NOT enabled (""), enabled as a human ("H") or
// enabled as a computer ("C").  The initial game state is for a
// two-player game between computers, Red vs. Green.
var player = [
    { name: "Red", enabled: "C" },
    { name: "Yellow", enabled: "" },
    { name: "Green", enabled: "C" },
    { name: "Blue", enabled: "" }
]

// the game loop common to all players
var loop = []
for (var i = 0; i < 4 * 7; i++) {
    loop.push(-1);
}

// rotation is an array of the numerical labels (0-3) of enabled
// players.  atBat is the numerical label (0-3) of the player
// whose turn it is; order is his order in the rotation.
var rotation = []; order = -1; atBat = -1;

// roll is the number (1-6) a player rolls.  options is an array
// of moves (-6, 0-30) the player can make given what he has
// rolled.  choice is the move he chooses from his options.
var roll = 0, options = [], choice= -1;

var gameOn = false, gameWon = false;
var awaitInput = true, awaitRoll = false, awaitMove = false;
var num, sum, ind, temp, message;

$('#requestGame').click(function (evt) {
    requestGame();
});
$('#board').click(function (evt) {
    doClick(evt);
});


// FUNCTIONS

function requestGame() {
    if (gameOn) {
        inSession();
    } else {
        if ( atLeast2() ) {
            gameOn = true;
            setupGame();
        } else {
            morePlayers();
        }
    }
}

function inSession () {
    awaitInput = false;
    temp = $('#gamelog').text();
    $('#gamelog').text("Game is in session. Reload page to start a new one.");
    $('#gamelog').css({"color": "red", "font-weight": "bold"});
    setTimeout(function () {
        $('#gamelog').text(temp);
        $('#gamelog').removeAttr("style");
        awaitInput = true;
    }, 2500);
}

function atLeast2 () {
    sum = 0
    for (var i = 0; i < 4; i++) {
        sum = sum + ( player[i].enabled != "" );
    }
    return sum > 1;
}

function setupGame() {
    for (var i = 0; i < 4; i++) {
        player[i].lane = loop.concat( [-1, -1, -1, -1] );
        player[i].inGame = ( player[i].enabled != "" );
        player[i].base = 4 * player[i].inGame;
        if (player[i].inGame) { rotation.push(i); }
    }
    order = Math.floor( rotation.length * Math.random() );
    atBat = rotation[order];
    $('#gamelog').text("Game on! " + player[atBat].name + " goes first. Click the die to roll.");
    awaitRoll = true;
}

function morePlayers() {
    awaitInput = false;
    temp = $('#gamelog').text();
    $('#gamelog').text("Please select at least two players.");
    $('#gamelog').css({"color": "red", "font-weight": "bold"});
    setTimeout(function () {
        $('#gamelog').text(temp);
        $('#gamelog').removeAttr("style");
        awaitInput = true;
    }, 2500);
}

function doClick(evt) {
    var $targ = $(evt.target);
    var etid = evt.target.id;
    if (awaitInput) {
        if (gameOn) {
            if (awaitRoll) {
                if ( etid == "die" ) { rollDie(); }
            } else if (awaitMove) {
                doMove(etid);
            }
        } else if ( etid.substring(0,1) == "e" ) {
            updateLineup(etid);
        }
    }
}

function updateLineup(etid) {
    num = Number( etid.substring(1) );
    ind = ["", "H", "C"].indexOf( player[num].enabled );
    ind = (1 + ind).mod(3);
    temp = ["", "H", "C"][ind];
    player[num].enabled = temp;
    $("#" + etid).text( temp );
    $('#b' + num ).text(4 * temp.length);
}

function rollDie() {
    awaitRoll = false;
    roll = 1 + Math.floor(6 * Math.random());
    $(die).text(roll);
    message = player[atBat].name + " rolled a " + roll;
    loop2lane();
    findOptions();
    if (options.length > 0) {
        message = message + ". Make a move, " + player[atBat].name + "."
        awaitMove = true;
    } else {
        message = message + " and has no options. "
        nextTurn();
    }
    $('#gamelog').text(message);
}

function loop2lane() {
    for (var i = 0; i < 28; i++) {
        ind = (7 * atBat + i).mod(28);
        player[atBat].lane[i] = loop[ind];
    }
}

function findOptions() {
    options = [];
    if (player[atBat].base > 0 && roll == 6 && player[atBat].lane[0] != atBat) {
        options.push(-6);
    }
    for (var i = 0; i < 28 + 3; i++) {
        if (i + roll < 28 + 4) {
            if ( player[atBat].lane[i] == atBat &&
                 player[atBat].lane[i + roll] != atBat ) {
                options.push(i);
            }
        }
    }
}

function nextTurn() {
    order = order + 1 - Math.floor(roll / 6);
    order = order.mod( rotation.length )
    atBat = rotation[order];
    message = message + player[atBat].name + ' is next. Click to roll the die.'
    awaitRoll = true
}

function doMove (etid) {
    awaitMove = false;
    getChoice(etid);
    if (options.indexOf(choice) < 0) {
        tryAgain();
        awaitMove = true;
    } else {
        movePeg();
        if ( noWinner() ) {
            nextTurn()
            $('#gamelog').text(message);
        };
    }
}

function getChoice(etid) {
    choice = -1;
    if (etid == "b" + atBat) {
        choice = -6;
    } else if (etid.substring(0,1) == "h") {
        choice = Number(etid.substring(1)) - 7 * atBat
        choice = choice.mod(28);
    } else if (etid.substring(0,1) == "f") {
        choice = Number(etid.substring(1)) - 4 * atBat;
        if ( choice == choice.mod(4) ) {
            choice += 28;
        } else { choice = -1; }
    }
}

function tryAgain() {
    awaitInput = false;
    temp = $('#gamelog').text();
    $('#gamelog').text("Invalid choice. Try again.");
    $('#gamelog').css({"color": "red", "font-weight": "bold"});
    setTimeout(function () {
        $('#gamelog').text(temp);
        $('#gamelog').removeAttr("style");
        awaitInput = true;
    }, 2500);
}

function movePeg() {
    message = player[atBat].name + " moves"
    var landOn = player[atBat].lane[choice + roll]
    if (landOn > -1) {
        message = message + " and sends a " + player[landOn].name.toLowerCase() + " peg home. ";
        player[landOn].base = player[landOn].base + 1;
        $("#b" + landOn).text(player[landOn].base);
    } else {
        message = message + ". ";
    }
    updateFrom();
    updateTo();
    lane2loop();
}

function updateFrom() {
    if (choice == -6) {
        player[atBat].base = player[atBat].base - 1;
        $("#b" + atBat).text(player[atBat].base);
    } else if (choice > 27) {
        player[atBat].lane[choice] = -1;
        num = 4 * atBat + choice - 28;
        $("#f" + num).removeAttr("style");
    } else {
        player[atBat].lane[choice] = -1;
        num = (7 * atBat + choice).mod(28);
        $("#h" + num).removeAttr("style");
    }
}

function updateTo() {
    player[atBat].lane[choice + roll] = atBat;
    if (choice + roll > 27) {
        num = 4 * atBat + choice + roll - 28;
        $("#f" + num).css('background-color', player[atBat].name);
    } else {
        num = (7 * atBat + choice + roll).mod(28);
        $("#h" + num).css('background-color', player[atBat].name);
    }
}

function lane2loop() {
    for (var i = 0; i < 4 * 7; i++) {
        ind = (7 * atBat + i).mod(28);
        loop[ind] = player[atBat].lane[i];
    }
}

function noWinner() {
    if (player[atBat].lane[28] == atBat &&
        player[atBat].lane[29] == atBat &&
        player[atBat].lane[30] == atBat &&
        player[atBat].lane[31] == atBat) {
        message = message + player[atBat].name.toUpperCase() + " WINS!!!" + "Reload page to play again."
        $('#gamelog').text(message);
        $('#gamelog').css({"font-weight": "bold"});
        return false;
    } else { return true; }
}

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
}
