/* ***** CONNECTED COMPONENTS ALGORITHM ***** */

/**
 * Class that finds groups of connected neighbours
 *
 * @param field: 2D array of boolean values
 * @param x_pos
 * @param y_pos
 * @return
 **/
function findNeighbours(field) {
	this.field = field;
	this.current_label = 1;

	this.labels = Create2DArray(10);

	for (var i = 0; i < this.field.length; i++) {
		for (var j = 0; j < this.field[i].length; j++) {
			this.labels[i][j] = 0;
		}
	}
	
	// METHODS

	// main method of findNeighbours
	this.labelFields = function() {
		for (var j = 0; j < this.field[0].length; j++) {
			for (var i = 0; i < this.field.length; i++) {
				if (this.field[i][j]) {
					this.labels[i][j] = this.current_label;
					this.lookLeft(i,j);
					this.lookUp(i,j);
				} else {
					this.current_label = this.current_label+1;
				}
			}
			// at the end of column we also need to increment current_label, or it will continue in next column
			this.current_label = this.current_label+1;
		}
		return this.labels;
	}

	this.lookUp = function(x, y) {

		if (!this.checkBoundary(y)) {
			return;
		}

		if (this.field[x][y] == this.field[x][y-1]) {
			this.labels[x][y] = this.labels[x][y-1];
			// this.lookLeft(x,y);
			this.furtherLeft(x,y);		
		}
	}

	this.lookLeft = function(x, y) {
		if (!this.checkBoundary(x)) {
			return;
		}

		if (this.field[x][y] == this.field[x-1][y]) {
			this.labels[x][y] = this.labels[x-1][y];
			// this.lookLeft(x-1,y);

			// if ((this.field[x][y] == this.field[x][y-1]) && this.checkBoundary(y)) {
			// 	this.labels[x][y-1] == this.labels[x][y];
			// }
		}
	}

	this.furtherLeft = function(x, y) {
		if (this.checkBoundary(x) && this.field[x][y] == this.field[x-1][y]) {
			this.labels[x-1][y] = this.labels[x][y];
			this.furtherUp(x-1,y);
			this.furtherLeft(x-1,y);
		}	
	}

	this.furtherUp = function(x, y) {
		if (this.checkBoundary(y) && this.field[x][y] == this.field[x][y-1]) {
			this.labels[x][y-1] = this.labels[x][y];
			this.furtherLeft(x,y-1);
			this.furtherUp(x,y-1);
		}	
	}

	this.checkBoundary = function(pos) {
		if (pos > 0) {
			return true;
		} else {
			return false;
		}
	}

}