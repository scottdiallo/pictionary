var pictionary = function() {

    var socket = io();

    var canvas, context, guessBox;
    var drawing = false;

    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };

    var showGuess = function(guess) {
        console.log(guess);
        $('#guesses').text('Guess: ' + guess.toUpperCase());
    };

    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }

        var guess = guessBox.val();
        socket.emit('guess', guess);
        showGuess(guess);

        guessBox.val('');
    };

    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.on('mousedown', function() {
        drawing = true;
        return drawing;
    });
    canvas.on('mouseup', function() {
        drawing = false;
        return drawing;
    });


    canvas.on('mousemove', function(event) {
        if (drawing) {
            var offset = canvas.offset();
            var position = {x: event.pageX - offset.left,
                y: event.pageY - offset.top};
            socket.emit('draw', position);
            draw(position);
        }
    });


    socket.on('draw', draw);
    socket.on('guess', showGuess);
    socket.on('disconnect', function(message) {
        console.log(message);
        $('#error-message').text(message);
    });
};

$(document).ready(function() {
    pictionary();
});