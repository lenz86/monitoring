if (typeof map_tiles_leaflet==='undefined') {
    map_tiles_leaflet = {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        options: {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    }
}
'use strict';
var JSONstatus_list="[{\"id\":\"1\",\"name\":\"В эксплуатации\"},{\"id\":\"2\",\"name\":\"Не активен\"},{\"id\":\"3\",\"name\":\"На ремонте\"},{\"id\":\"4\",\"name\":\"Тестируется\"}]";
var JSONcolor_list="[{\"id\":\"1\",\"name\":\"indigo\",\"hex\":\"#8340f7\"},{\"id\":\"2\",\"name\":\"lightblue\",\"hex\":\"#0bbce2\"},{\"id\":\"3\",\"name\":\"vega-green\",\"hex\":\"#00d6c1\"},{\"id\":\"4\",\"name\":\"vega-blue\",\"hex\":\"#4b68f9\"},{\"id\":\"5\",\"name\":\"yellow\",\"hex\":\"#d8c100\"},{\"id\":\"6\",\"name\":\"violet\",\"hex\":\"#aa00ff\"},{\"id\":\"7\",\"name\":\"teal\",\"hex\":\"#00aba9\"},{\"id\":\"8\",\"name\":\"pink\",\"hex\":\"#f472d0\"},{\"id\":\"9\",\"name\":\"crimson\",\"hex\":\"#a20025\"},{\"id\":\"10\",\"name\":\"amber\",\"hex\":\"#f0a30a\"},{\"id\":\"11\",\"name\":\"lime\",\"hex\":\"#a4c400\"}]";
var JSONaddress_list="[{\"name\":\"Вега Абсолют\",\"address\":\"ул. Кирова, 113/1\"},{\"name\":\"ТРЦ 'Аура'\",\"address\":\"Военная ул., 5\"},{\"name\":\"Железнодорожный вокзал Новосибирска\",\"address\":\"Дмитрия Шамшурина, 43\"},{\"name\":\"Новосибирский метрополитен\",\"address\":\"Серебренниковская ул., 34\"},{\"name\":\"Мэрия Г. Новосибирска\",\"address\":\"Красный пр., 34\"},{\"name\":\"Прочиее\",\"address\":\"Прочие объекты\"}]";
var JSONtype_channel="[{\"id\":\"1\",\"name\":\"Электросчетчик\",\"unit\":\"кВт⋅ч\", \"icon\":\"1.png\",\"type\":\"1\" }, {\"id\":\"2\",\"name\":\"Счетчик горячей воды\",\"unit\":\"куб.м\",\"icon\":\"3.png\",\"type\":\"1\"},{\"id\":\"4\",\"name\":\"Счетчик холодной воды\",\"unit\":\"куб.м\",\"icon\":\"4.png\",\"type\":\"1\"},{\"id\":\"5\",\"name\":\"Cчетчик газа\",\"unit\":\"куб.м\",\"icon\":\"5.png\",\"type\":\"1\"},{\"id\":\"6\",\"name\":\"Охранный вход\",\"unit\":\"\",\"icon\":\"6.png\",\"type\":\"2\"}]";
var command_list_cookie = new Object();
try
{
    command_list_cookie=JSON.parse(get_cookie('command_list'));
}
catch (err)
{
    
}
if(get_cookie('token')==undefined||get_cookie('token')=='')
{
	window.location='./auth.html';
}
var app = angular
        .module('vegaLora',['ngAutocomplete', 'ngSanitize', 'mgcrea.ngStrap','nya.bootstrap.select','isteven-multi-select','leaflet-directive'])
        .config(function($logProvider){
          $logProvider.debugEnabled(false);
        })
        .constant('ws',{address: (get_cookie('ws_address')!=undefined&&get_cookie('ws_address')!='undefined')?get_cookie('ws_address').replace(/"/g,''):address_ws})
.factory('storage',function(){
    var storage = new Object();
    storage.devices = new Devices();
    storage.date_range = new date_range();//период времени
    storage.bases = new bases();
    storage.edit_device = new device();
    //console.log('!!!!!','edit_device init болванка');
    storage.selected_device = new device();
    storage.edit_base = new base();
    storage.temp_edit_device = "";
    //console.log('!!!!!','temp_edit_device init пустая строка');
    storage.temp_base = "";
    storage.users = new users();
    storage.edit_user = new user();
    storage.edit_user.selectedGroup = 'Custom';
    storage.select_pattern='Custom';
    storage.patterns_user = new patterns_user();
    storage.patterns_user.add_pattern({
    name:"user",
    device_access:"SELECTED",
    consoleEnable:false,
    rx_settings:{
     unsolicited:true,
     direction:'UPLINK',
     withMacCommands:false
    },
    command_list:['get_device_appdata','get_data','manage_device_appdata','delete_device_appdata']
    });
    storage.patterns_user.add_pattern({
     name:"admin",
     device_access:"SELECTED",
     consoleEnable:false,
     rx_settings:{
      unsolicited:true,
      direction:'ALL',
      withMacCommands:true
     },
     command_list:['get_users','manage_users','delete_users','get_device_appdata','get_data','send_data','manage_device_appdata','delete_device_appdata','get_gateways','manage_gateways','delete_gateways','get_devices','manage_devices','get_coverage_map','delete_devices','get_device_downlink_queue','server_info','tx']
    });
    storage.patterns_user.add_pattern({
     name:"root",
     device_access:"FULL",
     consoleEnable:true,
     rx_settings:{
      unsolicited:true,
      direction:'ALL',
      withMacCommands:true
     },
     command_list:['get_users','manage_users','delete_users','get_device_appdata','get_data','send_data','manage_device_appdata','delete_device_appdata','get_gateways','manage_gateways','delete_gateways','get_devices','manage_devices','get_coverage_map','delete_devices','get_device_downlink_queue','manage_device_downlink_queue','server_info','send_email','tx']
    });
    storage.patterns_user.add_pattern({
     name:"moderator",
     device_access:"SELECTED",
     consoleEnable:false,
     rx_settings:{
      unsolicited:true,
      direction:'UPLINK',
      withMacCommands:false
     },
     command_list:['get_users','get_device_appdata','get_data','manage_device_appdata','delete_device_appdata','get_gateways','get_devices','manage_devices','get_coverage_map','get_device_downlink_queue',]
    });
    storage.patterns_user.add_pattern({
     name:"guest user",
     device_access:"SELECTED",
     consoleEnable:false,
     rx_settings:{
      unsolicited:true,
      direction:'UPLINK',
      withMacCommands:false
     },
     command_list:['get_device_appdata','get_data']
    });
    storage.patterns_user.add_pattern({
        name:"guest admin",
        device_access:"SELECTED",
        consoleEnable:false,
        rx_settings:{
           unsolicited:true,
           direction:'UPLINK',
           withMacCommands:false
        },
        command_list:['get_users','get_gateways','get_devices','get_coverage_map','get_device_downlink_queue']
    });

    storage.patterns_user.add_pattern({
        name:"guest",
        device_access:"FULL",
        consoleEnable:false,
        rx_settings:{
            unsolicited:true,
            direction:'UPLINK',
            withMacCommands:false
        },
        command_list:['get_device_appdata','get_data','get_gateways','get_devices','get_coverage_map','get_device_downlink_queueget_device_downlink_queue']
    });
    storage.add_device_list = function (newDevice)
    {
        this.devices.devices_list.push(newDevice);
    };
    return storage;
})
.factory('WS', ['$timeout','ws','storage','$interval',function($timeout,ws,storage,$interval) {
        if(get_cookie('token')==undefined||get_cookie('token')=='')
        {
            window.location='./auth.html';
        }
    var send_vega = new Object();//объект вывода интерфейса для общения с WS
    send_vega.logs = new Logs();
    send_vega.count_tick = 0;
    var arr_delete_devices_last = [];
    var arr_delete_user_list = [];
    var arr_delete_base_last = [];
    $interval(function(){ 
        if(send_vega.server_info.time.utc)
        {
            send_vega.server_info.time.utc = send_vega.server_info.time.utc+1000;
        }
        if(send_vega.count_tick==15)
        {
            send_vega.ping();
            var currentTime = new Date().getTime();
            var passedTime = send_vega.last_time?(currentTime-send_vega.last_time):0;
            if(passedTime>300000)
            {
                send_vega.auth_status=false;
                send_vega.status=false;
                if(!send_vega.reload_status)
                {
                    $timeout(function(){ 
                        send_vega.reload_status=true; 
                        send_vega.reload();  
                    },10000);
                }
                console.log('WebSocket закрыт ping ');
            }
            send_vega.count_tick=0;
        }
        send_vega.count_tick++;
    },1000);
    send_vega.auth_status=false;
    send_vega.loader=false;//запускаем лоадер
    send_vega.loader_auth=false;
    send_vega.server_info = {
        time:{},
        device_count:{}
    };
    send_vega.get_userlist_req=function()
    {
        my_ws.send(JSON.stringify({
            cmd:'get_users_req'
        }));
        send_vega.loader=true;//запускаем лоадер
        
    };
    send_vega.queue_users=[];
    send_vega.update_userlist_req=function(users)
    {
        var req = {
            cmd:'manage_users_req',
            user_list:[]
            };
        if(users!=undefined&&users.length>0)
        {
            for(var i = 0 ; i < users.length; i++)
            {
                if(users[i]&&users[i].login!==undefined&&typeof users[i].login == 'string') users[i].login = users[i].login.toLocaleLowerCase();
                req.user_list.push(users[i])
            }
            my_ws.send(JSON.stringify(req));
            send_vega.loader=true;//запускаем лоадер
            send_vega.queue_users=users;
        }
        else
        {
            console.log('No manage_users_req user_list is empty');
        }    
    }
    send_vega.ping=function()
    {     //ОТПРАВКА запроса ping
        var tempObj=new Object();
        tempObj.cmd='ping_req';
        my_ws.send(JSON.stringify(tempObj)); //отправка запроса на получения списка устройств с атрибутами
    };
    send_vega.manage_device_appdata_req = function(data)
    {
        var tempObj=new Object();
        tempObj.cmd='manage_device_appdata_req';
        tempObj.data_list = data;
        my_ws.send(JSON.stringify(tempObj)); //отправка запроса на получения списка устройств с атрибутами
    }
    send_vega.server_info_req = function()
    {
		var scope = angular.element($("body")).scope();
        if(scope.command_list_cookie.server_info)
        {
            my_ws.send(JSON.stringify({cmd:'server_info_req'}));
        }
    }
    send_vega.get_device_appdata_req=function()
    {   
        var tempObj=new Object();
        tempObj.cmd='get_device_appdata_req';
        tempObj.keyword=['add_data_info'];
        my_ws.send(JSON.stringify(tempObj)); //отправка запроса на получения списка устройств с атрибутами
        send_vega.loader=true;//запускаем лоадер
    };
    send_vega.send_get_base=function()
    { 
        if(angular.element($("body")).scope().command_list_cookie.get_gateways)
        {
            var tempObj=new Object();
            tempObj.cmd='get_gateways_req';
            my_ws.send(JSON.stringify(tempObj)); //отправка запроса на получения списка устройств с атрибутами
            send_vega.loader=true;//запускаем лоадер
        }
    };
    
    send_vega.delete_userlist_req = function(arr_login)
    {
        
        var valid = new valid_data();
        var resp = {
                    cmd:"delete_users_req",
                    user_list:[]
                };
        for(var i = 0; i<arr_login.length; i++)
        {
            if(valid.valid(arr_login[i]))
            {
                resp.user_list.push(arr_login[i]);
            }
        }
        
         arr_delete_user_list=resp.user_list;
        my_ws.send(JSON.stringify(resp)); //отправка запроса на получения списка устройств с атрибутами
        send_vega.loader=true;//запускаем лоадер
        
        
    };
    send_vega.send_delete_devlist_req = function(arr_devEui)
    {
        
        var valid = new valid_data();
        var resp = {
                    cmd:"delete_devices_req",
                    devices_list:[]
                };
        for(var i = 0; i<arr_devEui.length; i++)
        {
            if(valid.devEui(arr_devEui[i]))
            {
                resp.devices_list.push(arr_devEui[i]);
            }
        }
        
         arr_delete_devices_last=resp.devices_list;
        my_ws.send(JSON.stringify(resp)); //отправка запроса на получения списка устройств с атрибутами
        send_vega.loader=true;//запускаем лоадер
        
        
    };
    send_vega.send_delete_base_req = function(macs)
    {
        var resp = {
                    cmd:"delete_gateways_req",
                    gateway_list:[]
                };
        for(var i = 0; i<macs.length; i++)
        {
            resp.gateway_list.push(macs[i]);
        }
        arr_delete_base_last=resp.gateway_list;
        my_ws.send(JSON.stringify(resp)); //отправка запроса на получения списка устройств с атрибутами
        send_vega.loader=true;//запускаем лоадер
    };
    send_vega.send_json = function(json)
    {
        try
        {
            my_ws.send(json); 
            send_vega.loader=true;//запускаем лоадер
        }
        catch (err)
        {
            console.log('Ошибка отправки json на ws');
        }
    }
    send_vega.send_get_device_data_req=function(devEui,select)
    {
       if(devEui!=undefined)
        {
           var tempObj = new Object();
           tempObj.cmd = "get_data_req";
           tempObj.devEui = devEui;
           storage.devices.devices_list[devEui.toLowerCase()].last_req_data={};
           if(select!=undefined) //в случае если имеются дополднительные параметры для запроса
           {
               tempObj.select = select;
           }
           my_ws.send(JSON.stringify(tempObj));
           send_vega.loader=true;
        }
        else
        {
            console.log('NO !! send_get_data_req');
        }
        
    }
    send_vega.send_get_devlist_reginfo_req=function()
    {   
        var tempObj=new Object();
        tempObj.cmd='get_devices_req';
        my_ws.send(JSON.stringify(tempObj)); //отправка запроса на получения списка устройств с атрибутами
        send_vega.loader=true;//запускаем лоадер
    };
    send_vega.token_auth_req = function()
    {
        my_ws.send(JSON.stringify({
            cmd:'token_auth_req',
            token:get_cookie('token')
        }));
    };
    var parse_vega_api = function(json)
    {
        var valid = new valid_data();
        var scope = angular.element($("body")).scope();
        try
        {
            var json = JSON.parse(json);
            send_vega.logs.add(json);
            if(scope.autoScrollConsole)
            {
                downScroll('.cell-console .body-cell-content','.table-container');
            }
            if(json.devEui!=undefined&&json.devEui)
            {
                json.devEui=json.devEui.toLowerCase();
            }
            if(json.cmd=='get_device_appdata_resp')
            {
                if(json.status) 
                {
                    if(json.devices_list&&json.devices_list!=undefined) 
                    {
                        for(var i=0; i<json.devices_list.length;i++)
                        {    
                            var dev = json.devices_list[i];
                            var devEui = dev.devEui.toLowerCase();
                            storage.devices.devices_list[devEui].group = dev.group!==undefined&&dev.group!==''?dev.group:'';
                            storage.devices.devices_list[devEui].tempGroup=dev.group!==undefined&&dev.group!==''?dev.group:'';
                        }
                        storage.devices.groupingDevice();
                    }
                }
                else if ( !command_list_cookie.get_device_appdata && json.err_string === 'inaccessible_command' )
                {
                    console.log(`Error 89664, ${json.err_string}. The get_device_appdata_resp request returned status false.`);
                }
                else
                {
                    alert(`Error 89664, ${json.err_string}. The get_device_appdata_resp request returned status false.`);
                }
                return true;
            }
            else if(json.cmd=='ping_resp')
            {
                send_vega.server_info_req();
                return true;
            }
            else if(json.cmd=='server_info_resp')
            {
                if(!json.status)
                {
                    console.log('server_info_resp ', json.err_string );
                }
                else
                {
                    delete json.cmd;
                    send_vega.server_info = json;
                }
                return true;
            }
            else if(json.cmd=='alter_user_resp')
            {
                var _deleted = json.deleted;
                var _command_list = json.command_list;
                var _device_access = json.device_access;
                var _devEui_list = json.devEui_list;
                var _consoleEnable = json.consoleEnable;
                var _rx_settings = json.rx_settings;
                if(_command_list)
                {
                    var my_command_list = new command_list();
                    my_command_list.set_command_list_array(_command_list);
                    set_cookie('command_list',JSON.stringify(_command_list));
                    scope.command_list_cookie= my_command_list;
                }
                if(_deleted||_device_access==false)
                {
                    window.location.reload();
                }
                if(_device_access||_devEui_list)
                {
                    if(_devEui_list)
                    {
                        var login = get_cookie('login');
                        for(var key in storage.users.list)
                        {
                            if(key==login)
                            {
                                storage.users.list[key].devEui_list = _devEui_list;
                            }
                        }
                    }
                    for(var key in storage.devices.devices_list)
                    {
                        if(typeof storage.devices.devices_list[key]=='object')
                        {
                            delete storage.devices.devices_list[key];
                        }
                    }
                   send_vega.send_get_devlist_reginfo_req();
                }
                
            }
            else if(json.cmd=='delete_users_resp')
            {
                if(json.status)
                {
                    if(json.delete_user_list!=undefined&&json.delete_user_list.length>0)
                    {
                        for(var j = 0; j<json.delete_user_list.length;j++)
                        {
                            for(var i = 0; i<arr_delete_user_list.length; i++)
                            {
                                if(json.delete_user_list[j].login==arr_delete_user_list[i])
                                {
                                    if(json.delete_user_list[j].status)
                                    {
                                        delete storage.users.list[arr_delete_user_list[i]];  
                                    }
                                    else
                                    {
                                        alert('Error 1201. The server could not delete the user. ');
                                    }
                                }
                              
                            }
                        }
                    }
                    else
                    {
                        console.log('Error 228');
                    }
                    
                   
                    arr_delete_user_list=[];
                    scope.$apply(function(){ 
                            scope.storage=storage; 
                            send_vega.loader=false; 
                        })
                    console.log('Удаление удалось');
                }
                else
                {
                    alert(`Error 67843, ${json.err_string}. The request delete_users_req returned status false.`);
                    console.log('Удаление не удалось');
                }
            }
            else if(json.cmd=='delete_devices_resp')
            {
                if(json.status)
                {
                    for(var i = 0; i<arr_delete_devices_last.length; i++)
                    {
                       delete storage.devices.devices_list[arr_delete_devices_last[i]];
                    }
                    arr_delete_devices_last=[];
                    scope.$apply(function(){ 
                            scope.storage=storage; 
                            send_vega.loader=false; 
                        })
                    storage.devices.groupingDevice();
                    console.log('Удаление удалось');
                }
                else
                {
                    alert(`Error 67844, ${json.err_string}. The request delete_devices_req returned status false.`);
                    console.log('Удаление не удалось');
                }
            }
            else if(json.cmd=='token_auth_resp')
            {
                if(json.status)
                {
                    set_cookie('token',json.token);
                    send_vega.auth_status=true;
                    send_vega.send_get_devlist_reginfo_req();
                    scope.get_base();
                    send_vega.get_userlist_req();
                    send_vega.server_info_req();
                    send_vega.loader_auth=false;
                }
                else
                {
                    delete_cookie('token');
                    delete_cookie('login');
                    delete_cookie('command_list');
                    window.location='./auth.html';
                }
            }
            else if(json.cmd=='close_auth_resp')
            {
                if(json.status)
                {
                    delete_cookie('token');
                    delete_cookie('login');
                    delete_cookie('command_list');
                    window.location='./auth.html';
                }
                else if(!json.status && json.err_string ==='invalid_token')
                {
                    delete_cookie('token');
                    delete_cookie('login');
                    delete_cookie('command_list');
                    window.location='./auth.html';
                }
                else
                {
                   alert(`Error 1202, ${json.err_string}. Failed to exit!`);
                }
            }
            else if(json.cmd=='manage_users_resp')
            {
                if(json.status)
                {
                    if(json.add_user_list!=undefined)
                    {
                        for(var i= 0 ; i<json.add_user_list.length;i++)
                        {
                            if(json.add_user_list[i].login!=undefined)
                            {
                                if(json.add_user_list[i].status)
                                {
                                    for(var q = 0 ; q<send_vega.queue_users.length;q++)
                                    {
                                        if(send_vega.queue_users[q].login==json.add_user_list[i].login)
                                        {
                                            scope.storage.users.set_user(send_vega.queue_users[q]);
                                            $('#editUser').modal('hide');
                                        }
                                    }
                                }
                                else
                                {
                                      alert('Error 1203. Server could not update user data!');
                                }
                            }
                            else
                            {
                                console.log('Пришло неадекватное значение при обновлении пользователя, в add_user_list отсутсвует логин ');
                            }
                        }
                        send_vega.queue_users=[];
                    }
                    else
                    {
                        console.log('add_user_list отсутствует, но успех, чет не то');
                    }
                }
                else
                {
                    alert(`Error 787874, ${json.err_string}. The request manage_users_req returned status false.`);
                   console.log('Error 787874, '+json.err_string);
                }
                scope.$apply(function(){ 
                            
                            scope.WS.loader=false; 
                            scope.storage;
                        });
            }
            else if(json.cmd=='get_users_resp')
            {
                if(json.status)
                {
                    if(json.user_list!=undefined)
                    {
                        for(var i= 0 ; i<json.user_list.length;i++)
                        {
                            scope.storage.users.set_user(json.user_list[i]);
                        }
                    }
                    else
                    {
                        console.log('user_list отсутствует, но успех, чет не то');
                    }
                }
                else if ( !command_list_cookie.get_users && json.err_string === 'inaccessible_command' )
                {
                    console.log(`Error 78785, ${json.err_string}. The request get_users_req returned status false.`);
                }
                else
                {
                    alert(`Error 78785, ${json.err_string}. The request get_users_req returned status false.`);
                   console.log('Список пользователей не получен, потому что  '+json.err_string);
                }
                scope.$apply(function(){ 
                            
                            scope.WS.loader=false; 
                            scope.storage;
                        });
            }
            else if(json.cmd=='send_data_resp')
            {
                if(json.status)
                {
                    for(var i = 0; i<json.append_status.length; i++)
                    {
                       if(json.append_status[i].devEui==storage.edit_device.devEui)
                       {
                           $('#sendData').modal('hide');
                       }
                       if(!json.append_status[i].status)
                       {
                           alert('Error 1204. The server could not send data to the device!');
                       }
                       else
                       {
                           alert('The data for the ' + json.append_status[i].devEui+' device were successfully sent');
                       }
                    }
                }
                else
                {
                    alert(`Error 1205 , ${json.err_string}. The server could not send data to the device!`);
                }
                 scope.$apply(function(){ 
                            send_vega.loader=false; 
                        })
            }
            else if(json.cmd=='delete_gateways_resp')
            {
                if(json.status)
                {
                    for(var i = 0; i<arr_delete_base_last.length; i++)
                    {
                       delete storage.bases.bases_list[arr_delete_base_last[i]];
                    }
                    arr_delete_base_last=[];
                    scope.$apply(function(){ 
                            scope.storage=storage; 
                            send_vega.loader=false; 
                        })
                    console.log('Удаление удалось');
                }
                else
                {
                    alert(`Error 1225 , ${json.err_string}. The request delete_gateways_req returned status false.`);
                    console.log('Удаление не удалось');
                }
            }
            else if(json.cmd=='manage_devices_resp')
            {
                
                if(json.status)
                {
                    if(json.device_add_status!=undefined&&json.device_add_status&&json.device_add_status.length>0)
                    {
                        for(var i = 0; i<json.device_add_status.length;i++)
                        {
                            var status = json.device_add_status[i].status;
                            var devEui = json.device_add_status[i].devEui;
                            if((status=='added'||status=='updated')&&valid.devEui(devEui))
                            {
                                if(storage.edit_device.devEui.toLowerCase()==devEui.toLowerCase())
                                {
                                    storage.devices.devices_list[storage.edit_device.devEui.toLowerCase()] = storage.edit_device;
                                    //!!','устройство в списке стало из edit');
                                    if(storage.edit_device.operation!='edit') scope.edit_group_device(storage.edit_device.devEui,storage.edit_device.group);
                                    $('#editDevice').modal('hide');
                                }
                            }
                            else if(status=='emptyDataForUpdate'&&valid.devEui(devEui))
                            {
                                alert('changes from existing device parameters is not detected');
                                $('#editDevice').modal('hide');
                            }
                            else if(status=='nothingToUpdate'&&valid.devEui(devEui))
                            {
                                alert('changes from existing device parameters is not detected');
                                $('#editDevice').modal('hide');
                            } 
                            else if(status=='updateViaMacBuffer'&&valid.devEui(devEui))
                            {
                                alert('received parameters should be updated via MAC commands and ones couldn’t be applied immediately.');
                                $('#editDevice').modal('hide');
                            } 
                            else if(valid.devEui(devEui))
                            {
                                switch (status) {
                                    case 'maxDevCountReached':
                                        alert('Error manage device '+devEui+' - maximum device count limitation has reached');
                                    break;
                                    case 'invalidAbpParamList':
                                        alert('Error manage device '+devEui+' - invalid mandatory parameters list for “ABP” section');
                                    break;
                                    case 'invalidDevAddrValue':
                                        alert('Error manage device '+devEui+' - invalid “devAddress” value. It should be less then 0x01FFFFFF and not equal zero');
                                    break;
                                    case 'invalidSessionKeyValue':
                                        alert('Error manage device '+devEui+' - invaliud size of “appsKey” or/and “nwksKey”');
                                    break;
                                    case 'invalidOtaaParamList':
                                        alert('Error manage device '+devEui+' - invalid mandatory parameters list for “OTAA” section');
                                    break;
                                    case 'frequencyPlanIsAbsant':
                                        alert('Error manage device '+devEui+' - “frequencyPlan” section is absent with OTAA activation');
                                    break;
                                    case 'invalidFrequencyPlan':
                                        alert('Error manage device '+devEui+' - invalid mandatory parameters list in section “frequencyPlan”');
                                    break;
                                    case 'invalidAppKeyValue':
                                        alert('Error manage device '+devEui+' - invalid size of “appKey”');
                                    break;
                                    case 'invalidChannelMaskParamList':
                                        alert('Error manage device '+devEui+' - invalid mandatory parameters list in section “channelMask”');
                                    break;
                                    case 'invalidClass':
                                        alert('Error manage device '+devEui+' - invalid value for “class” parameter');
                                    break;
                                    case 'unsupportClass':
                                        alert('Error manage device '+devEui+' - unsupported class, for example “CLASS_B”');
                                    break;
                                    case 'invalidRxWindow':
                                        alert('Error manage device '+devEui+' - invalid value for “rxWindow” parameter');
                                    break;
                                    case 'invalidDataRate':
                                        alert('Error manage device '+devEui+' - invalid value for “drRx2” or/and “preferDr” parameters');
                                    break;
                                    case 'invalidPower':
                                        alert('Error manage device '+devEui+' - invalid value for “preferPower” parameter');
                                    break;
                                    case 'invalidDelay':
                                        alert('Error manage device '+devEui+' - invalid value for or/and [“delayRx1”, “delayRx2”, “delayJoin1”, “delayJoin2” ] parameters');
                                    break;

                                    case 'noRegisterKeys':
                                        alert('Error manage device '+devEui+' - device is not exist yet and packet doesn’t contain registration information');
                                    break;
                                    case 'repetitionDevAddr':
                                        alert('Error manage device '+devEui+' - device with corresponding “devAddress” is already registered on server');
                                    break;
                                    case 'abpReginfoAlreadyExist':
                                        alert('Error manage device '+devEui+' - ABP activation information for corresponding device is already existed on server');
                                    break;
                                    case 'otaaReginfoAlreadyExist':
                                        alert('Error manage device '+devEui+' - OTAA activation information for corresponding device is already existed on server');
                                    break;
                                    case 'reginfoAlreadyExist':
                                        alert('Error manage device '+devEui+' - registration information for corresponding device is already existed on server');
                                    break;
                                    default:
                                        alert('Error manage device '+devEui+' '+status);
                                        console.log(devEui+' manage_devices_resp '+status);
                                    break;
                                }
                            }
                        }
                        
                        scope.$apply(function(){ 
                            scope.storage=storage; 
                            send_vega.loader=false; 
                        })
                    }
                    else
                    {
                        console.log('Manage_devices_resp пришел но не чего в нем не нашел');
                    }
                }
                else
                {
                    alert(`Error 1226 , ${json.err_string}. The request manage_devices_req returned status false.`);
                    console.log('Ошибка manage_devices_resp');
                }
             
                
            }
            else if(json.cmd=='manage_gateways_resp')
            {
                
                if(json.status)
                {
                    if(json.gateway_add_status!=undefined&&json.gateway_add_status&&json.gateway_add_status.length>0)
                    {
                        for(var i = 0; i<json.gateway_add_status.length;i++)
                        {
                            if(json.gateway_add_status[i].status&&json.gateway_add_status[i].gatewayId&&json.gateway_add_status[i].gatewayId==storage.edit_base.gatewayId)
                            { 
                                storage.bases.bases_list[json.gateway_add_status[i].gatewayId]=new base(storage.edit_base);
                                
                            }
                        }
                        $('#editBase').modal('hide');
                        send_vega.send_get_base();
                        scope.$apply(function(){ 
                            scope.storage=storage; 
                            send_vega.loader=false; 
                        })
                    }
                    else
                    {
                        console.log('manage_gateways_resp пришел но не чего в нем не нашел');
                    }
                }
                else
                {
                    alert(`Error 1227 , ${json.err_string}. The request manage_gateways_req returned status false.`);
                    console.log('Ошибка manage_gateways_resp');
                }
            }
            else if(json.cmd=='get_devices_resp')
            {
                if(json.status)
                {
                    if(json.devices_list&&json.devices_list!=undefined)
                    {
                        var tempObj = new Object();
                        tempObj.address = [];
                        for(var i=0; i<json.devices_list.length;i++)
                        {    
                            var newdevice = new device();
                            var res = newdevice.set_device(json.devices_list[i]);
                            if(res)
                            {
                                storage.devices.devices_list[newdevice.devEui.toLowerCase()] =newdevice ;
                            }
                        }
                        scope.$apply(function(){ 
                                scope.storage; 
                                send_vega.loader=false; 
                                
                                if(!scope.command_list_cookie.get_gateways)
                                {
                                    scope.marker_show();
                                }
                            
                        });
                        send_vega.get_device_appdata_req(); 
                    }
                }
                else if ( !command_list_cookie.get_devices && json.err_string === 'inaccessible_command' )
                {
                    console.log(`Error 1228 , ${json.err_string}. The request get_devices_req returned status false.`);
                }
                else
                {
                    alert(`Error 1228 , ${json.err_string}. The request get_devices_req returned status false.`);
                }
                return true;
            }
            else if(json.cmd=='get_gateways_resp')
            {
                if(json.status)
                {
                    if(json.gateway_list&&json.gateway_list!=undefined)
                    {
                        var tempObj = new Object();
                        for(var i=0; i<json.gateway_list.length;i++)
                        {               
                            storage.bases.add_base(json.gateway_list[i]);
                            if(json.gateway_list[i].lastOnline!=undefined)
                            {
                            var newbs =  storage.bases.bases_list[json.gateway_list[i].gatewayId];
                            if(newbs!=undefined)
                            {
                                storage.bases.bases_list[json.gateway_list[i].gatewayId].lastOnline=json.gateway_list[i].lastOnline;
                            }
                            }
                        }
                        scope.$apply(function(){ 
                            scope.storage; 
                            send_vega.loader=false; 
                            
                        });
                        if(scope.type_marker==1||scope.type_marker==3)
                        {
                            scope.marker_show();
                        }
                    }
                }
                else
                {
                    alert(`Error 1229 , ${json.err_string}. The request get_gateways_req returned status false.`);
                }
                return true;
            }
            else if(json.cmd == 'manage_device_appdata_resp')
            { 
                if(json.status)
                {
                    if(json.update_status!=undefined)
                    {
                        for(var i =0;i<json.update_status.length;i++)
                        {
                            if(json.update_status[i].devEui==storage.edit_device.devEui)
                            {
                                if(!json.update_status[i].status)
                                {
                                    alert(`Error 43435, ${json.update_status[i].err_string}. The manage_device_appdata_req request returned status false, perhaps such a device does not exist. Try restarting the page and retrying your request.`);
                                }
                                else
                                {
                                    var devEui = storage.edit_device.devEui.toString().toLowerCase();
                                    storage.devices.devices_list[devEui].group = storage.edit_device.group!==undefined&&storage.edit_device.group!==''?storage.edit_device.group:'';
                                    storage.devices.devices_list[devEui].tempGroup = storage.edit_device.group!==undefined&&storage.edit_device.group!==''?storage.edit_device.group:'';
                                }
                            }
                        }
                        storage.devices.groupingDevice();
                    }
                }
                else
                {
                    alert(`Error 1230 , ${json.err_string}. The request manage_device_appdata_req returned status false.`);
                }
                
            }
            else if(json.cmd=='get_data_resp')
            {
                if(json.status)
                {
                    if(json.data_list&&json.data_list!=undefined)
                    {
                        if(storage.devices.devices_list[json.devEui.toLowerCase()]!=undefined)
                        {
                            storage.devices.devices_list[json.devEui.toLowerCase()].last_req_data={
                                start:storage.date_range.start,
                                end:storage.date_range.end
                            };
                        }
                        for(var j=0;j<json.data_list.length;j++)
                        {
                            storage.devices.devices_list[json.devEui.toLowerCase()].add_history(json.data_list[j],json.totalNum);
                        }
                        scope.$apply(function(){ 
                            scope.storage; 
                            send_vega.loader=false;
                            if(scope.storage.selected_device.devEui.toString().toLocaleLowerCase()==json.devEui.toLocaleLowerCase())
                            {
                                scope.reload_charts_connect();
                            }
                        }); 
                    }
                }
                else
                {
                    alert(`Error 1231 , ${json.err_string}. The request get_data_req returned status false.`);
                }
            }
            //Получено новое сообщение от устройства
            else if(json.cmd=='rx')
            {
                if(json.ts>scope.last_ts_from_server)scope.last_ts_from_server=json.ts;
                if(storage.devices.devices_list[json.devEui.toLowerCase()]) 
                {
                    storage.devices.devices_list[json.devEui.toLowerCase()].add_history(json);
                }
                else
                {
                    console.log('rx unknown device', json);
                }
                scope.$apply(function(){ scope.storage; scope.selected_device; })
            }
            else
            {
                return false;
            }
            return true;
        }
        catch(err)
        {
            console.log('Error 732',err);
            return false;
        }
    };
    var my_ws = new WebSocket(ws.address);
    send_vega.status=false;
    send_vega.reload_status=false;
    my_ws.onopen=function(){
        send_vega.status=true
        this.status=true;
        if(send_vega.auth_status){
            send_vega.send_get_devlist_reginfo_req();
            send_vega.send_get_base();
            send_vega.get_userlist_req();
            send_vega.server_info_req();
        }
        else
        {
            send_vega.token_auth_req();
            send_vega.loader_auth=true;
        }
    };
    
    my_ws.onclose=function(event){
        if(event.wasClean)
        {
        }
        else
        {
        }
        send_vega.auth_status=false;
        send_vega.status=false;
        if(!send_vega.reload_status)
        {
            $timeout(function(){ send_vega.reload_status=true; send_vega.reload();  },10000);
        }
        console.log('WebSocket закрыт');
    };
    
    my_ws.onerror=function(error){
        send_vega.loader_auth=false;
        send_vega.status=false;
        if(!send_vega.reload_status)
        {
            send_vega.reload_status=true;
            $timeout(function(){send_vega.reload()},10000);
        }
        console.log('WebSocket закрыт с ошибкой');
    };
    my_ws.onmessage=function(event){
       send_vega.last_time = new Date().getTime();
       parse_vega_api(event.data);
    };
    
    send_vega.reload = function()
    {
        if(!send_vega.status)
        {
            try
            {
                var new_ws = new WebSocket(ws.address);
                new_ws.onmessage=my_ws.onmessage;
                new_ws.onerror=my_ws.onerror;
                new_ws.onclose=my_ws.onclose;
                new_ws.onopen=my_ws.onopen;
                my_ws=new_ws;  
                send_vega.reload_status=false;
            }
            catch(err)
            {}
        }
        else
        {
            send_vega.reload_status=false;
            console.log('info 804');
        }

    };
    
    
    return send_vega;
}]);

app.controller('AppController',function(WS,storage,$scope,leafletBoundsHelpers,leafletData,$rootScope,$interval){
    
    $scope.command_list_cookie=new command_list(); ;
    $scope.command_list_cookie.set_command_list_array(command_list_cookie);
    $scope.WS = WS;
    $scope.loader_chart=false;
    $scope.storage = storage;
    $scope.valid = new valid_data();
    $scope.my_converter = new vega_converter();
    $scope.toggle_sticky=new sticky();
    $scope.request=false;
    $scope.count_data = 1;
    $scope.step_data=10;
    $scope.dataForSend='';
    $scope.portForSend='';
    $scope.ackForSend=false;
    $scope.autoScrollConsole = true;
    $scope.logs = {};
    $scope.groups_selected = [];
    $scope.last_ts_from_server = 0;
    $scope.editDevice = {};
    $scope.getCurrentTime = function()
    {
        return moment().format('lll');
    }
    $scope.remove = function (scope) {
        scope.remove();
      };
    $scope.downloadTable = function(table,nameTable,nameList)
    {
        $('#'+table).tableExport({type:'excel',fileName:moment().format('DD.MM.YY HH.mm')+' '+nameTable,htmlContent:true,mso:{fileFormat:'xlshtml',worksheetName:nameList}});
    }
      $scope.toggle = function (scope) {
        scope.toggle();
      };

      $scope.moveLastToTheBeginning = function () {
        var a = $scope.data.pop();
        $scope.data.splice(0, 0, a);
      };

      $scope.newSubItem = function (scope) {
        var nodeData = scope.$modelValue;
        nodeData.nodes.push({
          id: nodeData.id * 10 + nodeData.nodes.length,
          title: nodeData.title + '.' + (nodeData.nodes.length + 1),
          nodes: []
        });
      };

      $scope.collapseAll = function () {
        $scope.$broadcast('angular-ui-tree:collapse-all');
      };

      $scope.expandAll = function () {
        $scope.$broadcast('angular-ui-tree:expand-all');
      };

      $scope.data = [{
        'id': 1,
        'title': 'node1',
        'nodes': [
          {
            'id': 11,
            'title': 'node1.1',
            'nodes': [
              {
                'id': 111,
                'title': 'node1.1.1',
                'nodes': []
              }
            ]
          },
          {
            'id': 12,
            'title': 'node1.2',
            'nodes': []
          }
        ]
      }, {
        'id': 2,
        'title': 'node2',
        'nodrop': true, // An arbitrary property to check in custom template for nodrop-enabled
        'nodes': [
          {
            'id': 21,
            'title': 'node2.1',
            'nodes': []
          },
          {
            'id': 22,
            'title': 'node2.2',
            'nodes': []
          }
        ]
      }, {
        'id': 3,
        'title': 'node3',
        'nodes': [
          {
            'id': 31,
            'title': 'node3.1',
            'nodes': []
          }
        ]
      }];

    $interval(function(a){
        $scope.WS.logs.clone(); 
        $scope.$evalAsync(function(){
            $scope.WS.logs;
        });
        $scope.update_ranges_daterangepicker();
    },5000);
    
    
    $scope.filter_group = function()
    {
        var temp = [];
        for(var i = 0; i<this.storage.devices.group_list.length;i++)
        {
            this.storage.devices.group_list[i].toggle = true;
        }
    }
    $scope.orderBy={
        gateways:{
            select:'name',
            reverse:false,
            get_selected:function()
            {
                return {
                    name:this.select,
                    reverse:this.reverse
                };
            },
            set_selected:function(val)
            {   if(val===this.select)
                {
                    if(this.reverse)
                    {
                        this.reverse=false;
                    }
                    else
                    {
                        this.reverse=true;
                    }
                }
                else
                {
                    this.reverse=false;
                }
                this.select=val;
            }
        },
        devices:{
            select:'last_data_ts',
            reverse:true,
            get_selected:function()
            {
                return {
                    name:this.select,
                    reverse:this.reverse
                };
            },
            set_selected:function(val)
            {   if(val===this.select)
                {
                    if(this.reverse)
                    {
                        this.reverse=false;
                    }
                    else
                    {
                        this.reverse=true;
                    }
                }
                else
                {
                    this.reverse=false;
                }
                this.select=val;
            }
        },
        users:{
            select:'login',
            reverse:false,
            get_selected:function()
            {
                return {
                    name:this.select,
                    reverse:this.reverse
                };
            },
            set_selected:function(val)
            {   if(val===this.select)
                {
                    if(this.reverse)
                    {
                        this.reverse=false;
                    }
                    else
                    {
                        this.reverse=true;
                    }
                }
                else
                {
                    this.reverse=false;
                }
                this.select=val;
            }
        }
    };
    
    $scope.check_page='5';//Выбранная страницa
    $scope.add_devEui = function(added_devEui)
    {
        if(this.storage.edit_user.add_devEui(added_devEui))
        {
            this.added_devEui = '';
        }
    }
    $scope.my_limit=function ()
    {
      return this.step_data*this.count_data;  
    };
    $scope.new_convert_date = function(date,offset,format,type)
    {
        if(!format) format='LLL';
        if(!offset) offset=0;
        var date = moment(date);
        if(type=='utc')
        {
            date = date.utc();
        }
        date.add('seconds',offset);
        return moment(date).format(format).replace(',',''); 
    }
    $scope.convert_date=function(date,type)
    {
        if(date&&date!=undefined&&date>0)
        {
            if(type=='date')
            {
                return moment(date).format('DD.MM.YYYY').replace(',','');
            }
            return moment(date).format('DD.MM.YYYY HH:mm:ss').replace(',','');
        }
        else
        {
            return 'Undefined';
        }
    };
    
    $scope.add_device=function ()
    {
        ///console.log('!!!!!','scope.add_device');
        $scope.storage.edit_device = new device();
        ///console.log('!!!!!','edit_device  болванка');
        this.storage.temp_edit_device = this.storage.edit_device.devEui;
        ///console.log('!!!!!','temp_edit_device из edit',this.storage.temp_edit_device);
        
        $('#editDevice').modal('show');
    };
    $scope.add_base=function ()
    {
        $scope.storage.edit_base = new base();
        $('#editBase').modal('show');
    };
     $scope.add_user=function ()
    {
        $scope.storage.edit_user = new user();
        $scope.storage.edit_user.selectedGroup = 'Custom';
        $scope.update_selected_pattern();
        $scope.storage.devices.devices_list.toArray();
        $('#editUser').modal('show');
    };
    $scope.update_selected_pattern=function(){
        var res=this.storage.patterns_user.get_pattern(this.storage.edit_user);
        if(res)
        {
            $scope.storage.select_pattern=res;
        }
        else
        {
            $scope.storage.select_pattern='Custom';
        }
    };
    $scope.selectedForGroupDevice = function()
    {
        var selectedGroup = $scope.storage.edit_user.selectedGroup;
        var devices = selectedGroup.devices;
        for( var i = 0; i < devices.length; i++ )
        {
            $scope.storage.edit_user.add_devEui_notAlert(devices[i].devEui);
        }
        $scope.storage.edit_user.selectedGroup = 'Custom';
    }
    $scope.showGroup = function(group)
    {
        if(typeof group !== 'object' && typeof group.devices !== 'object') return false;
        var devices = group.devices;
        for( var i = 0; i < devices.length; i++ )
        {
            var dev = devices[i];
            var availability = $scope.storage.edit_user.checkDevEui(dev.devEui);
            if(!availability) return true;
        }
        return false;
    }
    $scope.select_device = function(devEui)
    {
       // console.log('!!!!!','scope.select_device');
        $('#editDevice').modal('show');
       // console.log('!!!!!','edit_device - из списка взял',devEui);
        $scope.storage.edit_device = new device().set_device(this.storage.devices.devices_list[devEui.toLowerCase()]);
        $scope.storage.edit_device.operation='edit';
        this.storage.temp_edit_device = this.storage.edit_device.devEui;
        ///console.log('!!!!!','temp_edit_device из едит',this.storage.temp_edit_device);
    };
    $scope.select_user = function(login)
    {
        $scope.storage.devices.devices_list.toArray();
        $('#editUser').modal('show');
        $scope.storage.edit_user = new user(this.storage.users.list[login].get_for_send());
        $scope.storage.edit_user.selectedGroup = 'Custom';
        $scope.storage.edit_user.edit=true;
        $scope.update_selected_pattern();
    };
    $scope.send_data = function()
    {
        var valid = new valid_data();
        if(this.ackForSend==undefined || this.ackForSend=='' || !valid.isBool(this.ackForSend))
        {
            this.ackForSend=false;
        }
        if(valid.isData(this.dataForSend)&&valid.isPort(this.portForSend))
        {
            var devEui = this.storage.edit_device.devEui;
            var tempObj={
                cmd:'send_data_req',
                data_list:[
                    {
                        devEui:devEui,
                        data:this.dataForSend,
                        port:parseInt(this.portForSend),
                        ack:this.ackForSend
                    }
                ]
            };
            this.WS.send_json(JSON.stringify(tempObj));
        }
        else
        {
            alert('Error 1206. Fields are not filled with valid values!');
        }
    }
    $scope.select_device_send_data = function(devEui)
    {
        $('#sendData').modal('show');
        //console.log('!!!!!','scope.select_device_send_data');
        //console.log('!!!!!','edit_device клон из списка');
        $scope.storage.edit_device = new device().set_device(this.storage.devices.devices_list[devEui.toLowerCase()]);
    }
     $scope.select_base= function(gatewayId)
    {
        //поиск нужного устройства
        $('#editBase').modal('show');
        $scope.storage.edit_base = new base(this.storage.bases.bases_list[gatewayId].get_edit_params());
        this.storage.temp_edit_base = this.storage.edit_base.gatewayId;
    };
    $scope.hideOldData = function()
    {
        this.currentDateForFilterData = parseInt(moment().format('x'));
        if(this.last_ts_from_server) this.currentDateForFilterData = this.last_ts_from_server;
    }
    $scope.request_data = function()
    {
        this.request=true;
        var limit = 100000;
        if(this.storage.selected_device.totalNum!=undefined)
        {
            limit = this.storage.selected_device.totalNum+100000;
        }
        var select = {
            date_from: this.storage.date_range.start*1000,
            date_to: this.storage.date_range.end*1000,
            limit: limit,
            direction:'ALL',
            withMacCommands:true
        };
        $scope.currentDateForFilterData = null;
        this.WS.send_get_device_data_req(this.storage.selected_device.devEui,select);
    };
   
    $scope.show_setting_table_data = function(){
        $('#table_data').modal('show');
    };
    $scope.edit_group_device = function(devEui,group)
    {
        var tempObject = {};
        tempObject.devEui = devEui;
        tempObject.group = group;
        if (this.command_list_cookie.manage_device_appdata) this.WS.manage_device_appdata_req([{devEui:devEui,group:group}]);
    }
    $scope.select_pattern = function(){
        if(this.storage.select_pattern!='Custom')
        {
            storage.edit_user.rx_settings.unsolicited = this.storage.select_pattern.rx_settings.unsolicited;
            storage.edit_user.rx_settings.direction = this.storage.select_pattern.rx_settings.direction;
            storage.edit_user.rx_settings.withMacCommands = this.storage.select_pattern.rx_settings.withMacCommands;
            storage.edit_user.device_access = this.storage.select_pattern.device_access;
            storage.edit_user.consoleEnable = this.storage.select_pattern.consoleEnable;
            storage.edit_user.command_list = this.storage.select_pattern.command_list;
        }
    };
    $scope.open_device = function(devEui)
    {
        this.toggle_table_data.reload();
        $scope.request=false;
        var device = $scope.storage.devices.devices_list[devEui.toLowerCase()];
        this.storage.selected_device = device;
        this.request_data();
        $scope.check_page="6";
    }
    $scope.removeUser = function(login)
    {
        var removeUser = this.storage.users.list[login];
        if(removeUser&&removeUser!=undefined)
        {
            if(confirm('Are you sure you want to remove the user '+login))
            {
                this.WS.delete_userlist_req([login]);
            }
        }
        else
        {
            console.log('No user deleted');
        }
    };
    $scope.removeDevice = function(devEui)
    {
        var removedevice = this.storage.devices.devices_list[devEui.toLowerCase()];
        if(removedevice&&removedevice!=undefined)
        {
            if(confirm('Are you sure you want to remove the device with DevEui '+devEui))
            {
                this.WS.send_delete_devlist_req([devEui.toLowerCase()]);
            }
        }
        else
        {
            console.log('No devices deleted');
        }
    };
    $scope.removeBase = function(gatewayId)
    {
        var removebase = this.storage.bases.bases_list[gatewayId];
        if(removebase&&removebase!=undefined)
        {
            var identiry = removebase.name?'name ' + removebase.name:'gateway id '+gatewayId;
            if(confirm('Are you sure you want to remove the base with '+identiry))
            {
                this.WS.send_delete_base_req([gatewayId]);
            }
        }
        else
        {
            console.log('No base deleted');
        }
    };
    $scope.saveUser=function()
    {
        if(this.storage.edit_user.valid())
        {
            this.WS.update_userlist_req([this.storage.edit_user.get_for_send()]);
        }
        else
        {
            alert('Error 1207. Fields are not filled with valid values!')
        }
    };
    $scope.saveBase = function ()
    {
      if(this.storage.edit_base.valid_data())
      {
        var valid = new valid_data();
        var ok = true;
        var obj = new Object();
        obj.cmd='manage_gateways_req';
        obj.gateway_list=[];
        obj.gateway_list[0] = new Object();
        obj.gateway_list[0].gatewayId = this.storage.edit_base.gatewayId;
        if(valid.isInt(this.storage.edit_base.downlinkChannel))
        {
             obj.gateway_list[0].downlinkChannel=this.storage.edit_base.downlinkChannel;
        }
        else if(this.storage.edit_base.downlinkChannel!=undefined&&this.storage.edit_base.downlinkChannel!='')
        {
            ok=false;
        }
        if(valid.valid(this.storage.edit_base.name)&&valid.valid(this.storage.edit_base.comment))
        {
            var extraInfo = {
                name:this.storage.edit_base.name,
                comment:this.storage.edit_base.comment,
            };
            obj.gateway_list[0].extraInfo=JSON.stringify(extraInfo);
        }
        else 
        {
            ok=false;
        }
        if(this.storage.edit_base.maxPower!=undefined&&valid.isInt(this.storage.edit_base.maxPower)&&this.storage.edit_base.maxPower>0 )
        {
            obj.gateway_list[0].maxPower=parseInt(this.storage.edit_base.maxPower); 
        }else if(this.storage.edit_base.maxPower==undefined||this.storage.edit_base.maxPower.maxPower=='')
        {
            
        }
        else
        {
            ok=false;
        }
        if(valid.isBool(this.storage.edit_base.rxOnly))
        {
             obj.gateway_list[0].rxOnly=this.storage.edit_base.rxOnly;
             if(obj.gateway_list[0].rxOnly)
             {
                if(valid.valid(this.storage.edit_base.companionGateway))
                {
                     obj.gateway_list[0].companionGateway=this.storage.edit_base.companionGateway;
                }
                else if(this.storage.edit_base.companionGateway!=undefined&&this.storage.edit_base.companionGateway!='')
                {
                    ok=false;
                }
             }
        }
        else if(this.storage.edit_base.rxOnly!=undefined&&this.storage.edit_base.rxOnly!='')
        {
            ok=false;
        }
        if(this.storage.edit_base.position!=undefined)
        {
            if(valid.isNumber(this.storage.edit_base.position.latitude)&&valid.isNumber(this.storage.edit_base.position.longitude)&&valid.isInt(this.storage.edit_base.position.altitude))
            {
                obj.gateway_list[0].position=this.storage.edit_base.position;
            }
            else
            {
                ok=false;
            }
        }
        if(ok)
        {
            try{ obj.gateway_list[0].downlinkChannel=parseInt(obj.gateway_list[0].downlinkChannel);}catch(err){}
            try{ obj.gateway_list[0].position.altitude=parseInt(obj.gateway_list[0].position.altitude);}catch(err){}
            try{ obj.gateway_list[0].position.latitude=parseFloat(obj.gateway_list[0].position.latitude);}catch(err){}
            try{ obj.gateway_list[0].position.longitude=parseFloat(obj.gateway_list[0].position.longitude);}catch(err){}
            this.WS.send_json(JSON.stringify(obj));
        }
        else
        {
            alert('Error 2019. Fields are not filled with valid values!');
        }
      }
      else
      {
          alert('Error 2018. Fields are not filled with valid values!');
      }
    };
    $scope.reload_charts_connect =function()
    {
        var statistics = this.storage.selected_device.statistics_history(this.storage.date_range);
        this.highcharts_connect(statistics.connect);
    };
    $scope.highcharts_connect = function (connect){
        $scope.loader_chart=true;
        if($('#proba').width()==100)
        {
            setTimeout(function(){
                $scope.highcharts_connect(connect);
                $scope.$$phase;
            },1000);
            
            return false;
        }
        $scope.loader_chart=false;
       connect.sort(function(a,b){
             return a.date-b.date;
         });
       if(connect[0]) connect[0].date>connect[connect.length-1].date?connect.reverse():connect;
       var date = [];
       var rssi = [];
       var snr = [];
       for(var i = 0; i <connect.length;i++)
       {
           date.push(connect[i].date);
           rssi.push([connect[i].date,connect[i].rssi]);
           snr.push([connect[i].date,connect[i].snr]);
       }
       
        Highcharts.chart('container', {
            
           chart: {
               width: $('#proba').width()-60,
               type: 'column',
               zoomType: 'x',
               resetZoomButton: {
                    theme: {
                        padding:3
                    },
                    position: {
                        x: -20,
                        y: -10
                    }
                },
           },
           title:{
               style:
                    {
                        display:'none'
                    }
           },
            yAxis: {
                title: {
                    text: "dB"
                }
             },
            xAxis: {
                  type: 'datetime',
                  ordinal:false
             },
            rangeSelector: {
             enabled: false
            },

           series: [{
               type: 'column',
               name: 'Received signal strength indication (RSSI)',
               data: rssi
           },
           {
               type: 'column',
               name: 'Signal-to-noise ratio (SNR)',
               data: snr
           }]
       });
    };
    $scope.Filter_gateway=function(gateway)
    {
        var valid = new valid_data();
        if($scope.filter_gateway!=undefined&&$scope.filter_gateway&&$scope.filter_gateway!='')
        {
            var ok = false;
            if(gateway.gatewayId.toLowerCase().indexOf(this.filter_gateway.toLowerCase())<0&&gateway.name.toLowerCase().indexOf(this.filter_gateway.toLowerCase())<0&&gateway.comment.toLowerCase().indexOf(this.filter_gateway.toLowerCase())<0&&gateway.latency.toString().toLowerCase().indexOf(this.filter_gateway.toLowerCase())<0)
            {
                return false;
            }
            else
            {
                 return true;
            }
        }
        else if(valid.valid(gateway.gatewayId))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    $scope.Filter_user=function(user)
    {
        var valid = new valid_data();
        if($scope.filter_user!=undefined&&$scope.filter_user&&$scope.filter_user!='')
        {
            var ok = false;
            var permission = this.storage.patterns_user.get_pattern(user);
            if(user.login=='noob')
                {
                }
            if(user.login.toLowerCase().indexOf(this.filter_user.toLowerCase())<0&&user.device_access.toLowerCase().indexOf(this.filter_user.toLowerCase())<0)
            {
                if(!permission)
                {
                  return  "custom".toLocaleLowerCase().indexOf(this.filter_user.toLowerCase())<0?false:true;
                }
                else if(permission.name.toLocaleLowerCase().indexOf(this.filter_user.toLowerCase())>=0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
             
            }
            else
            {
                return true;
            }
        }
        else if(valid.valid(user.login))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    $scope.localLang = {
        selectAll       : "Tick all",
        selectNone      : "Tick none",
        search          : "Type here to search group...",
        nothingSelected : "Nothing is selected, show All"         //default-label is deprecated and replaced with this.
    }
    $scope.saveGroup=function(dev,event)
    {
        //console.log('!!!!!','scope.saveGroup');
        event.target.blur();
        dev.hover = false;
        dev.focus = false;
        if(dev.group!=dev.tempGroup)
        {
            dev.group=dev.tempGroup!==undefined&&dev.tempGroup!==''?dev.tempGroup:'';
            storage.edit_device = new device();
            //console.log('!!!!!','edit_device - болванка');
            storage.edit_device.devEui = dev.devEui;
            storage.edit_device.group = dev.tempGroup!==undefined&&dev.tempGroup!==''?dev.tempGroup:'';
            
            $scope.edit_group_device(dev.devEui,dev.tempGroup);
        }
    }
    $scope.resetGroup=function(dev,event)
    {
        dev.hover = false;
        dev.tempGroup=dev.group;
    }
    $scope.mouseoverGroup=function(dev)
    {
        dev.hover = true;
        if(dev.tempGroup===undefined&&dev.group)
        {
            dev.tempGroup=dev.group;
        }
    }
    $scope.mouseleaveGroup = function(dev)
    {
        dev.hover=false;
    }
    $scope.blurGroup = function(dev)
    {
        dev.focus=false;
    }
    $scope.focusGroup = function(dev)
    {
        dev.focus=true;
        if(dev.tempGroup===undefined&&dev.group)
        {
            dev.tempGroup=dev.group;
        }
    }
    $scope.Filter_device=function(device)
    {
        if(typeof device == 'object'&&device.devEui)
        {
            var valid = new valid_data();
            var ok = false;
            var countSelectedGroups = 0;
            var countToggleGroups = this.storage.devices.countSelectedGroup();
            for(var i = 0; i < this.storage.devices.group_list.length; i++)
            {
                var group = this.storage.devices.group_list[i];
                var matchedGroups = group.title == device.group || (!device.group&&group.title=='Other');
                if(matchedGroups&&group.toggle)
                {
                    ok = true;
                    countSelectedGroups++;
                    break;
                }
            }
            var selectedAllGroup = countToggleGroups===0||this.storage.devices.group_list.length===countToggleGroups;
            if(!selectedAllGroup&&!ok) return false;
            if($scope.filter_device!=undefined&&$scope.filter_device&&$scope.filter_device!='')
            {
                var devName = device.devName;
                if(devName==undefined)
                {
                    devName = '';
                }
                var group = device.group;
                if(group==undefined)
                {
                    group = '';
                }
                if((device.devEui.toLowerCase().indexOf(this.filter_device.toLowerCase())<0&&devName.toLowerCase().indexOf(this.filter_device.toLowerCase())<0&&(group.toLowerCase().indexOf(this.filter_device.toLowerCase())<0)&&device.get_reg_info(device.devEui).toLowerCase().indexOf(this.filter_device.toLowerCase())<0&&this.convert_date(device.last_data_ts).toLowerCase().indexOf(this.filter_device.toLowerCase())<0))
                {
                    return false;
                }
                else
                {
                     return true;
                }
            }
            else if(valid.devEui(device.devEui))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
    $scope.saveDevice = function ()
    {              
        //console.log('!!!!!','scope.saveDevice');
        var old_device;
        //console.log('!!!!!','old_device init');
        if(this.storage.temp_edit_device!=undefined)
        {
            //console.log('!!!!!','temp_edit_device!=undefined');
            old_device= this.storage.devices.devices_list[this.storage.temp_edit_device.toString().toLowerCase()];
            //console.log('!!!!!','old_device из списка по девеуи');
        }
        
        if(this.storage.edit_device.valid_data()&&(this.storage.devices.devices_list[this.storage.edit_device.devEui]==undefined||(this.storage.edit_device.operation=='edit')))
        {
            var obj = new Object();
            obj.cmd='manage_devices_req';
            obj.devices_list=[];
            obj.devices_list[0] = new Object();
            obj.devices_list[0].devEui = this.storage.edit_device.devEui;
            if(old_device!=undefined&&old_device&&old_device.valid_data())
            {
                //console.log('!!!!!','СЦЕНАРИЙ 1');
                if(this.storage.edit_device.devName!=undefined&&old_device.devName!=this.storage.edit_device.devName.toString())
                {
                    obj.devices_list[0].devName=this.storage.edit_device.devName;
                }
                var ok = false;
                for(var key in old_device.frequencyPlan)
                {
                    if(this.storage.edit_device.frequencyPlan[key]!=undefined&&this.storage.edit_device.frequencyPlan[key].toString()!=old_device.frequencyPlan[key].toString())
                    {
                        var ok = true;
                        break;
                    }
                }
                if(ok)
                {
                    obj.devices_list[0].frequencyPlan=this.storage.edit_device.frequencyPlan;
                }
                var ok = false;
                for(var key in old_device.ABP)
                {
                    if(this.storage.edit_device.ABP[key]!=undefined&&((old_device.ABP[key]!=undefined&&this.storage.edit_device.ABP[key].toString()!=old_device.ABP[key].toString())||old_device.valid_clean_ABP()))
                    {
                        var ok=true;
                        break;
                    }
                }
                if(ok)
                {
                    //console.log('!!!!!','Все норм по ABP');
                    obj.devices_list[0].ABP=this.storage.edit_device.ABP;
                }
                else
                {
                    //console.log('!!!!!','Все через жопу по ABP');
                    delete obj.devices_list[0].ABP;
                }
                var ok = false;
                for(var key in old_device.OTAA)
                {
                    if(key=='last_join_ts'&&obj.devices_list[0].OTAA!=undefined&&obj.devices_list[0].OTAA[key]!=undefined)
                    {
                        delete obj.devices_list[0].OTAA[key];
                    }
                    if(this.storage.edit_device.OTAA[key]!=undefined&&((old_device.OTAA[key]!=undefined&&this.storage.edit_device.OTAA[key].toString()!=old_device.OTAA[key].toString())||old_device.valid_clean_OTAA()))
                    {
                        var ok=true;
                        break;
                    }
                }
                if(ok)
                {
                    obj.devices_list[0].OTAA=this.storage.edit_device.OTAA;
                }
                else
                {
                    delete obj.devices_list[0].OTAA;
                }
                var ok = false;
                for(var key in old_device.channelMask)
                {
                    if(this.storage.edit_device.channelMask[key]!=undefined&&this.storage.edit_device.channelMask[key].toString()!=old_device.channelMask[key].toString())
                    {
                        var ok=true;
                        break;
                    }
                }
                if(ok)
                {
                    obj.devices_list[0].channelMask=this.storage.edit_device.channelMask;
                }
                var ok = false;
                for(var key in old_device.position)
                {
                    if(this.storage.edit_device.position[key]!=undefined&&this.storage.edit_device.position[key].toString()!=old_device.position[key].toString())
                    {
                        var ok=true;
                        break;
                    }
                }
                if(ok)
                {
                    obj.devices_list[0].position=this.storage.edit_device.position;
                }
                if(this.storage.edit_device.class!=undefined&&old_device.class.toString()!=this.storage.edit_device.class.toString())
                {
                    obj.devices_list[0].class=this.storage.edit_device.class;
                }
                if(old_device.rxWindow.toString()!=this.storage.edit_device.rxWindow.toString()&&this.storage.edit_device.rxWindow!=undefined)
                {
                    obj.devices_list[0].rxWindow=parseInt( this.storage.edit_device.rxWindow);
                }
                if(old_device.delayRx1.toString()!=this.storage.edit_device.delayRx1.toString()&&this.storage.edit_device.delayRx1!=undefined)
                {
                    obj.devices_list[0].delayRx1=parseFloat(this.storage.edit_device.delayRx1);
                }
                if(old_device.delayJoin1.toString()!=this.storage.edit_device.delayJoin1.toString()&&this.storage.edit_device.delayJoin1!=undefined)
                {
                    obj.devices_list[0].delayJoin1=parseFloat(this.storage.edit_device.delayJoin1);
                }
                if(old_device.drRx2.toString()!=this.storage.edit_device.drRx2.toString()&&this.storage.edit_device.drRx2!=undefined)
                {
                    obj.devices_list[0].drRx2=parseFloat(this.storage.edit_device.drRx2);
                }
                if(old_device.useDownlinkQueueClassC!=this.storage.edit_device.useDownlinkQueueClassC&&this.storage.edit_device.useDownlinkQueueClassC!=undefined)
                {
                    obj.devices_list[0].useDownlinkQueueClassC=this.storage.edit_device.useDownlinkQueueClassC;
                }
                if(old_device.serverAdrEnable!=this.storage.edit_device.serverAdrEnable&&this.storage.edit_device.serverAdrEnable!=undefined)
                {
                    obj.devices_list[0].serverAdrEnable=this.storage.edit_device.serverAdrEnable;
                }
                if(old_device.freqRx2.toString()!=this.storage.edit_device.freqRx2.toString()&&this.storage.edit_device.freqRx2!=undefined)
                {
                    obj.devices_list[0].freqRx2=parseFloat(this.storage.edit_device.freqRx2);
                }
                if(old_device.preferDr.toString()!=this.storage.edit_device.preferDr.toString()&&this.storage.edit_device.preferDr!=undefined)
                {
                    obj.devices_list[0].preferDr=parseFloat(this.storage.edit_device.preferDr);
                }
                if(old_device.preferPower.toString()!=this.storage.edit_device.preferPower.toString()&&this.storage.edit_device.preferPower!=undefined)
                {
                    obj.devices_list[0].preferPower=parseFloat(this.storage.edit_device.preferPower);
                }
                if(old_device.reactionTime.toString()!=this.storage.edit_device.reactionTime.toString()&&this.storage.edit_device.reactionTime!=undefined)
                {
                    obj.devices_list[0].reactionTime=parseFloat(this.storage.edit_device.reactionTime);
                }
                if(obj.devices_list[0].ABP!=undefined&&obj.devices_list[0].ABP.devAddress!=undefined)
                {
                    obj.devices_list[0].ABP.devAddress = hex_to_int(obj.devices_list[0].ABP.devAddress);
                }
                if(obj.devices_list[0].frequencyPlan!=undefined)
                {
                    for(var key in obj.devices_list[0].frequencyPlan)
                    {
                    obj.devices_list[0].frequencyPlan[key]=parseFloat(obj.devices_list[0].frequencyPlan[key]);
                    }
                }
                if(obj.devices_list[0].position!=undefined)
                {
                    for(var key in obj.devices_list[0].position)
                    {
                    obj.devices_list[0].position[key]=parseFloat(obj.devices_list[0].position[key]);
                    }
                }
                try{delete obj.devices_list[0].OTAA.last_join_ts;} catch(e){}
                if(this.storage.edit_device.valid_clean_OTAA()&&this.storage.edit_device.operation=='edit'&&this.storage.edit_device.edit_OTAA!=true)
                {
                    delete obj.devices_list[0].OTAA;
                }
                if(!this.storage.edit_device.valid_clean_ABP()&&this.storage.edit_device.operation=='edit'&&this.storage.edit_device.edit_ABP!=true)
                {
                    //console.log('!!!!!','Все через жопу по ABP');
                    delete obj.devices_list[0].ABP;
                }
                try
                {
                    delete obj.devices_list[0].OTAA.last_join_ts;
                }
                catch(e)
                {
                    
                }
                if( Object.keys(obj.devices_list[0]).length > 1 ) this.WS.send_json(JSON.stringify(obj));
                else $('#editDevice').modal('hide');
            }
            else
            {
                //console.log('!!!!!','СЦЕНАРИЙ 2');
                var obj = new Object();
                obj.cmd='manage_devices_req';
                obj.devices_list=[];
                obj.devices_list[0] = new Object();
                obj.devices_list[0].devEui = this.storage.edit_device.devEui;
                if(this.storage.edit_device.devName!=undefined){obj.devices_list[0].devName=this.storage.edit_device.devName;}
                obj.devices_list[0].frequencyPlan=this.storage.edit_device.frequencyPlan;
                obj.devices_list[0].ABP=this.storage.edit_device.ABP;
                obj.devices_list[0].OTAA=this.storage.edit_device.OTAA;
                delete obj.devices_list[0].OTAA.last_join_ts;
                if(this.storage.edit_device.OTAA.appEui==undefined){ 
                delete obj.devices_list[0].OTAA.appEui;
                }
                if(this.storage.edit_device.OTAA.appKey==undefined||this.storage.edit_device.OTAA.appKey=="")
                {
                    delete obj.devices_list[0].OTAA;
                }
                obj.devices_list[0].channelMask=this.storage.edit_device.channelMask;
                obj.devices_list[0].position=this.storage.edit_device.position;
                obj.devices_list[0].class=this.storage.edit_device.class;
                obj.devices_list[0].rxWindow=parseInt( this.storage.edit_device.rxWindow);
                obj.devices_list[0].delayRx1=parseFloat(this.storage.edit_device.delayRx1);
                obj.devices_list[0].delayJoin1=parseFloat(this.storage.edit_device.delayJoin1);
                obj.devices_list[0].drRx2=parseFloat(this.storage.edit_device.drRx2);
                obj.devices_list[0].serverAdrEnable=this.storage.edit_device.serverAdrEnable;
                obj.devices_list[0].useDownlinkQueueClassC=this.storage.edit_device.useDownlinkQueueClassC;
                obj.devices_list[0].freqRx2=parseFloat(this.storage.edit_device.freqRx2);
                obj.devices_list[0].preferDr=parseFloat(this.storage.edit_device.preferDr);
                obj.devices_list[0].preferPower=parseFloat(this.storage.edit_device.preferPower);
                obj.devices_list[0].reactionTime=parseFloat(this.storage.edit_device.reactionTime);
                if(obj.devices_list[0].ABP!=undefined&&obj.devices_list[0].ABP.devAddress!=undefined&&obj.devices_list[0].ABP.devAddress!=null&&obj.devices_list[0].ABP.appsKey!=undefined&&obj.devices_list[0].ABP.appsKey!='undefined'&&obj.devices_list[0].ABP.nwksKey!=undefined&&obj.devices_list[0].ABP.nwksKey!='')
                {
                    obj.devices_list[0].ABP.devAddress = hex_to_int(obj.devices_list[0].ABP.devAddress);
                }
                else
                {
                    delete obj.devices_list[0].ABP;
                }
                if(obj.devices_list[0].frequencyPlan!=undefined)
                {
                    for(var key in obj.devices_list[0].frequencyPlan)
                    {
                    obj.devices_list[0].frequencyPlan[key]=parseFloat(obj.devices_list[0].frequencyPlan[key]);
                    }
                }
                if(obj.devices_list[0].position!=undefined)
                {
                    for(var key in obj.devices_list[0].position)
                    {
                    obj.devices_list[0].position[key]=parseFloat(obj.devices_list[0].position[key]);
                    }
                }
                if(this.storage.edit_device.valid_clean_OTAA()&&this.storage.edit_device.operation=='edit'&&this.storage.edit_device.edit_OTAA!=true)
                {
                    delete obj.devices_list[0].OTAA;
                }
                if(!this.storage.edit_device.valid_clean_ABP()&&this.storage.edit_device.operation=='edit'&&this.storage.edit_device.edit_ABP!=true)
                {
                    delete obj.devices_list[0].ABP;
                }
                try
                {
                    delete obj.devices_list[0].OTAA.last_join_ts;
                }
                catch(e)
                {
                    
                }
                if( Object.keys(obj.devices_list[0]).length > 1 ) this.WS.send_json(JSON.stringify(obj));
                else $('#editDevice').modal('hide');
            }
            if(this.storage.edit_device.operation=='edit') this.edit_group_device(this.storage.edit_device.devEui,this.storage.edit_device.group);
            // this.edit_group_device(this.storage.edit_device.devEui,this.storage.edit_device.group);
        }
        else
        {
            alert('Error 1210. Fields are not filled with valid values!');
        }
    };
    if($scope.command_list_cookie.get_gateways)
    {
        $scope.type_marker='1';
    }
    else
    {
        $scope.type_marker='2';
    }
     var local_icon={
         default_ico:{},
         base_ico:{
             iconUrl:'./images/icon/b.png'
         },
         device_ico:{
              iconUrl:'./images/icon/d.png'
         }             
     };
    $scope.timer_get_base = false;
    $scope.get_base = function()
    {
        
        if(this.check_page==3||this.check_page==5)
        {
            $scope.timer_get_base = true;
             setTimeout(function(){
                $scope.timer_get_base = false;
                $scope.get_base();
                $scope.$$phase;
            },10000);
            this.WS.send_get_base();
        }
    }
    $scope.getNameTextGateway = function(id)
    {
        var arrId = id.split('+');
        var result = [];
        for(var i = 0 ; i < arrId.length; i++)
        {
            var textId = arrId[i];
            var gateway = storage.bases.bases_list[textId];
            if(gateway)
            {
                var name = gateway.name;
                result.push(name);
            }
        }
        return result.join('+');
    }
    $scope.toggle_table_data = new table_data(); 
    $scope.gateways_show = function(event)
    {
        if(event=='click')
        {
            this.check_page='3';
            this.WS.send_get_base();
            if($scope.timer_get_base==false)
            {
                 $scope.get_base();
            }
        }
        
    }
    $scope.exit=function()
    {
        $scope.WS.send_json(JSON.stringify({
            cmd:'close_auth_req',
            token:get_cookie('token')
        }));
    };
    $scope.page_auth=function()
     {
        delete_cookie('token');
        window.location='../auth.html';
     }
     $scope.count_bounds=0;
     $scope.controls={
            fullscreen:{
                position: 'topleft'
            }
        };
    $scope.testMap = function()
    {
    }
    $scope.validSelectedGateway = function()
    {
        return this.validPositionGateway(this.selectedBaseMap);
    }
    $scope.validSelectedDevice = function()
    {
        return this.validPositionDevice(this.selectedDeviceMap);
    }
    $scope.validPositionGateway = function(base)
    {
        var validBase = typeof base === 'object' && typeof base.position === 'object';
        if(!validBase) return false;
        var validPosition = base.position.latitude && base.position.longitude;
        if(!validPosition) return false;
        return true;
    }
    $scope.validPositionDevice = function(dev)
    {
        var validDev = typeof dev === 'object' && typeof dev.position === 'object';
        if(!validDev) return false;
        var validPosition = dev.position.latitude && dev.position.longitude;
        if(!validPosition) return false;
        return true;
    }
    $scope.select_base_for_map = function(base)
    {
        if(!this.validPositionGateway(base)) return;
        $scope.selectedBaseMap = base;
        $scope.type_marker='4';
        $scope.marker_show('selectedBase');
    }
    $scope.select_device_for_map = function(dev)
    {
        if(!this.validPositionDevice(dev)) return;
        $scope.selectedDeviceMap = dev;
        $scope.type_marker='5';
        $scope.marker_show('selectedDevice');
    }
    $scope.marker_show =function(event)
    {
        if(event=='click')
        {
            $scope.selectedBaseMap = undefined;
            this.check_page=5;
            $scope.type_marker='1';
            $scope.count_bounds=0;
        }
        else if ( event == 'selectedDevice' )
        {
            if(!this.validPositionDevice(this.selectedDeviceMap)) return false;
            this.check_page=5;
            $scope.count_bounds=0;
        }
        else if ( event == 'selectedBase' )
        {
            if(!this.validPositionGateway(this.selectedBaseMap)) return false;
            this.check_page=5;
            $scope.count_bounds=0;
        }
        else
        {
            $scope.selectedBaseMap = undefined;
            $scope.selectedDeviceMap = undefined;
        }
        var markers;
        var circles;
        var my_bounds=[];
        if(this.type_marker==1)
        {
            markers=$scope.storage.bases.get_markers();
            circles=$scope.storage.bases.get_circles();
        }
        if(this.type_marker==4)
        {
            markers=$scope.storage.bases.get_markers(this.selectedBaseMap);
            circles=$scope.storage.bases.get_circles(this.selectedBaseMap);
        }
        else if(this.type_marker==2)
        {
            markers=$scope.storage.devices.get_markers();
            circles=$scope.storage.devices.get_circles();
        }
        if(this.type_marker==5)
        {
            markers=$scope.storage.devices.get_markers(this.selectedDeviceMap);
            circles=$scope.storage.devices.get_circles(this.selectedDeviceMap);
        }
        else if(this.type_marker==3)
        {
            markers = {...$scope.storage.bases.get_markers(),...$scope.storage.devices.get_markers()};
            circles = {...$scope.storage.bases.get_circles(),...$scope.storage.devices.get_circles()};
        }
        for(var key in markers)
        {
            my_bounds.push([markers[key].lat,markers[key].lng]);
        }
        angular.extend($scope,{
            markers:markers,
            paths:circles
        });
        leafletData.getMap().then(function(map) {
                setTimeout(function(){
                   if($scope.count_bounds==0&&my_bounds.length>0)
                    {
                        map.fitBounds(my_bounds);
                        $scope.count_bounds++;

                    }
                },1000);
            });
    };
    angular.extend($scope,{
        markers:{},
        paths:{},
        defaults:{
            minZoom:2,
            maxZoom:18,
            tileLayerOptions:{
                reuseTiles:false
            },
		
        },
		tiles: map_tiles_leaflet,
        controls:$scope.controls,
        maxBounds: {
                  southWest: {
                    lat: 90,
                    lng: -180
                  },
                  northEast: {
                    lat: -90,
                    lng: 180
                  }
                }
    });
   
   $scope.localeSensitiveComparator = function(v1, v2) {
    if (v1.type !== 'string' || v2.type !== 'string') {
      return (v1.index < v2.index) ? -1 : 1;
    }
    if(v1.value.length==v2.value.length)
    {
        return v1.value.localeCompare(v2.value);
    } 
    else if(v1.value.length>v2.value.length)
    {
        return 1;
    }
    else
    {
        if (v1.value.localeCompare(v2.value)==-1&&(v1.value.length>=v2.value.length)) {
            return  1 ;
          }
          else if(v1.value.localeCompare(v2.value)==0)
          {
              return 0;
          }else
          {
             return -1;
          }
    }
  };
  $scope.count_click_m=0;
  $scope.magic_arr = [];
  $scope.magic_click=function()
  {
      if(this.count_click_m==undefined){this.count_click_m=0;}
      this.count_click_m++;
      if(this.count_click_m>14)
      {
          this.count_click_m=0;
      }
      $('.man').attr('src',this.magic_arr[this.count_click_m]);
      $('.man').attr('speed',this.count_click_m);
  }
  $scope.magic=function(val){

if(this.count_magic==undefined)
{
    this.count_magic=val
}
else
{
    this.count_magic+=val
}
if(this.count_magic==228)
{      $('.man').css('position','fixed');
$('.man').css('z-index','999999999');
$('.man').css('font-size','25px');
$('.man').css('width','30rem');
$('.man').css('display','block');
$('.man').attr('_left',false);
$('.man').attr('_top',false);
    $interval(function(){
 var left = parseInt($('.man').css('left').replace('px',''));
 var top = parseInt($('.man').css('top').replace('px',''));
 var _left = $('.man').attr('_left');
 var _top = $('.man').attr('_top');
 var speed = $('.man').attr('speed');
 if(speed==undefined){speed=0}
 if(_top=="false")
 {
  if(top>$('body').height())
  {
   $('.man').attr('_top',true);
  }
  else
  {
   if(5+Math.round(Math.random()*1000)>900)
   {
    $('.man').attr('_top',true);
   }
   top+=5+Math.round(Math.random()*10);
  }
 }
 else
 {
  if(top<10)
  {
   $('.man').attr('_top',false);
  }
  else
  {
   top-=8+Math.round(Math.random()*10);
  }
 }
 if(_left=='false')
 {
  if(left>$('body').width())
  {
   $('.man').attr('_left',true);
  }
  else
  {
   if(5+Math.round(Math.random()*1000)>900)
   {
    $('.man').attr('_left',true);
   }
   left+=35+Math.round(Math.random()*100);
  }
 }
 else
 {
  if(left<10)
  {
   $('.man').attr('_left',false);
  }
  else
  {
   left-=15+Math.round(Math.random()*50);
  }
 }
 
 $('.man').css('left',left+'px'); 
 $('.man').css('top',top+'px'); 
},200);}
  };
    $scope.get_ranges = function()
    {
        return {
               'For today': [moment().startOf('day'), moment().endOf('day')],
               'For yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
               'For the week': [moment().subtract(6, 'days'), moment()],
               'For 30 days': [moment().subtract(29, 'days'), moment()],
               'For the month': [moment().startOf('month'), moment().endOf('month')],
               'For the year': [moment().subtract(365, 'days'), moment().endOf('day')]
            };
    }
    $scope.update_ranges_daterangepicker = function()
    {
        $('#reportrange').data().ranges = $scope.get_ranges();
    }
  $scope.init_daterangepicker = function()
  {
        var start = moment().startOf('day');
        var end = moment().endOf('day');
        
        function cb(start, end,text,type) {
            
             switch (text) {
                case 'For today':
                start = moment().startOf('day');
                end = moment().endOf('day');
                break;
                case 'For yesterday':
                start = moment().subtract(1, 'days').startOf('day');
                end = moment().subtract(1, 'days').endOf('day');
                break;
                case 'For the week':
                start = moment().subtract(6, 'days');
                end = moment().endOf('day');
                break;
                case 'For 30 days':
                start = moment().subtract(29, 'days');
                end = moment().endOf('day');
                break;
                case 'For the month':
                start = moment().startOf('month');
                end = moment().endOf('month');
                break;
                case 'For the year':
                start = moment().subtract(365, 'days');
                end = moment().endOf('day');
                break;
                default:

                break;
            } 
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            storage.date_range.start=start.unix();
            storage.date_range.end=end.unix();
            var scope = angular.element('body').scope();
            if(type!=='apply') return;
            scope.request_data();
        }
        $('#reportrange').daterangepicker({
            startDate: start,
            endDate: end,
            opens: 'right',
            ranges: $scope.get_ranges()
        }, cb);
        $('#reportrange').on('apply.daterangepicker',function(ev,picker){
            picker.callback(picker.startDate,picker.endDate,picker.chosenLabel,ev.type);
        });
        cb(start, end);
  }
  $scope.init_daterangepicker();
}).filter('filter_history',function (){
    return function(items,data)
    {
        try{
            var date_range = data[0];
            var currentDateForFilterData = data[2];
            var temp=[];            
                for(var i in items)
                {
                    if(date_range.compare(i))
                    {
                        var time = parseInt(i);
                        if(currentDateForFilterData&&currentDateForFilterData>time)
                        {
                            continue;
                        }
                        if(data[1]==''||data[1]==undefined)
                        {
                            temp.push(items[i]);
                        }
                        else
                        {
                            data[1]=data[1].toLowerCase();
                            if((items[i].json!=undefined&&items[i].json.toString().toLowerCase().indexOf(data[1])>=0)||(items[i].ts!=undefined&&moment(items[i].ts).format('DD.MM.YYYY HH:mm:s').replace(',','').toLowerCase().indexOf(data[1])>=0))
                            {
                                temp.push(items[i]);
                            }
                        }
                    }
                }
            return temp;
        }
        catch (err)
        {
            return [];
        }
    }
}).filter('filter_bases',function (){
    return function(items)
    {
        try{
            var temp=[];            
            for(var i in items)
            {    
                temp.push(items[i]);   
            }
            return temp;
        }
        catch (err)
        {
            return [];
        }
    }
}).filter('filter_object',function (){
    return function(items)
    {
        try{
            var temp=[];            
            for(var i in items)
            {    
                temp.push(items[i]);   
            }
            return temp;
        }
        catch (err)
        {
            return [];
        }
    }
}).filter('filter_users',['storage',function (storage){
    this.storage = storage; 
    return function(items,v1)
    {
        try{
            var temp=[];            
            for(var i in items)
            {    
                items[i].pattern = v1.patterns_user.get_pattern(items[i]);
                temp.push(items[i]);   
            }
            return temp;
        }
        catch (err)
        {
            return [];
        }
    }
}]);
$(window).resize(function(){
    if(angular.element($("body")).scope().check_page==5)
    {
        $('#map').height($('#page_map').innerHeight()-($('#map_panel_1').innerHeight()+$('#map_panel_2').innerHeight()+5));
    }
});
$(window).load(function(){
    $('#map').css('min-height','600px');
    $('#map').height($('#page_map').innerHeight()-($('#map_panel_1').innerHeight()+$('#map_panel_2').innerHeight()+5));
});