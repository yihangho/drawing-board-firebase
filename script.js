$(document).ready(function() {
	var mousedown = false;
	var arr;
	var red, green, blue;
	var drawingBoardData = new Firebase("https://yihang-drawing-board.firebaseio.com/board1");

	drawingBoardData.on('child_changed', function(snapshot) {
		paint(snapshot.val());
	});

	drawingBoardData.on('value', function(snapshot) {
		drawingBoardData.off('value');
		if (snapshot.val() == null) {
			return;
		}
		arr = snapshot.val();
		for (var i = 0; i < snapshot.val().length; i++) {
			paint(snapshot.val()[i]);
		}
	});

	$("td").mousedown(function() {
		mousedown = true;
		var row = $(this).data("row"), col = $(this).data("col");
		$(this).css("background-color", getRGBNotation());
		arr[row][col] = {red: red, green: green, blue: blue, row: row, col: col};
		drawingBoardData.set(arr);
	});

	$("html").mouseup(function() {
		mousedown = false;
	});

	$("td").mouseenter(function() {
		if (mousedown) {
			var row = $(this).data("row"), col = $(this).data("col");
			$(this).css("background-color", getRGBNotation());
			arr[row][col] = {red: red, green: green, blue: blue, row: row, col: col};
			drawingBoardData.set(arr);
		}
	});

	$("input").change(function() {
		$("div#preview").css("background-color", getRGBNotation());
	});

	function getRGBNotation() {
		red = $("input#red").val();
		green = $("input#green").val();
		blue = $("input#blue").val();
		return getRGBNotationFromParams({red: red, green: green, blue: blue});
	}

	function getRGBNotationFromParams(obj) {
		return "rgb(" + obj.red + "," + obj.green + "," + obj.blue + ")";
	}

	function paint(input) {
		for (var i = 0; i < input.length; i++) {
			console.log(input[i].row + ", " + input[i].col);
			$("table tr:nth-of-type(" + (input[i].row+1) + ") td:nth-of-type(" + (input[i].col+1) + ")").css("background-color", getRGBNotationFromParams(input[i]));
		}
	}
});
