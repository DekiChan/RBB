/* gameplay & mechanics javascript */
/* ***** generic functions ***** */
function Create2DArray(rows) {
  var arr = [];

  for (var i=0;i<rows;i++) {
     arr[i] = [];
  }

  return arr;
}

function getRow(matrix, row_n){
   var row = [];

   for (var i = 0; i < matrix.length; i++) {
   		row.push(matrix[i][row_n]);
   	};

   return row;
}

/* ***** define object GameSettings ***** */
/* **** creates game menu **** */
function GameSettings() {
	// static settings
	this.running_state = false;
	this.results = [];

	// runs at start
	this.init = function() {
		this.main_menu = $('div.game-menu');
		this.message_wrapper = $('div.game-messages');
		this.message_text = $('div.game-messages p#message-text');
		this.message_score = $('div.game-messages p#message-score');
		this.message_score_list = $('div.game-messages p#results-table');
		this.main_wrapper = $('main-wrapper');

		this.showMenu();
	}

	this.Start = function() {
		this.running_state = true;
	}

	this.Stop = function() {
		this.running_state = false;
	}

	this.getState = function() {
		return this.running_state;
	}

	this.hideMenu = function() {
		this.main_menu.css({
							'top': '-300px',
						});
	}

	this.showMenu = function() {
		this.main_menu.css({
							'top': '100px',
							'left': (($(window).width()/2)-100) + 'px'
						});	
	}

	this.showMessage = function(message, type, score) {

		this.message_score_list.html('');

		this.message_text.text(message);

		if (type == 'score_list') {
			var html_string = '';

			for (var i = 0; i < score.length; i++) {
				html_string = html_string + '<span>' + score[i] +  '</span>'
			};

			this.message_score_list.html(html_string);

		} else {
			this.message_score.text(score);			
		}


		this.message_wrapper.css({
							'top': '100px',
							'left': (($(window).width()/2)-100) + 'px'
		});
	}

	this.hideMessage = function() {
		this.message_wrapper.css({
							'top': '-300px',
						});
	}

	this.saveScore = function(score) {
		this.results.push(score);
		this.results.sort(function(a, b){return b-a});
	}

	this.getScoreList = function() {
		if (this.results.length > 5) {
			return this.results.slice(0, 4);
		} else {
			return this.results;	
		}		
	}
}


/* ***** define object Bubbles ***** */
/* **** creates bubble colors and provides function that randomly determines which class to assign to bubble **** */
function Bubbles() {

	// css classes
	this.colorClass = ['red', 'yellow', 'green', 'blue', 'purple', 'empty'];

	// color groups
	this.color_groups = {};
	this.color_groups.red = Create2DArray(10);
	this.color_groups.yellow = Create2DArray(10);
	this.color_groups.green = Create2DArray(10);
	this.color_groups.blue = Create2DArray(10);
	this.color_groups.purple = Create2DArray(10);
	this.color_groups.empty = Create2DArray(10);

	// score keeping
	this.score = 0;

	/* *** METHODS: *** */
	this.paint = function() {
		var color_num = Math.floor(Math.random()*4.99);

		return this.colorClass[color_num];
	}

	this.updateGroups = function(color, x, y) {
		// make all false (except empty)
		this.color_groups.red[x][y] = false;
		this.color_groups.yellow[x][y] = false;
		this.color_groups.green[x][y] = false;
		this.color_groups.blue[x][y] = false;
		this.color_groups.purple[x][y] = false;
		this.color_groups.empty[x][y] = false;

		switch (color) {
			case 'red':
				this.color_groups.red[x][y] = true;
				break;

			case 'yellow':
				this.color_groups.yellow[x][y] = true;
				break;

			case 'green':
				this.color_groups.green[x][y] = true;
				break;

			case 'blue':
				this.color_groups.blue[x][y] = true;
				break;

			case 'purple':
				this.color_groups.purple[x][y] = true;
				break;

			default:
				// ==empty
				this.color_groups.empty[x][y] = true;
				break;
		}
	}

	this.getGroup = function(color) {
		switch (color) {
			case 'red':
				return this.color_groups.red;
				break;

			case 'yellow':
				return this.color_groups.yellow;
				break;

			case 'green':
				return this.color_groups.green;
				break;

			case 'blue':
				return this.color_groups.blue;
				break;

			case 'purple':
				return this.color_groups.purple;
				break;

			default:
				// ==empty
				return this.color_groups.empty;
				break;
		}
	}

	this.addScore = function(n) {
		// n = number of bubbles popped
		var points = n*n-2*n+2;

		this.score = this.score + points;

		return points;
	}

	this.getScore = function() {
		return this.score;
	}

	this.resetScore = function() {
		this.score = 0;
	}
}

/* ***** define object BubblesContainer ***** */
/* **** creates playing field and keeps track of it's current state **** */

function BubblesContainer(sizeX, sizeY, Bubble, GameSettings) {

	this.sizeX = sizeX;
	this.sizeY = sizeY;
	this.Bubble = Bubble;
	this.GameSettings = GameSettings;
	this.field_container = $('.bubble-field-border');

	//layout size 
	this.screenWidth = $(window).width();
	this.screenHeight = $(window).height();
	this.bubbleMaxSize = (this.screenWidth-24)/10; // -14 je fix za border in padding
	
	if ((this.screenHeight-24)/16 < this.bubbleMaxSize) {
		this.bubbleMaxSize = (this.screenHeight-24)/16;
	} 

	if (this.bubbleMaxSize > 30) {
		this.bubbleMaxSize = 30;
	}

	// array that holds the state of all bubbles
	this.bubbles_state = Create2DArray(10);

	/* *** METHODS *** */
	this.initField = function() {
		// draw playing filed with all the bubbles and save the state of fields to bubbles state
		this.field_container.html('');
		for (var i = 0; i < this.sizeY; i++) {
			for (var j = 0; j < this.sizeX; j++) {
				// determine color class for current bubble
				this.bubbles_state[j][i] = this.Bubble.paint();
				this.Bubble.updateGroups(this.bubbles_state[j][i], j, i);

				// draw
				var bubble_field_id = 'bubble-field-' + j + '-' + i;

				var html_string = '<div class="bubble-field" id="' + bubble_field_id + '"></div>';
				this.field_container.append(html_string);

				html_string = '<div class="bubble ' + this.bubbles_state[j][i] + '-bubble' + '" id="bubble-' + j + '-' + i + '"></div>';
				$('#' + bubble_field_id).html(html_string);

				this.setFieldPosition(j, i, 'default', 0);
			};
		};
	}

	this.setFieldPosition = function(x, y, direction, num_of_fields) {
		switch (direction) {
			case 'down':
				bubble_field = $('[data-x-position="' + x + '"][data-y-position="' + (y-num_of_fields) + '"]');
				break;

			case 'right':
				bubble_field = $('[data-x-position="' + (x-num_of_fields) + '"][data-y-position="' + y + '"]');
				break;

			default:
				bubble_field = $('#bubble-field-' + x + '-' + y);
				break;
		}
		
		bubble_field.attr('data-x-position', x);
		bubble_field.attr('data-y-position', y);

		bubble_field.css({
							'top':y*this.bubbleMaxSize + 10,
							'left':x*this.bubbleMaxSize + 10
		});

	}

	this.getColor = function(x, y) {
		return this.bubbles_state[x][y];
	}
	this.setColor = function(color, x, y) {
		this.bubbles_state[x][y] = color;
	}

	this.update = function() {
		// update bubbles state
	}

	/* ** TEST! ** */
	this.displayGroupInfo = function(bubble, color) {
		var bubble = $('#'+bubble);
	}

	this.selectBubbleGroup = function(clicked_element) {
		// first deselect any group
		this.removeHiglight();

		// definitions
		this.clicked_position = {};
		this.clicked_group = {};

		// get clicked bubble's position
		this.clicked_position = this.getBubblePosition(clicked_element);

		// get color group array
		var color = this.getColor(this.clicked_position.x, this.clicked_position.y)
		var color_group = this.Bubble.getGroup(color);

		var finder = new findNeighbours(color_group);
		var neighbours_grouped = finder.labelFields();

		this.clicked_group = neighbours_grouped[this.clicked_position.x][this.clicked_position.y];
		this.clicked_group = this.getGroupElementsPositions(this.clicked_group, neighbours_grouped);
		this.clicked_group.Color = color;
		// if clicked group contains only one element it shouldn't be highlighted
		if (this.clicked_group.x.length < 2) {
			return;
		}

		this.addHighlight(this.clicked_group);
	}

	this.popBubbles = function() {
		var selectedBubbles = $('.highlighted');
		selectedBubbles.removeClass('highlighted');

		for (var i = 0; i < this.clicked_group.x.length; i++) {
			this.Bubble.updateGroups('empty', this.clicked_group.x[i], this.clicked_group.y[i]);
			$(selectedBubbles[i]).remove();
		};

		var last_score = this.Bubble.addScore(i);
		var total = this.Bubble.getScore();

		this.pullDown();
		this.pullRight();

		// check if game is over
		if (!this.checkCombinations()) {
			this.GameSettings.Stop();
			this.GameSettings.saveScore(total);
			this.GameSettings.showMessage('Game over. \n Your score: \n', 'score', total);
		}
	}

	this.pullDown = function() {
		var empty_fields = this.Bubble.getGroup('empty');

		for (var i = 0; i < empty_fields.length; i++) {
			for (var j = empty_fields[i].length - 1; j >= 0; j--) {
				if (empty_fields[i][j]) {
					var empty_num = this.getEmptyNumber(empty_fields[i], j);
					if (j-empty_num < 0) {
						// samo se vrhnja prazna
						this.setColor('empty', i, j);
						this.Bubble.updateGroups('empty', i, j);
					} else {
						this.setFieldPosition(i, j, 'down', empty_num);
						var color = this.getColor(i, (j-empty_num));
						this.setColor(color, i, j);
						this.Bubble.updateGroups('empty', i, (j-empty_num));
						this.Bubble.updateGroups(color, i, j);						
					}
				}
			};
		};
	}

	this.getEmptyNumber = function(column, start) {
		var count = 0;
		for (var i = start; i >= 0; i--) {
			if (column[i]) {
				count = count+1;
			} else {
				return count;
			}
		};
		return count;
	}

	this.pullRight = function() {
		var empty_fields = this.Bubble.getGroup('empty');

		for (var i = empty_fields.length - 1; i >= 0; i--) {
			if (empty_fields[i][empty_fields[i].length-1]) {
				var empty_num = this.getEmptyNumber(getRow(empty_fields, empty_fields[i].length - 1),i);
				
				for (var j = empty_fields[i].length - 1; j >= 0; j--) {
				
					if (i != 0 && (i-empty_num) != -1 ) {
						this.setFieldPosition(i, j, 'right', empty_num);
						var color = this.getColor(i-empty_num, j);
						this.setColor(color, i, j);
						this.Bubble.updateGroups('empty', i-empty_num, j);
						this.Bubble.updateGroups(color, i, j);
				
					} else {
						this.setColor('empty', i, j);
						this.Bubble.updateGroups('empty', i, j);
					};
				};
			}
		};
	}

	this.hideBubble = function(element) {
		//element.
	}

	this.getBubblePosition = function(clicked_element) {
		var clicked_position = {};

		clicked_position.x = clicked_element.parent().attr('data-x-position');
		clicked_position.y = clicked_element.parent().attr('data-y-position');

		return clicked_position;		
	}

	/**
	 * Returns array with positions of all bubbles that belong to the same group as input bubble
	 *
	 * @param clicked_group: n*m array of labeled groups
	 * @param clicked_bubble: object with x and y positions of clicked element
	 *
	 * @return x*2 array of positions where x is number of elements in a group   
	 **/
	this.getGroupElementsPositions = function(label, labels_field) {
		var single_group = {};
		single_group.x = [];
		single_group.y = [];

		var k = 0;
		for (var i = 0; i < labels_field.length; i++) {
			for (var j = 0; j < labels_field[0].length; j++) {
				if (labels_field[i][j] == label) {
					single_group.x[k] = i;
					single_group.y[k] = j;
					k = k+1;
				}
			};
		};

		return single_group;
	}

	/**
	 * Adds class ".highlighted" to elements that belong to selected group
	 *
	 * @param positions: object with properties x, y (both 1*n arrays)
	 * @return void
	 **/
	this.addHighlight = function(positions) {
		for (var i = 0; i < positions.x.length; i++) {
			$('.bubble-field[data-x-position="' + positions.x[i] + '"][data-y-position="' + positions.y[i] + '"]').addClass('highlighted');
		};
	}

	/**
	 * Removes class ".highlighted" from all elements
	 *
	 * @param void
	 * @return void
	 **/
	this.removeHiglight = function() {
		$('.bubble-field').removeClass('highlighted');
	}

	/**
	 * Checks if there are any possible combinations left
	 * if there are no two consecutive fields with same color (viewed by columns and then by row),
	 * then there are no combinations left
	 *
	 * @param void
	 * @return T/F
	 **/
	this.checkCombinations = function() {
		var previous_state = 'none';

		// check by columns
		for (var i = this.bubbles_state.length - 1; i >= 0; i--) {
			for (var j = this.bubbles_state[i].length - 1; j >= 0; j--) {
				if (this.bubbles_state[i][j] != 'empty' && this.bubbles_state[i][j] == previous_state) {
					return true;
				} else {
					previous_state = this.bubbles_state[i][j];
				}
			};
			previous_state = 'none';
		};

		previous_state = 'none';
		// check by rows
		for (var i = this.bubbles_state[0].length - 1; i >= 0; i--) {
			for (var j = this.bubbles_state.length - 1; j >= 0; j--) {
				if (this.bubbles_state[j][i] != 'empty' && this.bubbles_state[j][i] == previous_state) {
					return true;
				} else {
					previous_state = this.bubbles_state[j][i];
				}
			};
			previous_state = 'none';
		};

		return false;
	}
}

function BubblesController(Bubble, BubbleContainer, GameSettings) {

	var game = GameSettings;
	var bubble = Bubble;
	var bubblyContainer = BubbleContainer;

	game.init();
	bubblyContainer.initField();
	// bubblyContainer.initField();
	$( "#dataTable tbody" ).on( "click", "tr", function() {
alert( $( this ).text() );
});

	$('div.bubble-field-border').on('click', 'div.bubble-field', function() {
		clicked_bubble = $(this);

		// enable click only if game is running
		if (game.getState()) { 
			// pop the group if bubble is in highligted group
			if (clicked_bubble.hasClass('highlighted')) {
				// pop
				bubblyContainer.popBubbles();
			} else {
				// select the bubble's group
				bubblyContainer.selectBubbleGroup(clicked_bubble.children());
			}
		}
	});

	$('#new-game-button').click(function() {
		bubblyContainer.initField();
		bubble.resetScore();
		game.hideMenu();
		game.Start();
	});

	$('#top-results-button').click(function() {
		game.hideMenu();
		game.showMessage('Your past results:', 'score_list', game.getScoreList());
	});	

	$('#okay-button').click(function() {
		game.hideMessage();
		game.showMenu();
	});

} 

