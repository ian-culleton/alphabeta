var alphabetaConstructor = require("../alphabeta.js")

module.exports = {

	'complete chomp' : function(beforeExit, assert) {

		var alphabeta = createChompExample(10);

		var n = 0;
		alphabeta.allSteps( function( bestMove ) {
			n++;
			assert.equal( 2, bestMove.chompedLength )
			assert.equal( 8 , bestMove.linelength )
			assert.equal( 'second' , bestMove.player )

			var predicted = alphabeta.prediction().state

			assert.equal( 3 , predicted.chompedLength )
			assert.equal( 0 , predicted.linelength )
			assert.equal( 'second' , predicted.player )
		})

	    beforeExit(function() {
	        assert.equal(1, n, 'Ensure timeout is called');
	    });
	},


	'complete chomp in 0.5 seconds' : function(beforeExit, assert) {

		var alphabeta = createChompExample(10);

		var n = 0;
		alphabeta.stepForMilliseconds( 500, function( bestMove ) {
			n++;
			assert.equal( 2, bestMove.chompedLength )
			assert.equal( 8 , bestMove.linelength )
			assert.equal( 'second' , bestMove.player )

			var predicted = alphabeta.prediction().state

			assert.equal( 3 , predicted.chompedLength )
			assert.equal( 0 , predicted.linelength )
			assert.equal( 'second' , predicted.player )
		})

	    beforeExit(function() {
	        assert.equal(1, n, 'Ensure timeout is called');
	    });
	},

	'complete 6 levels of chomp in 0.5 seconds' : function(beforeExit, assert) {

		var alphabeta = createChompExample(1);

		var n = 0;
		alphabeta.incrementDepthForMilliseconds( 500, function( result ) {
			n++;

			assert.equal( true , result.depth >= 6 )

			var bestMove = result.alphabeta.best()

			assert.equal( 2, bestMove.chompedLength )
			assert.equal( 8 , bestMove.linelength )
			assert.equal( 'second' , bestMove.player )

			var predicted = result.alphabeta.prediction().state

			assert.equal( 3 , predicted.chompedLength )
			assert.equal( 0 , predicted.linelength )
			assert.equal( 'second' , predicted.player )
		})

	    beforeExit(function() {
	        assert.equal(1, n, 'Ensure timeout is called');
	    });
	},

	'complete some levels of chomp in 10 millisecond' : function(beforeExit, assert) {

		var alphabeta = createChompExample(2);

		var n = 0;
		alphabeta.incrementDepthForMilliseconds( 10, function( result ) {
			n++;

			assert.equal( true , 1 < result.depth )
			assert.equal( true , result.alphabeta != undefined )
			assert.equal( true , result.depth != undefined )
			assert.equal( true , false != result.alphabeta.best() )
			assert.equal( result.depth + 1 , result.incomplete.depth )
			assert.equal( true , result.incomplete.alphabeta != undefined )
			if ( result.depth < 4 && result.depth > 1 ) {
				assert.equal( false , result.incomplete.alphabeta.best() )
			}

		})

	    beforeExit(function() {
	        assert.equal(1, n, 'Ensure timeout is called');
	    });
	}


}


function createChompExample(depth) {

	function createInitialState( ) {
		var someState = { linelength : 10 , player : "first" , move : "started" };
		return someState;
	}

	function scoreFunction( state , callback ) {
		callback( 0 ); // ignore state
	}

	function generateMoves( state ) {
		var possibleStates = [  ];

		function createState( state , chompedLength ) {
			return {
				chompedLength : chompedLength,
				linelength : state.linelength - chompedLength , 
				player : ( state.player == "first" ? "second" : "first" )					
			}
		}

		for( var chomp = 1 ; chomp <= 3 ; chomp++ ) {
			if ( state.linelength >= chomp ) {
				possibleStates.push( createState( state , chomp ) );
			}
		}

		return possibleStates;
	}


	function checkWinConditions( state ) {
		return state.linelength == 0
	}

	var alphabeta = require("../alphabeta.js")({
		scoreFunction : scoreFunction,
		generateMoves : generateMoves,
		checkWinConditions : checkWinConditions
	})

	alphabeta.setup( { state : createInitialState() , depth : depth } )
	return alphabeta;
}