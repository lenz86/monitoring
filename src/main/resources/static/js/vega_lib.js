function int_to_hex(i)
{
    var countZero=0;
    i=(i).toString(16);
    countZero = 8-i.length;
    while(countZero>0)
    {
        i='0'+i;
        countZero--;
    }
    return i;
}
function downScroll(ScrollDom,PositionDom)
{
    $(ScrollDom).scrollTop($(PositionDom).height());
}
function hex_to_int(hex)
 {
     return parseInt(hex,16);
 }
 class table_data
 {
     constructor()
     {
         this.date=true;
         this.type=true;
         this.data=true;
         this.dr=true;
         this.fcnt=true;
         this.freq=true;
         this.gatewayId=true;
         this.macData=true;
         this.packetStatus=true;
         this.port=true;
         this.rssi=true;
         this.snr=true;
         this.gatewayName=false;
     }
     reload()
     {
         this.date=true;
         this.type=true;
         this.data=true;
         this.dr=true;
         this.fcnt=true;
         this.freq=true;
         this.gatewayId=true;
         this.macData=true;
         this.packetStatus=true;
         this.port=true;
         this.rssi=true;
         this.snr=true;
         this.gatewayName=false;
         try
         {
            var savedValue =  get_cookie('table_data');
            if(savedValue)
            {
                savedValue = JSON.parse(savedValue);
                for(var key in savedValue)
                {
                    if(typeof this[key] === 'boolean' && typeof savedValue[key] === 'boolean')
                    {
                         this[key] = savedValue[key];
                    }
                }
            }
         }
         catch (e)
         {
             //
         }
     }
     save()
     {
         var currentValueJson = JSON.stringify(this);
         set_cookie('table_data',currentValueJson);
     }
 }
  class Logs
 {
    constructor(){
        this.list={};
        this.listClone={};
        this.count=0;
        this.first = undefined;
        
    }
    clear()
    {
        this.list={};
        this.listClone={};
        this.count=0;
        this.first = undefined;
    }
    clone()
    {
        this.listClone={};
        var d = 0;
        for(var key in this.list)
        {
            this.listClone[key] = this.list[key];
            d++;
        }
    }
    add(log)
    {
        var newlog = new LogConsole(log);
        if(newlog.typeLog==1)
        {
            this.list[newlog.time+'_'+newlog.uniq] = newlog;
            this.count++;
            if(this.count===1001)
            {
                for( var key in this.list)
                {
                    delete this.list[key];
                    this.count--;
                    break;
                }
            }
        }
    }
     filter(time,str,uniq)
    {
        var selectLog = this.list[time+'_'+uniq];
        if(selectLog!=undefined)
        {
            if(str!=undefined&&str!='')
            {
                try
                {
                    var str = str.toLowerCase();
                    if(selectLog.message!=undefined)
                    {
                        try
                        {
                            var mess = selectLog.message.toLowerCase();
                            if(mess.indexOf(str)<0&&moment(selectLog.time).format('DD.MM.YYYY HH:mm:s').replace(',','').indexOf(str))
                            {
                                return false;
                            }
                            else
                            {
                                return true;
                            }
                        }
                        catch(e)
                        {
                            console.log(e);
                            return false;
                        }
                    }
                    else{
                        return false;
                    }
                }
                catch(e)
                {
                    console.log(e);
                    return false;
                }
            }
            else{
                return true;
            }
        }
        else
        {
            return false;
        }
        var valid = new valid_data();
        if($scope.filter_device!=undefined&&$scope.filter_device&&$scope.filter_device!='')
        {
            var ok = false;
            if((device.devEui.toLowerCase().indexOf(this.filter_device.toLowerCase())<0&&device.devName.toLowerCase().indexOf(this.filter_device.toLowerCase())<0&&device.get_reg_info(device.devEui).toLowerCase().indexOf(this.filter_device.toLowerCase())<0&&this.convert_date(device.last_data_ts).toLowerCase().indexOf(this.filter_device.toLowerCase())<0))
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
 }
 class LogConsole
 {
     constructor(obj)
     {
         if(obj.cmd!=undefined)
         {
             if(obj.cmd=='console')
             {
                 this.typeLog=1;
                 if(obj.color!=undefined)
                 {
                    switch (obj.color) {
                        case 'common':
                            this.color = 'inherit';
                        break;
                        case 'red':
                            this.color = '#e8413d';
                        break;
                        case 'yellow':
                            this.color = '#b8a500';
                        break;
                        case 'green':
                            this.color = '#4caf50';
                        break;
                        case 'cyan':
                            this.color = '#0e9b9b';
                        break;
                        case 'purple':
                            this.color = '#9c27b0';
                        break;
                        case 'blue':
                            this.color = '#2196f3';
                        break;
                        default:
                            this.color = obj.color;
                        break;
                    }
                 }
                 else
                 {
                     this.color = 'white';
                 }
                 this.message=obj.message;
             }
             else
             {
                 this.typeLog=2;
                 this.color = 'black';
                 this.message=JSON.stringify(obj);
             }
             this.cmd=obj.cmd;
         }
         else
         {
             this.cmd='Invalid message';
             this.typeLog=3;
             this.color = '#c1c1c1';
             this.message=JSON.stringify(obj);
         }
         this.time = new Date().getTime();
         this.uniq = Math.round(Math.random()*1000);
     }
 }
 class command_list
 {
    constructor()
    {
       this.get_users=false;
       this.manage_users=false;
       this.delete_users=false;
       this.get_device_appdata=false;
       this.get_data=false;
       this.send_data=false;
       this.manage_device_appdata=false;
       this.delete_device_appdata=false;
       this.get_gateways=false;
       this.manage_gateways=false;
       this.delete_gateways=false;
       this.get_devices=false;
       this.manage_devices=false;
       this.delete_devices=false;
       this.get_coverage_map=false;
       this.get_device_downlink_queue=false;
       this.manage_device_downlink_queue=false;
       this.server_info=false;
       this.send_email=false;
       this.tx=false;
    }
    selectAll()
    {
        var valid = new valid_data();
        for(var key in this)
        {
            if(valid.isBool(this[key]))
            {
                this[key]=true;
            }
        }
    }
    unselectAll()
    {
        var valid = new valid_data();
        for(var key in this)
        {
            if(valid.isBool(this[key]))
            {
                this[key]=false;
            }
        }
    }
    set_patterns(pattern)
    {
        var valid = new valid_data();
        for(var key in pattern)
        {
            if(pattern[key]!=undefined&&valid.isBool(pattern[key])&&this[key]!=undefined&&valid.isBool(this[key]))
            {
                this[key]=pattern[key];
            }
        }
    }
    set_command_list_array(c_list)
    {
        var valid = new valid_data();
        if(c_list!=undefined&&c_list.length>0)
        {
            for(var i = 0 ; i<c_list.length;i++)
            {
                if(this[c_list[i]]!=undefined&&valid.isBool(this[c_list[i]]))
                {
                    this[c_list[i]]=true;
                }
            }  
        }
    }
    get_command_list_array()
    {
        var valid = new valid_data();
        var temp_array=[];
        for(var key in this)
        {
            if(valid.isBool(this[key]))
            {
                temp_array.push(key);
            }
        }
        return temp_array;
    }
 }
 class pattern_user
 {
    constructor(pattern)
    {
        this.command_list = new command_list();
        this.rx_settings;
        this.device_access;
        this.consoleEnable;
        this.name;
        var valid = new valid_data();
        if(pattern!=undefined&&pattern.name!=undefined)
        {
            this.name=pattern.name;
            this.command_list.set_command_list_array(pattern.command_list);
            if(valid.device_access(pattern.device_access))
            {
                this.device_access=pattern.device_access;
            }
            else
            {
                this.device_access='SELECTED';
            }
            if(valid.isBool(pattern.consoleEnable))
            {
                this.consoleEnable=pattern.consoleEnable;
            }
            else
            {
                this.consoleEnable=false;
            }
            if(pattern.rx_settings!=undefined&&valid.isBool(pattern.rx_settings.unsolicited))
            {
               this.rx_settings={unsolicited:pattern.rx_settings.unsolicited};
               if(valid.direction(pattern.rx_settings.direction))
               {
                   this.rx_settings.direction=pattern.rx_settings.direction;
               }
               if(valid.isBool(pattern.rx_settings.withMacCommands))
               {
                   this.rx_settings.withMacCommands=pattern.rx_settings.withMacCommands;
               }
            }
        }
    }
 }
 class patterns_user
 {
    constructor()
    {
         this.list = new Object();
    }
    add_pattern(pattern)
    {
        this.list[pattern.name]=new pattern_user(pattern);
    }
    get_pattern(user)
    {
        if(user!=undefined)
        {
            for(var i in this.list)
            {
                if(this.list[i]!=undefined)
                {
                    var indetity = true;
                    for(var key in this.list[i].command_list)
                    {
                        if(this.list[i].command_list[key]!=user.command_list[key])
                        {
                            indetity=false;
                        }
                    }
                    for(var key in this.list[i].rx_settings)
                    {
                        if(this.list[i].rx_settings[key]!=user.rx_settings[key])
                        {
                            indetity=false;
                        }
                    }
                    if(this.list[i].device_access!=user.device_access)
                    {
                        indetity=false;
                    }
                    if(this.list[i].consoleEnable!=user.consoleEnable)
                    {
                        indetity=false;
                    }
                    if(indetity)
                    {
                        return  this.list[i];
                    }
                }
            }
            return false;
        }
        return false;
    }
 }
 class user
 {
     constructor(obj)
     {
         this.login;
         this.password;
         this.token;
         this.command_list = new command_list();;
         this.device_access='FULL';
         this.consoleEnable=false;
         this.devEui_list=[];
         this.edit=false;
         this.rx_settings={
             unsolicited:false,
             direction:'ALL',
             withMacCommands:false
         };
         if(obj!=undefined)
         {
            var valid = new valid_data();
            for(var key in obj)
            {
                if(obj[key]!=undefined)
                {
                   if(key=='login')
                   {
                      this[key] = obj[key];
                   }
                   if(key=='password')
                   {
                      this[key] = obj[key];
                   }
                   if(key=='token')
                   {
                      this[key] = obj[key];
                   }
                   if(key=='password')
                   {
                      this[key] = obj[key];
                   }
                   if(key=='command_list')
                   {
                      this.command_list.set_command_list_array(obj[key]);
                   }
                   if(key=='devEui_list'&&obj[key]!=undefined&&obj[key].length>0)
                   {
                       this[key]=obj[key];
                   }
                   if(key=='device_access'&&valid.device_access(obj[key]))
                   {
                       this[key]=obj[key];
                   }
                   if(key=='consoleEnable'&&valid.isBool(obj[key]))
                   {
                       this[key]=obj[key];
                   }
                   if(key=='rx_settings')
                   {
                       if(obj[key]!=undefined&&valid.isBool(obj[key].unsolicited))
                       {
                          this[key]={unsolicited:obj[key].unsolicited};
                          if(valid.direction(obj[key].direction))
                          {
                              this[key].direction=obj[key].direction;
                          }
                          if(valid.isBool(obj[key].withMacCommands))
                          {
                              this[key].withMacCommands=obj[key].withMacCommands;
                          }
                       }
                   }
                }
            }
        }
     }
     get_pattern()
     {
         return true;
     }
     get_for_send()
     {
        var tempObj={login:this.login};
        if(this.edit==undefined||!this.edit)
        {
            tempObj.password = this.password;
        }
        tempObj.command_list=[];
        for(var key in this.command_list)
        {
            if(this.command_list[key]===true)
            {
                tempObj.command_list.push(key)
            }
        }
        tempObj.device_access=this.device_access;
        tempObj.consoleEnable=this.consoleEnable;
        if(tempObj.device_access=='SELECTED')
        {
            tempObj.devEui_list=this.devEui_list;
        }
        tempObj.rx_settings = new Object();
        if(this.rx_settings.unsolicited===true)
        {
            tempObj.rx_settings=this.rx_settings;
            
        }
        else
        {
            tempObj.rx_settings.unsolicited=false;
        }
        return tempObj;
     }
     valid()
     {
         var valid = new valid_data();
         if(valid.valid(this.login))
         {
             if(this.edit)
             {
                 return true;
             }
             else 
             {
                 if(valid.valid(this.password))
                 {
                     return true;
                 }
                 else
                 {
                     return false;
                 }
             }
         }
         else
         {
             return false;
         }
     }
     checkDevEui(devEui)
     {
        if(this.devEui_list.indexOf(devEui)==-1) return false;
        return true;
     }
    add_devEui_notAlert(devEui)
    {
        var valid = new valid_data();
        if(valid.devEui(devEui))
        {
            if(this.devEui_list.indexOf(devEui)==-1)
            {
                this.devEui_list.push(devEui);
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
    add_devEui(devEui)
    {
        var valid = new valid_data();
        if(valid.devEui(devEui))
        {
            if(this.devEui_list.indexOf(devEui)==-1)
            {
                this.devEui_list.push(devEui);
                return true;
                
            }
            else
            {
                alert('DevEui is already added');
                return false;
            }
            
        }
        else
        {
            alert('Not valid devEui!');
            return false;
            
        }
    }
    del_devEui(devEui)
    {
        var index=this.devEui_list.indexOf(devEui);
        if(index!=-1)
        {
            this.devEui_list.splice(index,1);
        }
        else
        {
        }
    }
 }
 class users
 {
     constructor()
     {
         this.list=new Object();
     }
     set_user(obj)
     {
         if(obj!=undefined&&obj.login!=undefined)
         {
             this.list[obj.login]=new user(obj);
         }
     }
     get_count()
     {
       var count=0;
       for(var key in this.list)
       {
            if(this.list[key].login != undefined)
            {
                count++;
            }
       }
       return count;
     }
 }
 class sticky
{
    constructor()
    {
        this.statistics =false;
        this.chart_t = false;
        this.chart_c = true;
        this.data = true;
    }
    toogle(str)
    {
        this[str]=true;
        for(var key in this)
        {
            if(key!=str)
            {
                this[key]=false;
            }
        }
        if(this[str])
        {
            
        }
    }
}
class vega_converter
{
    constructor(){}
    round_size(num,decimal)
    {
        if(decimal==undefined||decimal<=0)
        {
            decimal = 1;
        }
        var decimal = Math.pow(10,decimal);
        return(Math.round(num*decimal)/decimal);
    }
    
}
class report_consum
{
    constructor()
    {
        this.level_1=[];
        this.level_2=[];
        this.type_channel = [];
        this.device = [];
        this.channel = [];
        this.date_range = new date_range();
        this.interval;
        this.good_devices=[];
    }
    check_all_channel_report()
    {
        
        for(var i=0;i<this.channel.length;i++)
        {
            this.channel[i].tick=true;
        }
    }
    none_all_channel_report()
    {
        for(var i=0;i<this.channel.length;i++)
        {
            this.channel[i].tick=false;
        }
    }
    get()
    {
        return this.channel;
    }
        
   
    //преобразовывать
    search_device()
    {
    }
}

class valid_data 
{
    constructor()
    {
        
    }
    device_access(str)
    {
        if(this.valid(str))
        {
            if(str=='FULL'||str=='SELECTED')
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
    direction(str)
    {
        if(this.valid(str))
        {
            if(str=='UPLINK'||str=='DOWNLINK'||str=='ALL')
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
    oneortwo(num)
    {
        return (num==1||num==2)?true:false;
    }
    num1_15(num)
    {
        return (this.isInt(num)&&(num>=1&&num<=15))?true:false;
    }
    num0_5(num)
    {
        return (this.isInt(num)&&(num>=0&&num<=5))?true:false;
    }
    preferPower(num)
    {
        return (this.isInt(num))?true:false;
    }
    bit32(num)
    {
        if(num<33554431&&num>=0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    isParity(num)
    {
       if(this.isInt(num)&&num % 2 === 0)
       {
           return true;
       }
       else
       {
            return false;
       }
    }
    isData(data)
    {
        if(this.simbol16(data)&&data.length<=444&&this.isParity(data.length))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    isPort(num)
    {
        if(this.isInt(num)&&num>=0&&num<=255)
        {
            return true
        }
        else
        {
            return false;
        }
    }
    device_class(str)
    {
        if(str=="CLASS_A"||str=="CLASS_C")
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    simbol16(str)
    {
        if(str!=undefined&&str!="")
        {
            for(var i =0; i <str.length;i++)
            {
               if(! ((str[i].charCodeAt()>=48&&str[i].charCodeAt()<=57)||(str[i].charCodeAt()>=65&&str[i].charCodeAt()<=70)||(str[i].charCodeAt()>=97&&str[i].charCodeAt()<=102)))
               { 
                   return false;
               }
              
            }
            return true;
        }
        else
        {
            return false;
        }
    }
    devAddress(num)
    {
        if(this.simbol16(num))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    byte16(str)
    {
        if(str!=undefined&&str.length==32)
        {
          return  this.simbol16(str);
        }
        else
        {
            return false;
        }
    }
     byte8(str)
    {
        if(str!=undefined&&str.length==16)
        {
          return  this.simbol16(str);
        }
        else
        {
            return false;
        }
    }
    valid(str)
    {
        if(str!=undefined&&str.length>0)
        {
            return true;
        }
        else
        {
            return false;
        }
        
    }
    name(str)
    {
        if(this.valid(str)&&str.length<=25)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    comment(str)
    {
        if(this.valid(str)&&str.length<=200)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    address(str)
    {
        if(this.valid(str)&&str.length<=200)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    isInt(str)
    {
        if(this.isNumber(str)&&str % 1 == 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    devEui(str)
    {
        return (this.valid(str)&&str.length==16);
    }
    isFrequency(num)
    {
        if((this.isNumber(num)&&num<=1500000000&&num>=430000000)||num==0||num=='0')
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    isNumber(str)
    {
        if(str!=undefined&&!isNaN(parseFloat(str))&&str!=='')
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    isBool(str)
    {
        if(typeof(str)=="boolean")
        {
            return true;
        }
        else return false;
    }
    isDate(str)
    {
        if(str!=undefined)
        {
            try
            {
                var date = Math.abs(new Date(str).getTime());
                if(date>0&&this.isInt(date))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch(err)
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
}
class edit_device
{
    constructor(type)
    {
        this.device = new device();
        this.level_1 = new Object();
        this.level_2;
        this.num_channel;
        this.status;
        this.color = new Object();
        this.info_channel;
        this.init_value;
        this.name;
        this.type_channel = new Object();
        this.division;
        this.history;
        this.calib_interval;
        this.title = 'Создание нового устройства';
        this._init_status=false;
        this.type=type;
    }
    
    valid()
    {
        var valid = new valid_data();
        if(this.type_channel.type==1)
        {
             try
            {
                this.init_value = this.init_value.replace(/,/,'.');
                this.division = this.division.replace(/,/,'.');
            }
            catch(err)
            {
                return false;
            }
            if(valid.devEui(this.device.devEui)&&valid.comment(this.info_channel)&&valid.isInt(this.type_channel.id)&&valid.isNumber(this.division)&&valid.isNumber(this.init_value)&&valid.isDate(this.last_date)&&valid.name(this.level_1.name_level_1)&&valid.name(this.level_2)&&valid.name(this.name)&&valid.address(this.level_1.address_level_1)&&valid.isInt(this.num_channel)&&valid.isInt(this.status)&&valid.isInt(this.color.id)&&valid.isInt(this.calib_interval))
            {
                return true;
            }
            else
            {
                return false;
            }
        }else if(this.type_channel.type==2)
        {
            if(valid.devEui(this.device.devEui)&&valid.comment(this.info_channel)&&valid.isInt(this.type_channel.id)&&valid.name(this.level_1.name_level_1)&&valid.name(this.level_2)&&valid.name(this.name)&&valid.address(this.level_1.address_level_1)&&valid.isInt(this.num_channel)&&valid.isInt(this.status)&&valid.isInt(this.color.id))
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
            console.log('No type');
            return false;
        }
    }
    refresh()
    {
        try{
            if(!this.level_1.name_level_1.name_level_1||this.level_1.name_level_1.name_level_1==undefined)
            {
                return true;
            }
            else
            {
               if(this.level_1.name_level_1.address_level_1&&this.level_1.name_level_1.address_level_1!=undefined)
                {
                    this.level_1.address_level_1=this.level_1.name_level_1.address_level_1;
                }
                this.level_1.name_level_1=this.level_1.name_level_1.name_level_1;
            }
        }
        catch (err)
        {
            return false;
        }
    }
    init()
    {
        if(!this._init_status)
        {
            this.device = new device();
            this.level_1.address_level_1 = '';
            this.level_1.name_level_1 = '';
            this.level_2 = '';
            this.num_channel = '';
            this.status = '';
            this.color = '';
            this.info_channel = '';
            this.init_value = '';
            this.name = '';
            this.type_channel = '';
            this.division = '';
            this.history = '';
            this.calib_interval='';
            this._init_status=true
        }
        return true;
    }
}
class type_channels
{
    constructor(arr_type)
    {
        this.list = arr_type;
    }
    //Поиск типа по id
    get_type_channel(id){
        try
        {
            for(var i =0;i<this.list.length;i++)
           {
               if(this.list[i].id==id)
               {
                   return this.list[i];
               }
           }
           return false;
        }
        catch (err)
        {
            return false;
        }
    };
}
class status_channel_list
{
    constructor(list)
    {
        this.list = list;
    }
    get_status(id)
   {
       try
       {
        for(var i =0;i<this.list.length;i++)
        {
            if(this.list[i].id==id)
            {
                return this.list[i].name;
            }
        }
        return "-";
       }
        catch (err)
        {
            return false;
        }
   };
}
class color_list
{
    constructor(list)
    {
        this.list = list;
    }
    get_color(id)
   {
       try
       {
        for(var i =0;i<this.list.length;i++)
        {
            if(this.list[i].id==id)
            {
                return this.list[i].hex;
            }
        }
        return "transparent";
       }
        catch (err)
        {
            return false;
        }
   };
   get_full_color(id)
   {
        try
       {
        for(var i =0;i<this.list.length;i++)
        {
            if(this.list[i].id==id)
            {
                return this.list[i];
            }
        }
        return "transparent";
       }
        catch (err)
        {
            return false;
        }
   }
  
}
class channel
{
    constructor(address_level_1,name_level_1,level_2,name,num_channel,status,color,info_channel,init_value,last_date,type_channel,history,division,calib_interval)
    {
       this.address_level_1 =address_level_1;
       this.name_level_1 =name_level_1;
       this.level_2 =level_2;
       this.name =name;
       this.num_channel =num_channel;
       this.status =status;
       this.color =color;
       this.info_channel =info_channel;
       this.init_value =init_value;
       this.last_date =last_date;
       this.calib_interval=calib_interval;
       this.type_channel =type_channel;
       this.history =history;
       this.division =division;
       this.statistics=new Statistic();
       this.danger=false;
    }
    clear_history()
    {
    }
    edit(address_level_1,name_level_1,level_2,name,status,color,info_channel,init_value,last_date,type_channel,division,calib_interval)
    {
       this.address_level_1 =address_level_1;
       this.name_level_1 =name_level_1;
       this.level_2 =level_2;
       this.name =name;
       this.status =status;
       this.color =color;
       this.info_channel =info_channel;
       this.init_value =init_value;
       this.last_date =last_date;
       this.calib_interval=calib_interval;
       this.type_channel =type_channel;
       this.division =division;
    }
}
class date_range
{
    constructor()
    {
        this.start;
        this.end;
    }
     //Находится ли дата в пределе заданного периода
    compare_unix(date)
    {
        return (date>this.start&&date<this.end)?true:false;  
    }
    compare(date)
    {
        return (date>(this.start*1000)&&date<(this.end*1000))?true:false;  
    }
    compare_full(history,date_range)
    {
        return (history.time>date_range.start&&history.time<date_range.end)?true:false;  
    }
}
class Statistic
{
    constructor()
    {
       this.sum_sensor='-';
       this.chart =[];
       this.chart_temperature =[];
       this.rssi =[];
       this.snr =[];
       this.date =[];
       
       this.consumed = 0;
       this.avr_snr=0;
       this.avr_rssi=0;
       this.fcnt=0;
       this.last_time =0;
       this.last_chart =0;
       this.last_fcnt =0;
       this.last_sensor =0;
       this.start_sensor=0;
       this.end_sensor=0;
       this.arr_date =[];
       this.arr_rssi = [];
       this.connect = [];
       this.arr_snr = [];
       this.type_channel =0;
       this.arr_value =[];
       this.count_danger=0;
       this.count_danger_full=0;
    }
  
}
class Position{
    constructor(long,lat,alt)
    {
        if(long==undefined||lat==undefined)
        {
            long=0;
            lat=0;
        }
        if(alt==undefined)
        {
            alt=0;
        }
        this.longitude=long;
        this.latitude=lat;
        this.altitude=alt;
    }
}
class base
{
    constructor(obj)
    {
        if(obj!=undefined&&obj&&obj.gatewayId!=undefined&&obj.gatewayId)
        {
            this.maxPower=obj.maxPower;
            this.gatewayId=obj.gatewayId;
            this.extraInfo=obj.extraInfo;
            this.active=obj.active;
            this.latency=obj.latency;     
            try 
            {
                var extraInfo = JSON.parse(this.extraInfo);
                this.name = extraInfo.name;
                this.comment = extraInfo.comment;
            }
            catch(e)
            {
                this.name = this.extraInfo;
                this.comment = '';
            }
            if(obj.downlinkChannel==undefined)
            {
                this.downlinkChannel='0';
            }
            else
            {
                this.downlinkChannel=obj.downlinkChannel.toString();
            }
            if(obj.rxOnly==undefined)
            {
                this.rxOnly=false;
            }
            else
            {
                this.rxOnly=obj.rxOnly;
            }
           
            this.companionGateway=obj.companionGateway;
            if(obj.position!=undefined&&obj.position)
            {
                this.position = new Position(obj.position.longitude,obj.position.latitude,obj.position.altitude);
            }
            
            else
            {
                this.position = new Position();
            }
        }
        else
        {
            this.gatewayId;
            this.extraInfo;
            this.active;
            this.latency;
            this.downlinkChannel='0';
            this.rxOnly=false;
            this.companionGateway;
            this.maxPower='14';
            this.position = new Position();
        }
    }
    get_edit_params()
    {
        return {
            gatewayId: this.gatewayId,
            extraInfo: this.extraInfo,
            downlinkChannel:this.downlinkChannel,
            rxOnly:this.rxOnly,
            companionGateway:this.companionGateway,
            position:this.position,
            maxPower:this.maxPower,
            name:this.name,
            comment:this.comment
        };
        
    }
    valid_data()
    {
        var valid = new valid_data();
        if(this.gatewayId!=undefined)
        {
            if(this.rxOnly==true&&!valid.byte8(this.companionGateway))
            {
            return false;
            }
            return true;
        }
        else
        {
            return false;
        }
    }
    
}
class bases
{
    constructor()
    {
        this.bases_list= new Object();
        this.bases_list.toArray = function (gatewayId){
            var temp = [];
            for(var key in this)
            {
                if(gatewayId!=key)
                {
                    temp.push(this[key]);
                }
            }
            return temp;
        };
    }
    clear()
    {
        this.bases_list= new Object();
    }
    get_count_bases()
    {
       var count=0;
       for(var key in this.bases_list)
       {
            if(this.bases_list[key].gatewayId != undefined)
            {
                count++
            }
       }
       return count;
    }
    add_base(obj)
    {
        var newBS = new base(obj);
        var oldBS = this.bases_list[obj.gatewayId];
        if(!oldBS)
        {
            this.bases_list[obj.gatewayId]=newBS;
        }
        else
        {
            for(var key in newBS)
            {
                oldBS[key] = newBS[key];
            }
        }
    }
    get_markers(base)
    {
        var temp = new Object();
        if(base)
        {
            temp[key] = {
                lat:base.position.latitude,
                lng:base.position.longitude,
                message: base.name + ' ('+base.gatewayId+')',
                icon:{
                    iconUrl:'./images/icon/b.png',
                    iconSize:[34,41],
                    shadowSize:[50,64],
                    iconAnchor:[17,14],
                    shadowAnchor:[4,14]
                }
            };
        }
        else
        {
            for(var key in this.bases_list)
            {
                if(this.bases_list[key]!=undefined&&this.bases_list[key].position!=undefined&&this.bases_list[key].position.latitude!=undefined&&this.bases_list[key].position.longitude!=undefined)
                {
                    if(this.bases_list[key].position.longitude==this.bases_list[key].position.latitude&&this.bases_list[key].position.latitude==0)
                    {
                        
                    }
                    else
                    {
                        temp[key] = {
                            lat:this.bases_list[key].position.latitude,
                            lng:this.bases_list[key].position.longitude,
                            message: this.bases_list[key].name + ' ('+this.bases_list[key].gatewayId+')',
                            icon:{
                                iconUrl:'./images/icon/b.png',
                                iconSize:[34,41],
                                shadowSize:[50,64],
                                iconAnchor:[17,14],
                                shadowAnchor:[4,14]
                            }
                        };
                    }
                }
            }
        }
        return temp;
    }
    get_circles(base)
    {
        var temp = new Object();
        if(base)
        {
            var latlngs = {
                lat:base.position.latitude,
                lng:base.position.longitude
            };
            temp[key] = {
                
                type: "circle",
                radius: 5000,
                fillOpacity:0.2,
                fillColor:'#02d5b9',
                stroke:false,
                latlngs:latlngs
                
            };
            temp[key+'228'] = {
                
                type: "circle",
                radius: 2000,
                fillOpacity:0.3,
                fillColor:'#0cb8e2',
                stroke:false,
                latlngs:latlngs
                
            };
            if(!base.active)
            {
                temp[key+'228'].fillColor="#f55e87";
                temp[key].fillColor="#e20c0c";
            }
        }
        else
        {
            for(var key in this.bases_list)
            {
                if(this.bases_list[key]!=undefined&&this.bases_list[key].position!=undefined&&this.bases_list[key].position.latitude!=undefined&&this.bases_list[key].position.longitude!=undefined)
                {
                    if(this.bases_list[key].position.longitude==this.bases_list[key].position.latitude&&this.bases_list[key].position.latitude==0)
                    {
                        
                    }
                    else
                    {
                        var latlngs = {
                            lat:this.bases_list[key].position.latitude,
                            lng:this.bases_list[key].position.longitude
                        };
                        temp[key] = {
                            
                            type: "circle",
                            radius: 5000,
                            fillOpacity:0.2,
                            fillColor:'#02d5b9',
                            stroke:false,
                            latlngs:latlngs
                            
                        };
                        temp[key+'228'] = {
                            
                            type: "circle",
                            radius: 2000,
                            fillOpacity:0.3,
                            fillColor:'#0cb8e2',
                            stroke:false,
                            latlngs:latlngs
                            
                        };
                        if(!this.bases_list[key].active)
                        {
                            temp[key+'228'].fillColor="#f55e87";
                            temp[key].fillColor="#e20c0c";
                        }
                    }
                }
            }
        }
        return temp;
    }
}
class Devices 
{
    constructor()
    {
        this.devices_list=new Object();
        this.group_list=new Object();
        this.select_device_devEui='';//Выбранное устройство
        this.devices_list.toArray = function (devEui,type){
            var temp = [];
            var items = {};
            for(var key in this)
            {
                if(devEui!==undefined&&devEui!=key)
                {
                    temp.push(this[key]);
                }
                else if(devEui===undefined&&typeof this[key] === 'object'&&this[key][type]!==undefined&&!items[this[key][type]])
                {
                    items[this[key][type]] = true;
                    temp.push(this[key]);
                }
                else if(devEui===undefined&&type===undefined&&typeof this[key] === 'object')
                {
                    temp.push(this[key]);
                }
            }
            return temp;
        };
    }
    selectGroup(nameGroup)
    {
        for(var i = 0;i<this.group_list.length;i++)
        {
            var group = this.group_list[i];
            if(group.title == nameGroup)
            {
                group.toggle = true;
            }
            else
            {
                group.toggle = false;
            }
        }
    }
    countSelectedGroup()
    {
        var count = 0;
        for(var i = 0;i<this.group_list.length;i++)
        {
            var group = this.group_list[i];
            if(group.toggle)count++;
        }
        return count;
    }
    unselectAllGroup()
    {
        for(var i = 0;i<this.group_list.length;i++)
        {
            var group = this.group_list[i];
            group.toggle = false;
        }
    }
    groupingDevice()
    {
        var oldList = this.group_list;
        var oldGrups = {};
        for (var i = 0; i<oldList.length;i++)
        {
            var group = oldList[i].title;
            oldGrups['group_'+group] = oldList[i];
        }
        var groups = {};
        for(var key in this.devices_list)
        {
            var dev = this.devices_list[key];
            if(typeof dev === 'object')
            {
                var devEui = dev.devEui.toString().toLowerCase();
                var group = dev.group!==undefined&&dev.group!==''?dev.group:'Other';
                var id = 0;
                if(!groups['group_'+group])
                {
                    groups['group_'+group] = {
                        devices:[],
                        id:id,
                        toggle:oldGrups['group_'+group]!==undefined?oldGrups['group_'+group].toggle:false,
                        title:group 
                    };
                    id++;
                }
                groups['group_'+group].devices.push(dev);
            }
        }
        var arr = [];
        for(var key in groups)
        {
            if(key=='group_Other'&&arr[0])
            {
                var first=arr[0];
                arr[0]=groups[key];
                arr.push(first);
            }
            else
            {
                arr.push(groups[key]);
            }
        }
        if(arr.length>0&&typeof arr[0] ==='object'&&arr[0].title == 'Other')
        {
            var temp = arr[0];
            arr.splice(0,1);
            arr.push(temp);
        }
        this.group_list = arr;
    };
    get_markers(dev)
    {
        var temp = new Object();
        if(dev)
        {
            temp[key] = {
                lat:dev.position.latitude,
                lng:dev.position.longitude,
                message: dev.devName + ' (' + dev.devEui+')',
                icon:{
                    iconUrl:'./images/icon/d.png',
                    iconSize:[34,41],
                    shadowSize:[50,64],
                    iconAnchor:[17,14],
                    shadowAnchor:[4,14]
                }
            };
        }
        else
        {
            for(var key in this.devices_list)
            {
                if(this.devices_list[key]!=undefined&&this.devices_list[key].position!=undefined&&this.devices_list[key].position.latitude!=undefined&&this.devices_list[key].position.longitude!=undefined)
                {
                    if(this.devices_list[key].position.longitude==this.devices_list[key].position.latitude&&this.devices_list[key].position.latitude==0)
                    {
                        
                    }
                    else
                    {
                        temp[key] = {
                            lat:this.devices_list[key].position.latitude,
                            lng:this.devices_list[key].position.longitude,
                            message: this.devices_list[key].devName + ' (' + this.devices_list[key].devEui+')',
                            icon:{
                                iconUrl:'./images/icon/d.png',
                                iconSize:[34,41],
                                shadowSize:[50,64],
                                iconAnchor:[17,14],
                                shadowAnchor:[4,14]
                            }
                        };
                    }
                }
            }
        }
        return temp;
    }
    get_circles(dev)
    {
        var temp = new Object();
        for(var key in this.devices_list)
        {
            if(this.devices_list[key]!=undefined&&this.devices_list[key].position!=undefined&&this.devices_list[key].position.latitude!=undefined&&this.devices_list[key].position.longitude!=undefined)
            {
                if(this.devices_list[key].position.longitude==this.devices_list[key].position.latitude&&this.devices_list[key].position.latitude==0)
                {
                    
                }
                else
                {
                }
            }
        }
        return temp;
    }
    get_count_devices()
    {
        var count=0;
       for(var key in this.devices_list)
       {
            if(this.devices_list[key].devEui != undefined)
            {
                count++
            }
       }
       return count;
    }
    
}
class cell_history
{
    constructor(mess)
    {
        var my_conver = new vega_converter();
        if(mess.rssi!=undefined)
        {
            mess.rssi = my_conver.round_size(mess.rssi,2);
        }
        if(mess.snr!=undefined)
        {
            mess.snr = my_conver.round_size(mess.snr,2);
        }
        this.ts=mess.ts;
        this.gatewayId=mess.gatewayId;
        if(this.gatewayId==undefined&&mess.macBs!=undefined)
        {
            this.gatewayId = mess.macBs;
        }
        this.ack=mess.ack;
        this.fcnt=mess.fcnt;
        this.port=mess.port;
        this.data=mess.data;
        this.macData=mess.macData;
        this.freq=mess.freq;
        this.dr=mess.dr;
        this.rssi=mess.rssi;
        this.snr=mess.snr;
        this.type=mess.type;
        this.packetStatus=mess.packetStatus;
        this.json = angular.toJson(mess);
        
    }
    get_json()
    {
        return angular.toJson(this);
    }
    get_ts()
    {
        return moment(this.ts).format('DD.MM.YYYY HH:mm:s').replace(',','');
    }
}

class device 
{
    constructor(){
        this.freqplan_patterns = [
            [869525000,867100000,867300000,867500000,867700000,867900000],
            [869100000,864100000,864300000,864500000,864700000,864900000],
            [867500000,867100000,867300000,867500000,867700000,867900000,'2']
        ];
        this.devEui;
        this.group;
        this.devName;
        this.valid = new valid_data();
        this.ABP = {
            devAddress:undefined,
            appsKey:undefined,
            nwksKey:undefined
        };
        this.OTAA = {
            appEui:undefined,
            appKey:undefined,
            last_join_ts:0
        };
        this.frequencyPlan = {
            freq4:this.freqplan_patterns[0][1],
            freq5:this.freqplan_patterns[0][2],
            freq6:this.freqplan_patterns[0][3],
            freq7:this.freqplan_patterns[0][4],
            freq8:this.freqplan_patterns[0][5]
        };
        this.channelMask = {
            channel1En:true,
            channel2En:true,
            channel3En:true,
            channel4En:true,
            channel5En:true,
            channel6En:true,
            channel7En:true,
            channel8En:true,
            channel9En:false,
            channel10En:false,
            channel11En:false,
            channel12En:false,
            channel13En:false,
            channel14En:false,
            channel15En:false,
            channel16En:false,
        };
        this.position = {
            longitude:0,
            latitude:0,
            altitude:0
        };
        this.class;
        this.rxWindow='1';
        this.delayRx1='1';
        this.delayJoin1='5';
        this.drRx2='0';
        this.freqRx2=this.freqplan_patterns[0][0];
        this.adr;
        this.preferDr='5';
        this.preferPower='14';
        this.fcnt_up;
        this.fcnt_down;
        this.last_data_ts;
        this.lastRssi;
        this.lastSnr;
        this.totalNum;
        this.reactionTime=1000;
        this.pattern = '1';
        this.history=new Object();
        this.history_last = new cell_history({});
        this.last_req_data=new Object();
        this.useDownlinkQueueClassC = false;
        this.serverAdrEnable = true;
        
    }
    count_history(date)
    {
        var count =0;
        for(var i in this.history)
        {
       
            if(i>=date.start*1000&&i<=date.end*1000)
            {
                
                count++;
            }
        }
        return count;
    }
    statistics_history(date)
    {
        var my_converter = new vega_converter();
        var connect=[];
        var count =0;
        var avr_snr = {
            sum:0,
            count:0
        };
        var avr_rssi = {
            sum:0,
            count:0
        };
        for(var i in this.history)
        {
            if(i>=date.start*1000&&i<=date.end*1000)
            {
                if(this.history[i].snr!=undefined)
                {
                    avr_snr.sum+=this.history[i].snr;
                    avr_snr.count++;
                }
                if(this.history[i].rssi!=undefined)
                {
                    avr_rssi.sum+=this.history[i].rssi;
                    avr_rssi.count++;
                }
                connect.push({date: this.history[i].ts,rssi: my_converter.round_size(this.history[i].rssi,2),snr:my_converter.round_size(this.history[i].snr,2)});
                count++;
            }
        }
        return {
            avr_snr: my_converter.round_size((avr_snr.sum/avr_snr.count),2),
            avr_rssi: my_converter.round_size((avr_rssi.sum/avr_rssi.count),2),
            connect:connect
        };
    }
    add_history(json,totalNum)
    {   
        var add_history_cell = new cell_history(json);
        this.history[json.ts]=add_history_cell;
        if((this.history_last.ts!=undefined&&json.ts!=undefined&&json.ts>this.history_last.ts)||(this.history_last.ts==undefined&&json.ts!=undefined))
        {
            this.history_last=add_history_cell;
            if(totalNum!=undefined)
            {
                this.totalNum=totalNum;
            }
            else
            {
                 
                if(this.totalNum!=undefined)
                {
                    this.totalNum++;
                }
                else
                {
                    this.totalNum=1;
                }
            }
        }
    } 
    valid_data()
    {
        if(this.valid_reg_data()&&((this.valid_clean_ABP()||this.valid_clean_OTAA())||(!this.valid_clean_OTAA()&&!this.valid_clean_ABP())))
        {
            if((this.valid.valid(this.devName)||this.devName==undefined||this.devName=="")&&this.valid.devEui(this.devEui)&&this.valid.device_class(this.class))
            {
               if((this.valid.isNumber(this.position.longitude)||this.position.longitude==0||this.position.longitude=="")&&(this.valid.isNumber(this.position.latitude)||this.position.latitude==0||this.position.latitude=="")&&(this.valid.isNumber(this.position.altitude)||this.position.altitude==0||this.position.altitude==""))
               {
                   var ok = true;
                   for(var key in this.frequencyPlan)
                   {
                       if(!this.valid.isFrequency(this.frequencyPlan[key]))
                       {
                           ok=false;
                           break;
                       }
                   }
                   if(!ok)
                   {
                       console.log('Error  frequencyPlan');
                       return false;
                   }
                   else {
                       if(this.valid.isBool(this.useDownlinkQueueClassC)&&this.valid.isBool(this.serverAdrEnable)&&this.valid.oneortwo(this.rxWindow)&&this.valid.isNumber(this.reactionTime)&&this.valid.num1_15(this.delayRx1)&&this.valid.num1_15(this.delayJoin1)&&this.valid.num0_5(this.drRx2)&&this.valid.preferPower(this.preferPower))
                       {
                           
                               return true;
                           
                       }
                       else
                       {
                           console.log('Error информации для добовления');
                           return false;
                       }
                   }
               }
               else
               {
                    console.log('Error  position');
                    return false;
               }
            }
            else
            {
                console.log('Error main setting');
                return false;
            }
            
        }
        else
        {
            console.log('Error в регистрационной информации');
            return false;
        }
    }
    frequency_change(num)
    {
        var frequencyPlan = this.frequencyPlan;
        if(num='pattern')
        {
            for(var key in frequencyPlan)
            {
                var num = key.replace('freq','');
                var freq = frequencyPlan[key];
                if(freq==0)
                {
                    this.channelMask['channel'+num+'En'] = false;
                }
                else
                {
                     this.channelMask['channel'+num+'En'] = true;
                }
            }
        }
        else
        {
            var freq = frequencyPlan['freq'+num];
            if(freq==0)
            {
                this.channelMask['channel'+num+'En'] = false;
            }
        }
    }
    check_pattern()
    {
        if(this.pattern!=4)
        {
            this.freqRx2=this.freqplan_patterns[this.pattern-1][0];
            this.frequencyPlan.freq4=this.freqplan_patterns[this.pattern-1][1];
            this.frequencyPlan.freq5=this.freqplan_patterns[this.pattern-1][2];
            this.frequencyPlan.freq6=this.freqplan_patterns[this.pattern-1][3];
            this.frequencyPlan.freq7=this.freqplan_patterns[this.pattern-1][4];
            this.frequencyPlan.freq8=this.freqplan_patterns[this.pattern-1][5];
            if(this.freqplan_patterns[this.pattern-1][6]) this.drRx2=this.freqplan_patterns[this.pattern-1][6];
            this.frequency_change('pattern');
        }
      
    }
    valid_clean_ABP()
    {
        if((this.ABP.devAddress==""||this.ABP.devAddress==undefined)&&(this.ABP.appsKey==""||this.ABP.appsKey==undefined)&&(this.ABP.nwksKey==""||this.ABP.nwksKey==undefined))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    valid_clean_OTAA()
    {
        if((this.OTAA.appEui==""||this.OTAA.appEui==undefined)&&(this.OTAA.appKey==""||this.OTAA.appKey==undefined))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    valid_reg_data()
    {
        return (this.valid_ABP()||this.valid_OTAA())?true:false;
    }
    valid_ABP()
    {
        if(this.valid.devAddress(this.ABP.devAddress)&&this.ABP.devAddress!=''&&this.ABP.devAddress!=undefined&&this.ABP.appsKey!=''&&this.ABP.appsKey!=undefined&&this.valid.byte16(this.ABP.appsKey)&&this.valid.byte16(this.ABP.nwksKey)&&this.ABP.nwksKey!=''&&this.ABP.nwksKey!=undefined)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    valid_OTAA()
    {
        if(this.valid.byte16(this.OTAA.appKey)&&this.OTAA.appKey!=undefined&&this.OTAA.appKey!='')
        {
            if(this.valid.byte8(this.OTAA.appEui)||this.OTAA.appEui==""||this.OTAA.appEui==undefined)
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
    get_reg_info()
    {
        var ABP=false;
        var OTAA=false;
        if(this.ABP!=undefined&&this.ABP.devAddress!=undefined&&this.ABP.appsKey!=undefined&&this.ABP.nwksKey!=undefined)
        {
            ABP=true;
        }
        if(this.OTAA!=undefined&&this.OTAA.appKey!=undefined)
        {
            OTAA=true;
        }
        if(ABP&&OTAA)
        {
            return "ABP+OTAA"
        }
        else if(ABP)
        {
             return "ABP"
        }
        else if(OTAA)
        {
            return "OTAA"
        }
        else
        {
            return "-"
        }
    }
    get_title()
    {
        if(this.devName==undefined||!this.valid.devEui(this.devEui))
        {
            return "Добавление нового устройства";
        }
        else
        {
            if(this.valid.valid(this.devName)&&this.devName!=""&&this.devName!=0)
            {
                return "Редактируемое устройство "+this.devName;
            }
            else
            {
                return "Редактируемое устройство "+this.devEui;
            }
        }
    }
    auto_pattern()
    {
        var ok=false;
        for(var i = 0 ; i<this.freqplan_patterns.length;i++)
        {
            var pattern = this.freqplan_patterns[i];
            var freqRx2 = pattern[0]==this.freqRx2;
            var freq4 = pattern[1]==this.frequencyPlan.freq4;
            var freq5 = pattern[2]==this.frequencyPlan.freq5;
            var freq6 = pattern[3]==this.frequencyPlan.freq6;
            var freq7 = pattern[4]==this.frequencyPlan.freq7;
            var freq8 = pattern[5]==this.frequencyPlan.freq8;
            var drRx2 = pattern[6] == undefined || this.drRx2 == pattern[6];
            if(freqRx2&&freq4&&freq5&&freq6&&freq7&&freq8&&drRx2)
            {
                ok=true;
                this.pattern=(i+1).toString();
                break;
            }
        }
        if(!ok)
        {
            this.pattern='4';
        }
    }
    set_device(obj)
    {   
        if(this.valid.devEui(obj.devEui))
        {
            this.devEui=obj.devEui;
        }
        else{ 
            return false;
        }
        if(this.valid.device_class(obj.class))
        {
            this.class=obj.class;
        }
        else{
            return false;
        }
        if(this.valid.valid(obj.devName))
        {
            this.devName=obj.devName;
        }
        else
        {
            this.devName=undefined;
        }
        if(obj.ABP==undefined&&obj.OTAA==undefined)
        {
            return false;
        }
        else
        {
            var ABP=false;
            var OTAA=false;
            
            if(obj.ABP!=undefined)
            {
                if(obj.ABP.devAddress!=undefined&&this.valid.isNumber(obj.ABP.devAddress))
                {
                    obj.ABP.devAddress=int_to_hex(obj.ABP.devAddress);
                }
                if(!(this.valid.devAddress(obj.ABP.devAddress)||this.valid.byte16(obj.ABP.appsKey)||this.valid.byte16(obj.ABP.nwks)))
                {
                    ABP=false;
                }
                else
                {
                    ABP=true;
                    this.ABP = obj.ABP;
                    
                }
            }
            if(obj.OTAA!=undefined)
            {
                 if(!this.valid.byte16(obj.OTAA.appKey))
                {
                   OTAA=false;
                }
                else
                {
                    OTAA=true;
                    this.OTAA = obj.OTAA;
                }
            }
            if(!OTAA&&!ABP)
            {
                return false;
            }
    
        }
        if(obj.frequencyPlan!=undefined)
        {
            (this.valid.isFrequency(obj.frequencyPlan.freq4))?this.frequencyPlan.freq4=obj.frequencyPlan.freq4:this.frequencyPlan.freq4=0;
            (this.valid.isFrequency(obj.frequencyPlan.freq5))?this.frequencyPlan.freq5=obj.frequencyPlan.freq5:this.frequencyPlan.freq5=0;
            (this.valid.isFrequency(obj.frequencyPlan.freq6))?this.frequencyPlan.freq6=obj.frequencyPlan.freq6:this.frequencyPlan.freq6=0;
            (this.valid.isFrequency(obj.frequencyPlan.freq7))?this.frequencyPlan.freq7=obj.frequencyPlan.freq7:this.frequencyPlan.freq7=0;
            (this.valid.isFrequency(obj.frequencyPlan.freq8))?this.frequencyPlan.freq8=obj.frequencyPlan.freq8:this.frequencyPlan.freq8=0;
        }
        else
        {
            this.frequencyPlan.freq4=this.freqplan_patterns[0][1];
            this.frequencyPlan.freq5=this.freqplan_patterns[0][2];
            this.frequencyPlan.freq6=this.freqplan_patterns[0][3];
            this.frequencyPlan.freq7=this.freqplan_patterns[0][4];
            this.frequencyPlan.freq8=this.freqplan_patterns[0][5];
        }
        
        if(obj.channelMask!=undefined)
        {
            (this.valid.isBool(obj.channelMask.channel1En))?this.channelMask.channel1En=obj.channelMask.channel1En:this.channelMask.channel1En=true;
            (this.valid.isBool(obj.channelMask.channel2En))?this.channelMask.channel2En=obj.channelMask.channel2En:this.channelMask.channel2En=true;
            (this.valid.isBool(obj.channelMask.channel3En))?this.channelMask.channel3En=obj.channelMask.channel3En:this.channelMask.channel3En=true;
            (this.valid.isBool(obj.channelMask.channel4En))?this.channelMask.channel4En=obj.channelMask.channel4En:this.channelMask.channel4En=true;
            (this.valid.isBool(obj.channelMask.channel5En))?this.channelMask.channel5En=obj.channelMask.channel5En:this.channelMask.channel5En=true;
            (this.valid.isBool(obj.channelMask.channel6En))?this.channelMask.channel6En=obj.channelMask.channel6En:this.channelMask.channel6En=true;
            (this.valid.isBool(obj.channelMask.channel7En))?this.channelMask.channel7En=obj.channelMask.channel7En:this.channelMask.channel7En=true;
            (this.valid.isBool(obj.channelMask.channel8En))?this.channelMask.channel8En=obj.channelMask.channel8En:this.channelMask.channel8En=true;
            
            (this.valid.isBool(obj.channelMask.channel9En))?this.channelMask.channel9En=obj.channelMask.channel9En:this.channelMask.channel9En=false;
            (this.valid.isBool(obj.channelMask.channel10En))?this.channelMask.channel10En=obj.channelMask.channel10En:this.channelMask.channel10En=false;
            (this.valid.isBool(obj.channelMask.channel11En))?this.channelMask.channel11En=obj.channelMask.channel11En:this.channelMask.channel11En=false;
            (this.valid.isBool(obj.channelMask.channel12En))?this.channelMask.channel12En=obj.channelMask.channel12En:this.channelMask.channel12En=false;
            (this.valid.isBool(obj.channelMask.channel13En))?this.channelMask.channel13En=obj.channelMask.channel13En:this.channelMask.channel13En=false;
            (this.valid.isBool(obj.channelMask.channel14En))?this.channelMask.channel14En=obj.channelMask.channel14En:this.channelMask.channel14En=false;
            (this.valid.isBool(obj.channelMask.channel15En))?this.channelMask.channel15En=obj.channelMask.channel15En:this.channelMask.channel15En=false;
            (this.valid.isBool(obj.channelMask.channel16En))?this.channelMask.channel16En=obj.channelMask.channel16En:this.channelMask.channel16En=false;
        }
        else
        {
            this.channelMask.channel1En=false;
            this.channelMask.channel2En=false;
            this.channelMask.channel3En=false;
            this.channelMask.channel4En=false;
            this.channelMask.channel5En=false;
            this.channelMask.channel6En=false;
            this.channelMask.channel7En=false;
            this.channelMask.channel8En=false;
            
            this.channelMask.channel9En=false;
            this.channelMask.channel10En=false;
            this.channelMask.channel11En=false;
            this.channelMask.channel12En=false;
            this.channelMask.channel13En=false;
            this.channelMask.channel14En=false;
            this.channelMask.channel15En=false;
            this.channelMask.channel16En=false;
        }
        if(obj.position!=undefined)
        {
            (this.valid.isNumber(obj.position.longitude))?this.position.longitude=obj.position.longitude:this.position.longitude=0;
            (this.valid.isNumber(obj.position.latitude))?this.position.latitude=obj.position.latitude:this.position.latitude=0;
            (this.valid.isNumber(obj.position.altitude))?this.position.altitude=obj.position.altitude:this.position.altitude=0;
        }
        else
        {
            this.position.longitude=undefined;
            this.position.latitude=undefined;
            this.position.altitude=undefined;
        }
        if(this.valid.valid(obj.fcnt_up))
        {
            this.fcnt_up=obj.fcnt_up;
        }
        else
        {
            this.fcnt_up=undefined
        }
        if(this.valid.valid(obj.fcnt_down))
        {
            this.fcnt_down=obj.fcnt_down;
        }else {this.fcnt_down=undefined}
        if(obj.last_data_ts!=undefined&&obj.last_data_ts>0)
        {
            this.last_data_ts=obj.last_data_ts;
        }
        else
        {
            this.last_data_ts=undefined;
        }
        
        if(this.valid.num0_5(obj.preferDr))
        {
            this.preferDr=obj.preferDr.toString();
        }
        else
        {
            this.preferDr='5';
        }
        if(this.valid.preferPower(obj.preferPower))
        {
            this.preferPower=obj.preferPower.toString();
        }
        else
        {
            this.preferPower='14';
        }
        
       if(this.valid.num0_5(obj.drRx2))
        {
            this.drRx2=obj.drRx2.toString();
        }
        else
        {
            this.drRx2='0';
        }
        if(this.valid.isBool(obj.useDownlinkQueueClassC))
        {
            this.useDownlinkQueueClassC=obj.useDownlinkQueueClassC;
        }
        else
        {
            this.useDownlinkQueueClassC=false;
        }
        if(this.valid.isBool(obj.serverAdrEnable))
        {
            this.serverAdrEnable=obj.serverAdrEnable;
        }
        else
        {
            this.serverAdrEnable=true;
        }
        if(this.valid.isNumber(obj.freqRx2))
        {
            this.freqRx2=obj.freqRx2;
        }
        else
        {
            this.freqRx2=undefined;
        }
        if(this.valid.isNumber(obj.reactionTime))
        {
            this.reactionTime=obj.reactionTime;
        }
        else
        {
            this.reactionTime=1000;
        }
        if(this.valid.isNumber(obj.delayRx1))
        {
            this.delayRx1=obj.delayRx1.toString();
        }
        else
        {
            this.delayRx1='1';
        }
        if(this.valid.isNumber(obj.rxWindow))
        {
            this.rxWindow=obj.rxWindow.toString();
        }
        else
        {
            this.rxWindow='2';
        }
         if(this.valid.isNumber(obj.delayJoin1))
        {
            this.delayJoin1=obj.delayJoin1.toString();
        }
        else
        {
            this.delayJoin1='5';
        }
        this.auto_pattern();
        this.group = obj.group!==undefined&&obj.group!==''?obj.group:'';
        return this;
    }
    get_json()
    {
        try
        {
            return this;
        }
        catch(err)
        {
            return false;
        }
    }
}
class map_nav
{
    constructor()
    {
        this.level_1_list=[];
        this.level_2_list=[];
        this.level_2_filter_list=[];
        this.level_3_list=[];
        this.check_level_1=-1;//Выбранный объект
        this.check_level_2=-1;//Выбранное помещение
        this.history_danger=[];
    }
    //запись в массив истории тут,  и функции поиска по лев 1 лев2  и тд и збс
    set_history_danger(devEui,num,name_level_1,address_level_1,level_2)
    {
        var tempObj = new Object();
        tempObj.devEui = devEui;
        tempObj.num = num;
        tempObj.name_level_1 = name_level_1;
        tempObj.address_level_1 = address_level_1;
        tempObj.level_2 = level_2;
        this.history_danger.push(tempObj);
    }
    get_level_1_danger(name_level_1,address_level_1)
    {
        var countDanger = 0;
        for(var i=0;i< this.history_danger.length;i++)
        {
            if(this.history_danger[i].name_level_1==name_level_1&&this.history_danger[i].address_level_1==address_level_1)
            {
                countDanger++;
            }
        }
        return countDanger;
    }
    get_level_2_danger(level_2,name_level_1,address_level_1)
    {
        var countDanger = 0;
        for(var i=0;i< this.history_danger.length;i++)
        {
            if(this.history_danger[i].level_2==level_2&&this.history_danger[i].name_level_1==name_level_1&&this.history_danger[i].address_level_1==address_level_1)
            {
                countDanger++;
            }
        }
        return countDanger;
    }
    select_check_level_1(level_1)
    {
       
      if(level_1==this.check_level_1)
      {
        this.check_level_1=-1;
      }
      else
      {
          this.check_level_1=level_1;
      }
        this.check_level_2=-1;
    }
    select_check_level_2(level_2)
    {
       if(this.check_level_2==level_2)
       {
           this.check_level_2=-1;
       }
       else{
        this.check_level_2=level_2;}
    }
    set_danger_level_1()
    {
        
    }
    set_level_1(name,address)
    {
        if(name&&name!=undefined&&address&&address!=undefined)
        {
            var temp = new Object();
            temp.name_level_1=name;
            temp.address_level_1=address;
            temp.danger=false;
            for(var i=0;i<this.level_1_list.length;i++)
            {
                if(this.level_1_list[i].name_level_1==name&&this.level_1_list[i].address_level_1==address)
                {
                    return false;
                }
            }
            this.level_1_list.push(temp);
        }
    }
    set_level_2(name)
    {
        if(name!=undefined&&name&&this.level_2_list.indexOf(name.toString())==-1)
        {
            this.level_2_list.push(name.toString());
            this.level_2_filter_list.push({name:name.toString(),tick:true});
        }
    }
    set_level_3(name)
    {
        if(name!=undefined&&name&&this.level_3_list.indexOf(name.toString())==-1)
        {
            this.level_3_list.push(name.toString());
        }
    }
}