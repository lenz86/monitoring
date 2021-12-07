var type_save = 'cookie';
function get_cookie ( cookie_name )
{
	if(type_save=='cookie'){
	  var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
	  if ( results )
		return ( unescape ( results[2] ) );
	  else
		return null;
	}
	else{
		if(window.localStorage[cookie_name]&&window.localStorage[cookie_name]!=undefined)
		{
			return window.localStorage[cookie_name]
		}
		else{
		return null;	
		}
	}
}
function set_cookie ( name, value, exp_y, exp_m, exp_d, path, domain, secure )
{
	if(type_save=='cookie'){
  var cookie_string = name + "=" + escape ( value );
  if ( exp_y )
  {
    var expires = new Date ( exp_y, exp_m, exp_d );
    cookie_string += "; expires=" + expires.toGMTString();
  }
 
  if ( path )
        cookie_string += "; path=" + escape ( path );
 
  if ( domain )
        cookie_string += "; domain=" + escape ( domain );
  
  if ( secure )
        cookie_string += "; secure";
  
  document.cookie = cookie_string;
	}
	else{
		 window.localStorage[name] = value;
	}
}
function delete_cookie ( cookie_name )
{
	if(type_save=='cookie'){
  var cookie_date = new Date ( );  // Текущая дата и время
  cookie_date.setTime ( cookie_date.getTime() - 1 );
  document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString();
	}
	else{
		delete window.localStorage[cookie_name];
	}
}

function reload()
{
  var cookie_string = "test=" + escape ('1');  
  document.cookie = cookie_string;
  if(get_cookie('test')=='1')
  {
	  type_save = 'cookie';
	  delete_cookie ('type_save');
  }
  else
  {
	  type_save = 'nocookie';
  }
}
reload();