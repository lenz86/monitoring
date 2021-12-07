if(typeof stock_address_ws==='undefined')
{
    stock_address_ws = [];
}
'use strict';
var app = angular
        .module('vegaLora',['ngAutocomplete', 'ngSanitize', 'mgcrea.ngStrap','nya.bootstrap.select','isteven-multi-select','leaflet-directive'])
        .constant('ws',{address: address_ws,stock:stock_address_ws!==undefined&&stock_address_ws.length>0?stock_address_ws:[address_ws]});
app.directive('ngEnter',function(){
        return function(scope,element,attrs){
          element.bind('keydown keypress',function(event){
              if(event.which==13){
                  scope.$apply(function(){
                      scope.$eval(attrs.ngEnter,{'event':event});
                  });
                  event.preventDefault();
              }
          });  
        };
    });
app.controller('AppController',function($scope,ws,$interval,$timeout){  
	$scope.demo_user = demo_user!=undefined?demo_user:false;
        $scope.select_server = typeof select_server=='boolean'&&select_server?select_server:false;
     $scope.search_ws_address = function(){
         if(get_cookie('ws')!=undefined)
         {
             this.address = get_cookie('ws');
         }
         else
         {
             this.address = ws.address;
         }
         if(ws.address==this.address)
         {
             this.full_settings = false;
         }
         else
         {
             this.full_settings = true;
         }
     };
     $scope.toggleSettings = function()
     {
         if(this.full_settings)
         {
            this.full_settings =false;
         }
         else
         {
            this.full_settings=true;
         }
     };
     $scope.parse_vega=function(json)
     {
         try{
            json=JSON.parse(json);
            $scope.last_time = new Date().getTime();
            if(json.cmd=='auth_resp')
            {
                if(json.status)
                {
                    this.user.token = json.token;
                    this.user.command_list = json.command_list;
                    $scope.auth_control();
                }
                else
                {
                    if(json.err_string!=undefined)
                    {
                        alert(json.err_string);
                    }
                    else
                    {
                        alert('Error auth');
                    }
                }
            }
            else if(json.cmd=='ping_resp')
            {
                return;
            }
            else
            {
               console.log('Парсер не знает что делать с тем что пришло'); 
            }
         }
         catch(err)
         {
             console.log('Server прислал не json');
         }
     };
     $scope.reload_time=0;
     $scope.websocket={
        reload:function()
        {
            $scope.reload_time=2;
            if(this.connect!=undefined) {this.connect.close();}
            try{
                this.connect =new WebSocket($scope.address);
                this.connect.onopen=function(event){
                    console.log('Onopen');
                    $scope.reload_time=0;
                    this.status=true;
                };
                this.connect.onclose=function(event){
                    console.log('Onclose');
                    this.status=false;
                    $scope.reload_time=2; 
                };
                this.connect.onerror=function(err){
                    console.log('Onerror');
                     this.status=false;
                     $scope.reload_time=2;
                };
                this.connect.onmessage=function(event){
                    $scope.parse_vega(event.data);
                };
            }
            catch (err)
            {
                this.status=false;
                $scope.reload_time=2;
            }
        }
    };
     $scope.enter_input = function(){
       var valid = new valid_data();
       if(valid.valid(this.login)&&valid.valid(this.password))
       {
           this.auth();
       }
       else
       {
           
       }
     };
     $scope.demo=function()
     {
        this.login='demo';
        this.password='demo';
        this.auth();
     };
     $scope.ping=function()
    {   
        if(this.websocket!=undefined&&this.websocket.connect.status)
        {
            this.websocket.connect.send(JSON.stringify({
               cmd:'ping_req'
            }));
        }
    };
     $scope.auth=function()
     {
         var valid = new valid_data();
         if(valid.valid(this.login)&&valid.valid(this.password))
         {
             if(this.websocket!=undefined&&this.websocket.connect.status)
             {
                 
                 if($scope.send_block==0)
                 {
                    $scope.user.login=this.login;
                    $scope.user.password=this.password;
                   this.websocket.connect.send(JSON.stringify({
                       login:this.login,
                       password:this.password,
                       cmd:'auth_req'
                   }));
                   $scope.send_block=2;
                }
                else
                {
                    alert('Error time');
                }
             }
             else
             {
                 alert('Error connection');
             }
         }
         else
         {
             alert('Error input ');
         }
     };
     $scope.auth_control = function()
     {
        if(this.user.login!=undefined&&this.user.token)
        {
           var my_command_list = new command_list();
           my_command_list.set_command_list_array(this.user.command_list);
           if(my_command_list.get_gateways||my_command_list.get_devices||my_command_list.get_users)
           {
                set_cookie('login',this.user.login);
                set_cookie('token',this.user.token);
                set_cookie('command_list',JSON.stringify(this.user.command_list));
                set_cookie('ws_address',JSON.stringify(this.address));
                window.location='./index.html';
           }
           else
           {
               alert('Not enough access rights!');
           }
        }
        else
        {
            console.log('info 187');
        }
     };
     $scope.cheat_arr=ws.stock;
     $scope.index_cheat=0;
     $scope.cheat=function()
     {
         this.index_cheat++;
         if(this.index_cheat>=this.cheat_arr.length)
         {
             this.index_cheat=0;
         }
         this.address=this.cheat_arr[this.index_cheat];
         $scope.websocket.reload();
     };
     
     $scope.init = function()
     {
        this.send_block =0;
        this.user=new Object();
        this.ws = ws;
        this.search_ws_address();
        this.websocket.reload();
        $interval(function(){
           if($scope.send_block!=0)
           {
               $scope.send_block--;
           }
           
        },1000);
          $interval(function(){
            $scope.reload_time--;
                if(!$scope.websocket.connect.status)
                {
                    if($scope.reload_time!=0)
                    {
                        $scope.websocket.reload();
                    } 
                }
                else
                {
                    $scope.ping();
                    var currentTime = new Date().getTime();
                    var passedTime = $scope.last_time?(currentTime-$scope.last_time):0;
                    if(passedTime>30000)
                    {
                        $scope.websocket.connect.status = false;
                        $scope.reload_time=2;
                        console.log('connect.status = false');
                    }
                }
        },5000);
     };
    $scope.init();
    });
       

