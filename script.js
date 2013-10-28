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
			$("table").hide();
			$("body").append("<div id=\"please-wait-message\">Please wait. Initializing drawboard...</div>");
			initBackEnd();
			return;
		}
		for (var i = 0; i < snapshot.val().length; i++) {
			paint(snapshot.val()[i]);
		}
	});

	$("td").mousedown(function() {
		mousedown = true;
		var row = $(this).data("row"), col = $(this).data("col");
		$(this).css("background-color", getRGBNotation());
		drawingBoardData.child(row).child(col).set({red: red, green: green, blue: blue, row: row, col: col});
	});

	$("html").mouseup(function() {
		mousedown = false;
	});

	$("td").mouseenter(function() {
		if (mousedown) {
			var row = $(this).data("row"), col = $(this).data("col");
			$(this).css("background-color", getRGBNotation());
			drawingBoardData.child(row).child(col).set({red: red, green: green, blue: blue, row: row, col: col});
		}
	});

	$("input").change(function() {
		$("div#preview").css("background-color", getRGBNotation());
	});

	function initBackEnd() {
		var tmp = [];
		for (var i = 0; i < 25; i++) {
			tmp[i] = []
			for (var j = 0; j < 25; j++) {
				tmp[i][j] = {red: 255, green: 255, blue: 255, row: i, col: j};
			}
		}
		drawingBoardData.set(tmp);
		console.log("Done!");
		console.log("Showing...");
		$("table").show();
		$("div#please-wait-message").remove();
	}

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
			$("table tr:nth-of-type(" + (input[i].row+1) + ") td:nth-of-type(" + (input[i].col+1) + ")").css("background-color", getRGBNotationFromParams(input[i]));
		}
	}
});
