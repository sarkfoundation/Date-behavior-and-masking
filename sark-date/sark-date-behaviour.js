/**
 * #author  	: SARK PJ
 * #author url  : http://iamsark.com
 * #purpose 	: Date masking and behaviour
 * #version		: 1.0.0
 */
var sark = null;
$( document ).ready(function(){	    
	sark = new sark_date_masker();
	/* Register focus in for only date field */      
	$( document ).on( "focus keydown click focusout blur drop dragstart", "input[data-behaviour=date]",  function(e) {
		var target = $( this );
		if( !target.prop( "readonly" ) &&  !target.hasClass( "rsu-readonly-field" ) ){
			if( e.type == "focusin" ){
				sark.dateFocusIn( target, e );
			} else if( e.type == "keydown" ){
				sark.dateKeyPress( target, e );
			} else if( e.type == "click" ){
				sark.dateclick( target, e );
				e.preventDefault();
			} else if( e.type == "focusout" || e.type == "blur" ) {
				sark.focusOut( target, e );
			} else if( e.type == "drop" || e.type == "dragstart" ){
				return false;
			}
		}
	});		
});

var sark_date_masker = function(){	
	this.dateFocusIn = function( _target, e ){
		if( _target.val() == "" ){
			_target.val( "dd/mm/yyyy" );
			this.selectRange( _target, 0, 1 );
			return;
		} else{			
			if( _target[0].selectionStart == _target[0].selectionEnd ){
				this.selectRange( _target, _target[0].selectionStart, _target[0].selectionStart+1 );
			}
		}	
	};
	
	this.dateclick = function( _target, e ){
		this.selectRange( _target, _target[0].selectionStart, _target[0].selectionStart+1 );
		var me = this;
		setTimeout(function(){
			me.selectRange( _target, _target[0].selectionStart, _target[0].selectionStart+1 );
		});
	};	
	
	//integer replacer
	this.replaceStr = function( start, end, character, old ) {
	    return old.substr( 0, start ) + character + old.substr( end+character.length );
	};	
	
	//select text field rage
	this.selectRange = function( _target, _start, _end ){
		_end =  typeof _end == "undefined" ? _start: _end;
		_target[0].selectionStart = _start;
		_target[0].selectionEnd	  = _end;
	};
	
	//when date field blur to check basic date behaviour
	this.focusOut = function( _target, e ){		
		if( _target.val() == "dd/mm/yyyy" ){
			_target.val( "" );
		}
		if( _target.val() != "" ){			
			var frac = _target.val().split( "/" );
			frac = _target.val().split( "/" );		
			if( frac[2].indexOf( "y" ) != -1 ){			
				var dateNew =   frac[2] == "yyyy" ? new Date().getFullYear() : parseInt( frac[2] ).toString().length == 1  ? new Date().getFullYear().toString().slice( 0, 2 )+"0"+parseInt( frac[2] ) : parseInt( frac[2] ).toString().length == 2 ? new Date().getFullYear().toString().slice( 0, 2 )+parseInt( frac[2] ) : new Date().getFullYear().toString().slice( 0, 1 )+parseInt( frac[2] );
				_target.val( frac[0] + "/" + frac[1] + "/" + dateNew );
			}
			frac = _target.val().split( "/" );
			if( !isNaN( parseInt( frac[1] ) ) && frac[1].indexOf( "m" ) != -1 ){
				var dateNew = parseInt( frac[1] ).toString().length == 1 ? "0"+parseInt( frac[1] ) : frac[1];
				var dateNew = parseInt( frac[1] ).toString().length == 1 ? frac[1][0] == "0" ? ( new Date().getMonth()+1 ).toString().length == 2 ? parseInt( new Date().getMonth() )+1 : "0"+ ( new Date().getMonth()+1 ) : "0"+parseInt( frac[1] ) : frac[1];
				_target.val( frac[0] + "/" + dateNew + "/" + frac[2] );
			}
			frac = _target.val().split( "/" );
			if( !isNaN( parseInt( frac[0] ) ) && frac[0].indexOf( "d" ) != -1 ){
				var dateNew = parseInt( frac[0] ).toString().length == 1 ? frac[0][0] == "0" ? new Date().getDate().toString().length == 2 ? new Date().getDate() : "0"+ ( new Date().getDate() ) : "0"+parseInt( frac[0] ) : frac[0];
				_target.val( dateNew + "/" + frac[1] + "/" + frac[2] );
			}
			frac = _target.val().split( "/" );
			var year  = parseInt( frac[2] );
			var month = parseInt( frac[1] );
			var date  = parseInt( frac[0] );
			if( frac[0] == "dd" || frac[1] == "mm" || date > new Date( year, month, 1, -1).getDate() || frac[0] > 31 || frac[1] > 12 || ( frac[2] < 1600 ) || ( frac[2] > 3999 ) ){
				alert( "Invalid Date..." );
			} 
		}
	};



	this.dateKeyPress = function( _target, e ){
		if( e.keyCode != 9 && e.keyCode != 13 ){
			e.preventDefault();
		}
		var keyCode = e.keyCode;
		var flg = false;
		var editFlg = true;
		var inpVal = String.fromCharCode( ( 96 <= keyCode && keyCode <= 105 ) ? keyCode-48 : keyCode );
		var selStart = _target[0].selectionStart;
		var selEnd   = _target[0].selectionEnd;
		var cursval  = _target.val();
		var splitval = cursval.split( "/" );
		var cselStart, cselEnd;
		var isn = parseInt( _target.val()[ selStart-1 ] );
		
		if( selStart != 0 && isNaN( isn ) && !( keyCode == 37 || keyCode == 39 || keyCode == 8 || keyCode == 46 ) && !( selStart == 3 && selEnd == 4  ||  selStart == 6 && selEnd == 7  ) ){
			return;
		}		
		if( keyCode == 37 || keyCode == 39 ){
			cselStart = keyCode == 37 ? selStart-1 : selEnd;
			cselEnd	  = keyCode == 37 ? selStart : selEnd+1;
			this.selectRange( _target, cselStart, cselEnd );	
			return;
		} else if( !( ( keyCode < 48 || keyCode > 57 )  && ( keyCode < 96 || keyCode > 105 ) ) ){
			flg = true;		
			cursval = this.replaceStr( selStart, selStart, inpVal, cursval );
			cselStart = selStart == 1 || selStart == 4 ? selEnd+1 : ( selStart == 2 && selEnd == 3 ) || ( selStart == 5 && selEnd == 6 ) ? selStart : selEnd;
			cselEnd	  = selStart == 1 || selStart == 4 ? selEnd+2 : ( selStart == 2 && selEnd == 3 ) || ( selStart == 5 && selEnd == 6 ) ? selEnd :  selEnd+1;
			if( ( selStart == 0 && selEnd == 1 ) || ( selStart == 0 && selEnd == 0 ) ){				
				if( inpVal > 3 || ( inpVal == 3 && !isNaN( parseInt( cursval[1] ) ) && 2 < parseInt( cursval[1] ) ) ){
					cursval = this.replaceStr( 0, 0, "0"+inpVal, cursval );				
				}
			} else if( selStart == 3 && selEnd == 4 ){
				if( !isNaN( parseInt( splitval[0] ) ) && !isNaN( parseInt( splitval[2] ) ) ){
					if( parseInt( splitval[0] ) > new Date( parseInt( splitval[2] ), inpVal, 1, -1).getDate() ){
						this.selectRange( _target, selStart, selEnd );
						return;
					}
				} else if( !isNaN( parseInt( splitval[0] ) ) && isNaN( parseInt( splitval[2] ) ) ){
					var date = inpVal == 2 && parseInt( splitval[0] ) == 29 ? 28 : parseInt( splitval[0] ) ;
					if( inpVal != 1 && inpVal != 0 &&  date > new Date( new Date().getFullYear(), inpVal, 1, -1).getDate() ){
						this.selectRange( _target, selStart, selEnd );
						return;
					}
				}
				if( inpVal > 1 || ( inpVal == 1 && !isNaN( parseInt( cursval[4] ) ) && 1 < parseInt( cursval[4] ) ) ){
					cursval = this.replaceStr( 3, 3, "0"+inpVal, cursval );
				}							
			} else if( ( selStart == 10 && selEnd == 10 ) || ( selStart == 2 && selEnd == 3 ) || ( selStart == 5 && selEnd == 6 ) ){
				editFlg = false;			
			} else if( selStart == 1 && selEnd == 2 ){	
				if( !isNaN( parseInt( splitval[1] ) ) && !isNaN( parseInt( splitval[2] ) ) ){
					if( parseInt( cursval[0]+inpVal ) > new Date( parseInt( splitval[2] ),  parseInt( splitval[1] ), 1, -1).getDate() ){
						this.selectRange( _target, selStart, selEnd );
						return;
					}
				} 
				if( inpVal > 1 && cursval[0] == 3 ){
					return;
				} else if( inpVal == 0 && cursval[0] == 0 ){
					return;
				} 
			} else if( selStart == 4 && selEnd == 5 ) {
				if( !isNaN( parseInt( splitval[0] ) ) && !isNaN( parseInt( splitval[2] ) ) && cursval[3] == "0" ){
					if( parseInt( splitval[0] ) > new Date( parseInt( splitval[2] ), inpVal, 1, -1).getDate() ){
						this.selectRange( _target, selStart, selEnd );
						return;
					}
				} else if( !isNaN( parseInt( splitval[0] ) ) && isNaN( parseInt( splitval[2] ) ) ){
					var date = parseInt( cursval[3]+inpVal ) == 2 && parseInt( splitval[0] ) == 29 ? 28 : parseInt( splitval[0] ) ;
					if( date > new Date( new Date().getFullYear(), parseInt( cursval[3]+inpVal ), 1, -1).getDate() ){
						this.selectRange( _target, selStart, selEnd );
						return;
					}
				} 
				if( cursval[3] == "0" && inpVal == 0 ) {
					this.selectRange( _target, selStart, selEnd );
					return;
				} else if( inpVal > 2 && cursval[3] == 1 ) {
					return;
				} 					
			} else if( selStart == 6 && selEnd == 7 ) {				
				if( inpVal == 0 ){
					cursval = this.replaceStr( 6, 6, "20", cursval );
					cselStart = 8;
					cselEnd   = 9;
				} else if( inpVal >= 3 ) {
					cursval = this.replaceStr( 6, 6, "20"+inpVal, cursval );
					cselStart = 9;
					cselEnd   = 10;
				}
			} else if( selStart == 7 && selEnd == 8 ) {				
				if( inpVal != 9 && parseInt( _target.val()[6] ) == 1 ){
					cursval = this.replaceStr( 6, 6, "201"+inpVal, cursval );
					cselStart = 10;
					cselEnd   = 10;
				} else if( inpVal != 9 && inpVal != 0 ) {
					cursval = this.replaceStr( 7, 7, "0"+inpVal, cursval );
					cselStart = 9;
					cselEnd   = 10;
					
				}
			} else if( selStart == 0 && selEnd == 10 ) { 
				cursval = this.replaceStr( 0, 0, inpVal+"d/mm/yy", cursval );
			} else if( selStart == 9 && selEnd == 10 ) {				
				if( !isNaN( parseInt( splitval[0] ) ) && !isNaN( parseInt( splitval[1] ) ) ){
					if( parseInt( splitval[0] ) > new Date( parseInt( splitval[2] )+inpVal, parseInt( splitval[1] ), 1, -1).getDate() ){
						this.selectRange( _target, selStart, selEnd );
						return;
					}					
				}
			}
		} else if( keyCode == 8 || keyCode == 46  ){			
			flg = true;
			sel = 0;
			if( keyCode == 8 ){
				sel = selStart;
				sel = ( selStart == 2 && selEnd == 3 ) || ( selStart == 5 && selEnd == 6 ) || ( selStart == 10 && selEnd == 10 ) ? sel-1 : sel;
				cselStart = sel-1;
				cselEnd   = sel;
				if( cselStart == -1 ){
					cselStart = 0;
					cselEnd	  = 1;
				}				
				if( cselStart != 0 && isNaN( isn ) && !( selStart == 3 && selEnd == 4  ||  selStart == 6 && selEnd == 7  ) ){
					editFlg = false;
					var dv = cursval.split( "/" );
					cselStart = !isNaN( parseInt( dv[2] ) ) ? 6+parseInt( dv[2] ).toString().length : !isNaN( parseInt( dv[1] ) ) ? 3+parseInt( dv[1] ).toString().length : !isNaN( parseInt( dv[0] ) ) ? 0+parseInt( dv[0] ).toString().length : 0;
					cselEnd = !isNaN( parseInt( dv[2] ) ) ? 7+parseInt( dv[2] ).toString().length : !isNaN( parseInt( dv[1] ) ) ? 4+parseInt( dv[1] ).toString().length : !isNaN( parseInt( dv[0] ) ) ? 1+parseInt( dv[0] ).toString().length : 1;
				}
				if( selStart == 4 && selEnd == 5 ){
					_target.val( cursval.split( "/" )[0] + "/" + "mm" + "/" + cursval.split( "/" )[2]  );
					this.selectRange( _target, 3, 4 );
					return;
				} else if( selStart == 1 && selEnd == 2 ){
					_target.val( "dd" + "/" + cursval.split( "/" )[1] + "/" + cursval.split( "/" )[2]  );
					this.selectRange( _target, 0, 1 );
					return;
				} else if( ( selStart == 7 && selEnd == 8 ) || ( selStart == 8 && selEnd == 9 ) || ( selStart == 6 && selEnd == 7 ) ){
					editFlg = false;
					var yr = cursval.split( "/" )[2];
					var year = selStart == 7 && selEnd == 8 ? yr[1]+yr[2]+yr[3]+"y" : selStart == 8 && selEnd == 9 ? yr[0]+yr[3]+"yy" : selStart == 6 && selEnd == 7 ? yr[1]+yr[2]+yr[3]+"y" : yr[0]+yr[1]+yr[2]+yr[3];
					_target.val( cursval.split( "/" )[0] + "/" + cursval.split( "/" )[1] + "/" + year );
				} else if( selStart == 0 && selEnd == 1 ){
					var yr = cursval.split( "/" )[2];
					_target.val( cursval.split( "/" )[0][1]+"d" + "/" + cursval.split( "/" )[1] + "/" + cursval.split( "/" )[2] );
					this.selectRange( _target, 0, 1 );
					return;
				} else if( selStart == 3 && selEnd == 4 ){
					var yr = cursval.split( "/" )[2];
					_target.val( cursval.split( "/" )[0] + "/" + cursval.split( "/" )[1][1]+"m" + "/" + cursval.split( "/" )[2] );
					this.selectRange( _target, 2, 3 );
					return;
				}
			} else {
				sel = selStart;
				sel = ( selStart == 2 && selEnd == 3 ) || ( selStart == 5 && selEnd == 6 ) || ( selStart == 0 && selEnd == 0 ) ? sel+1 : sel;
				cselStart = sel+1;
				cselEnd   = sel+2;
				var isn = parseInt( _target.val().split( "/" )[2] );
				if( selStart == 10 && selEnd == 10 ){
					editFlg = false;
				} else if( ( selStart == 7 && selEnd == 8 ) || ( selStart == 6 && selEnd == 7 ) || ( selStart == 8 && selEnd == 9 ) ){
					var yr = cursval.split( "/" )[2];
					var year = selStart == 7 && selEnd == 8  ? yr[0]+yr[2]+yr[3]+"y" : selStart == 6 && selEnd == 7 ? yr[1]+yr[2]+yr[3]+"y" : selStart == 8 && selEnd == 9 ? yr[0]+yr[1]+yr[3]+"y" : yr[0]+yr[1]+yr[2]+yr[3];
					_target.val( cursval.split( "/" )[0] + "/" + cursval.split( "/" )[1] + "/" + year );
					editFlg = false;
				} else if( ( selStart == 0 && selEnd == 1 ) || ( selStart == 0 && selEnd == 0 ) ){
					if( typeof splitval[0][1] != 'undefined' ) {
						_target.val( splitval[0][1]+"d" + "/" + splitval[1] + "/" + splitval[2] );
					} else {
						_target.val( "dd" + "/" + splitval[1] + "/" + splitval[2] );
					}					
					this.selectRange( _target, 0, 1 );
					return;
				} else if( selStart == 3 && selEnd == 4 ){
					_target.val( splitval[0] + "/" + splitval[1][1]+"m" + "/" + splitval[2] );
					this.selectRange( _target, 3, 4 );
					return;
				} else if( ( selStart == 2 && selEnd == 3 ) || ( selStart == 5 && selEnd == 6 ) ){
					editFlg = false;
					e.preventDefault();
					cselStart = selStart;
					cselEnd   = selEnd;
				} else if( ( selStart == 1 && selEnd == 2 ) || ( selStart == 4 && selEnd == 5 ) ){
					cselStart = selStart;
					cselEnd   = selEnd;
				}
			}				
			var delinp = !( sel < 6 || sel > 10 ) ? "y" : !( sel < 3 || sel > 5 ) ? "m" : "d";	
			if( selStart == 0 && selEnd == 10  ){  
				delinp = "dd/mm/yyyy";
				cselStart = 0;
				cselEnd   = 1;
			} 
			cursval = this.replaceStr( sel, sel, delinp,  cursval );			
		}
		if( flg ){
			if( editFlg ){
				_target.val( cursval );
			}
			this.selectRange( _target, cselStart, cselEnd );			
			return;
		}		
	};
};