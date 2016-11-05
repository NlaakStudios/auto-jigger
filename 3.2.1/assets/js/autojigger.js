// ==ClosureCompiler==
// @autojigger.min.js
// @compilation_level ADVANCED_OPTIMIZATIONS
// ==/ClosureCompiler==

/*!
 *  i2tm Labs Auto Jigger @andrewdonelson - //autojigger.i2tmlabs.com - @i2tmlabs
 *  License - Private - autojigger.i2tmlabs.com/license
 */
/*! Auto Jigger Core Javascript */
AJ$ = (function () {
	
	/**
	 * Shorthand version of window
	 *
	 * @export
	 * @property W$
	 * @type {window}
	 * @memberof window
	 */			
	window['W$']=window;

	/**
	 * Shorthand access to window.document
	 *
	 * @export
	 * @property D$
	 * @type {document}
	 * @memberof window
	 */			
	W$['D$']=W$.document;

	/**
	 * Shorthand access to window.document.head[]
	 *
	 * @export
	 * @property H$
	 * @type {DOMElement}
	 * @memberof window
	 */			
	W$['H$']=D$.getElementsByTagName("head")[0];

	/**
	 * Shorthand access to window.document.tail[]
	 *
	 * @export
	 * @property T$
	 * @type {DOMElement}
	 * @memberof window
	 */			
	W$['T$']=D$.getElementById("tail");

	/**
	 * Shorthand access to window.document.body[]
	 *
	 * @export
	 * @property B$
	 * @type {DOMElement}
	 * @memberof window
	 */			
	W$['B$']=D$.getElementsByTagName("body")[0];

	/**
	 * Shorthand access to window.document.stylesheets
	 *
	 * @export
	 * @property C$
	 * @type {DOMEElement}
	 * @memberof window
	 */			
	W$['C$']=D$.styleSheets;

	/**
	 * Shorthand access to window.document.scripts
	 *
	 * @export
	 * @property S$
	 * @type {DOMElement}
	 * @memberof window
	 */			
	W$['S$']=D$.scripts;
	
	var AutoJigger = {
		/**[Public]**/
		VERSION 		: '3.2.1',		//Current Library Version
		/**[TODO: Private]**/
		_ONREADY		: undefined,
		LOADING 		: 0,			//Number of files currenty loading
		LOADED 			: 0,			//Number of file that have been loaded
		FILES 			: [],			//Array of processed files		
		FRAMEWORK		: '',			//Name of Native Framework.
		READY			: false,		//Set TRUE when all files loaded & processed.
		SHOWLOADER		: false,		//Used to override showing the Logo/Brand Loader
		ANGULAR_LOADED	: false,		//Will be true is the Angular 2 Framework was loaded.
		BACKBONE_LOADED	: false,		//Will be set to true is the Backbone Framework is loaded.
		REACT_LOADED	: false,		//Will be set to true is React Framework is loaded.
				
		/**
		 * Utility function for loading JavaScript or Stylesheets.
		 * No other file formats are supported.
		 *
		 * @method lds
		 * @param {string} $filetype 	either script or link
		 * @param {string} $id 			element ID of this file
		 * @param {string} $url 		full path to file, local or remote
		 * @param {boolean} $tail		set to true if you want script loaded into tail.
		 * @param {string} $after 		make sure loaded file is after this given file
		 * @param {Function} $onLoad 	optional
		 * @param {Function} $onError 	optional
		 * @memberof AutoJigger
		 * @export
		 */
		lds : function ($filetype, $id, $url, $tail, $after, $onLoad, $onError) {
			
			function _onLoaded() {
				console.log('File ' + AJ$.gfn($url) + ' load successful.');			
			}

			function _onErrored() {
				console.log('File load failed.');
			}
			
			function insert() {
				//tail or head?
				var c = ($tail===true)?T$:H$;
				
				if (typeof $after!='string') $after='last';
				
				if ($after=='first'){
					//=-=|Insert before all other scripts|=-=//
					c.firstElementChild(a);
					return true;
				} else if ($after=='last'){
					//=-=|Insert before all other scripts|=-=//
					c.appendChild(a);
					return true;
				} else {
					//=-=|find $after and insert after|=-=//
					c=gei($after);
					if (typeof c !='undefined' && c !=null){
						if (c.nextElementSibling!=null) {
							c.nextElementSibling.insertBefore(a);
							return true;
						}
					}
				}
				return false;
			}
		
			var a,b,c,d;
					
			//=-=|Prepare required parameters|=-=//
			for (var i = 0;i<3;i++) {
				arguments[i]=chk(arguments[i],false);
				if (arguments[i]===false) {
					if (console) console.log('Error')
				}
			}

			if (arguments[0] == 'script'||arguments[0] == 'js') {
				/**[Standard JavaScript File]**/
				a = D$.createElement('script');
				a.async = 0;
				a.src = $url; 
				a.type = 'application/javascript';
			} else if (arguments[0] == 'script'||arguments[0] == 'jsx') {
				/**[ReactJS JSX JavaScript File]**/
				a = D$.createElement('script');
				a.async = 0;
				a.src = $url; 
				a.type = 'text/jsx';
			} else if (arguments[0] == 'link'||arguments[0] == 'css') {
				/**[Standard Cascading Stylesheet File]**/
				a= D$.createElement('link');
				a.href = $url;
				a.rel = 'stylesheet';
				a.type = 'text/css';
			} else if (arguments[0] == 'html') {
				/**[HTML5 Content File - No <HTML>,<HEAD>,<BODY> .. Just content]**/
				//Define path to html to include
				d=location.pathname + 'html/' + gfn($url) + '.inc' + gex($url);
				return true;
			} else {
				return false
			}
			
			a.id=arguments[1];
			a.onload = ($onLoad) ? $onLoad : _onLoaded.bind(this);
			a.onerror = ($onError)? $onError : _onErrored.bind(this);
			
			return insert();
		},

		/**
		 * called to load a list of files.
		 *
		 * @method las
		 * @param {Array} filelist	all scripts to be loaded.
		 * @memberof AutoJigger
		 * @export
		 */			
		las : function(filelist) {
			
			if (T$ && T$.tagName == "DIV"){
				if (filelist && filelist.constructor.name === "Array"){
					var fn,tail,idx;
					AJ$.LOADING=filelist.length;
					AJ$.LOADED=0;

					cls(B$,'add','vanish','');						
					
					//Show Loading Logo/Brand Animation
					if (AJ$['SHOWLOADER'] == true) {
						cls('logo','add','appear');
					}
					
					do{
						fn=filelist.shift();
						idx = AJ$['FILES'].indexOf(fn);
						if (idx === -1) {
							lds(
								gex(fn),
								gfn(fn), 
								fn, 
								((gex(fn)=='js'||gex(fn)=='jsx')?true:false),
								'last',
								AJ$.onFileLoaded(gfn(fn).toLowerCase()),
								null
							);
							AJ$['FILES'].push(fn);
						}
					}while(filelist.length>0);					
					AJ$.LOADING=filelist.length;
				}
			}
		},

		/**
		 * Check if a value is valid (not null, undefined or empty)
		 *
		 * @example
		 * 		if !(vld(foo)) { someFunction(); }
		 *
		 * @method vld
		 * @param {*}	a 	A value
		 * @returns {boolean} true if the value is not undefined and not null
		 * @memberof AutoJigger
		 * @export
		 */
		vld : function(a){return!(null===a||"undefined"===typeof a||!1===a||""===a)},
		
		/**
		 *  Checks if a param is valid (null or undefined) in which case the default value will be returned
		 *
		 * @example
		 * 		if (foo=chk(foo,"bar")) { someFunction(); }
		 *
		 * @method chk
		 * @param 	{*} 	$p			Parameter to check
		 * @param 	{*} 	$def		Default value to return if p is either null or undefined
		 * @returns {*} 	if valid, otherwise def (default)
		 * @memberof AutoJigger
		 * @todo Remove function
		 * @export
		 */
		chk : function($p,$def){return (!this['vld']($p))?$def:$p},

		/**
		 * Alias for window.document.getElementById
		 *
		 * @example
		 * 		var element = gei("myDIV");
		 *
		 * @method gei
		 * @param {string} $p
		 * @returns element
		 * @memberof AutoJigger
		 * @export
		 */
		gei : function ($p) {
			return D$.getElementById($p)
		},

		/**
		 * Set, add, remove or replace an elements classes. the second class $c2
		 * is only needed when using the replace action.
		 *
		 * @method cls
		 * @param {string} $el  	element id
		 * @param {string} $action	action [set|clear|add|remove|replace|toggle]
		 * @param {string} $c1		name of class to work with
		 * @param {string} $c2 		name of class used in replace of $c1
		 * @memberof AutoJigger
		 * @export
		 */
		cls : function($el,$action,$c1,$c2) {
			try {
				$el=(typeof $el != 'string')
				?
				$el
				:
				this.gei($el);
				
				if (!$el) return;
				switch ($action.toLowerCase()) {
					case 'set': 
						$el.className=$c1;
						break;
						
					case 'clear': 
						$el.className='';
						break;
						
					case 'add': 
						$el.classList.add($c1);
						break;
						
					case 'remove':
						try{$el.classList.remove($c1)}catch(e){};
						break;
						
					case 'replace': 
						try{$el.classList.remove($c1)}catch(e){};
						try{$el.classList.add($c2)}catch(e){};
						break;
						
					case 'toggle':
						$el.classList.toggle($c1);
						break;
				}
			} catch(e) {
				alert(e)
			}
			
		},

		/**
		 * Returns file extension from a url string
		 *
		 * @method gex
		 * @param {String}	a	
		 * @return (String|null) extension
		 * @memberof AutoJigger
		 * @export 
		 */
		gex : function(a){
			if (typeof a==='undefined'||a=='') return ''; else return /(?:\.([^.]+))?$/.exec(a)[1].toLowerCase()
		},

		/**
		 * Returns file name from a url string
		 *
		 * @method gfn
		 * @param {String}	a	
		 * @return (String|null) filename
		 * @memberof AutoJigger
		 * @export 
		 */
		gfn : function(a){
			if (typeof a==='string')return a.substring(a.lastIndexOf("/")+1)
		},

		/**[Events - internal]**/
		onFileLoaded : function(e) {
			AJ$.LOADED++;
			if (AJ$.LOADED === AJ$.LOADING) {
				AJ$.LOADING = 0;
				
				if (!AJ$['READY']) {
					if (!AJ$['READY'] && AJ$.vld(AJ$.FRAMEWORK)) {
						if (AJ$.FRAMEWORK=='angularjs'&&!AJ$.ANGULAR_LOADED) {
							W$['las']([
								'https://cdnjs.cloudflare.com/ajax/libs/systemjs/0.19.40/system.js',
								'https://cdnjs.cloudflare.com/ajax/libs/angular.js/2.0.0-beta.17/angular2.min.js',
								'assets/angularjs/js/systemjs.config.js'
							]);
							AJ$['READY'] = AJ$.ANGULAR_LOADED = true;
						} else if (AJ$.FRAMEWORK=='backbonejs'&&!AJ$.BACKBONE_LOADED) {
							W$['las']([
								'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js',
								'https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone-min.js'
							]);
							AJ$['READY'] = AJ$.BACKBONE_LOADED = true;
						} else if (AJ$.FRAMEWORK=='reactjs'&&!AJ$.REACT_LOADED) {
							W$['las']([
								'https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react.js',
								'https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react-dom.js'
							]);
							AJ$['READY'] = AJ$.REACT_LOADED = true;
						}
					} else {
						//window['AutoJiggerReady']();
						if(typeof(AJ$['_ONREADY']==="function")) 
							AJ$['_ONREADY']();
							
						AJ$['READY']=true;							
					}
				} else {
					AJ$['READY']=true;
				}
			}
			
			if (AJ$['READY']) {
				//Show Loading Logo/Brand Animation
				if (AJ$['SHOWLOADER'] == true) {
					AJ$['cls']('logo','replace','appear','vanish');
				}
				
				AJ$['cls'](B$,'replace','vanish','appear');
			}
		}
	}
	
	/**[Exports - Not the Object itself or the private functions, just the public functions]**/
	W$['vld'] = AutoJigger.vld;	
	W$['chk'] = AutoJigger.chk;	
	W$['gei'] = AutoJigger.gei;	
	W$['cls'] = AutoJigger.cls;	
	W$['gex'] = AutoJigger.gex;
	W$['gfn'] = AutoJigger.gfn;	
	W$['lds'] = AutoJigger.lds;	
	W$['las'] = AutoJigger.las;	
	
	/**[If a custom config is detect, load and use it]**/
	if (typeof(window['AutoJiggerConfig']) == "function") {
		var cfg = window['AutoJiggerConfig']();
		if (W$['vld'](cfg)){
			if (W$['vld'](cfg.showloader)) AutoJigger['SHOWLOADER']=cfg.showloader;
			if (W$['vld'](cfg.framework)) AutoJigger['FRAMEWORK']=cfg.framework.toLowerCase();
			if (W$['vld'](cfg.onready)&&typeof(cfg.onready)==="function")
				AutoJigger['_ONREADY']=cfg.onready;
			else
				AutoJigger['_ONREADY']=function(){};			
		}
	}

	/**[Display the loader if it is enabled]**/
	if (AutoJigger['SHOWLOADER']){
		AutoJigger['cls']('logo','replace','vanish','appear');
	} else {
		AutoJigger['cls']('logo','replace','appear','vanish');
	}
	
	/**[temp fix until I rewrite the closure]**/
	AutoJigger['FILES'] = [];
	AutoJigger['READY'] = false;
	AutoJigger['SHOWLOADER'] = false;
				
	/**[Load core framework/libraries - jQuery,Modernizr,Bootstrap and Font-Awesome]**/
	W$['lds'](
		'js', 
		'jquery', 
		'https://code.jquery.com/jquery-2.2.4.min.js', 
		true, 
		'last', 
		function(){
			W$['las']([
				'https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js',
				'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
				'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
				'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'
			])
		}, 
		null
	);		

	/**[All Done! Return Object]**/
	return AutoJigger;
})();
