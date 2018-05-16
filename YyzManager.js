/*:
* @author yiyuezhuo
* @plugindesc 搞个大新闻
* 
* @param second
* @type number
* @min 1
* @max 366
* @desc 一年中献给长者的生命
* @default 64
* 
* @help
* 闷声发大财，把rpgmaker的垃圾架构批判一番
*/

var YyzManager = (function(){
    
    // helper function to string process
    
    function rerange(doc, col_limit){
        // 按列限制重新插入换行符。这里遵循markdown-github或战国史的风格
        var char_l = [];
        var line_len = 0;
        for(var i=0;i<doc.length;i++){
            if(doc[i] == '\n'){
                if(i+1 >= doc.length || doc[i+1] != '\n'){
                    continue;
                }
                else{
                    char_l.push('\n');
                    line_len = 0;
                }
            }
            else{
                if(line_len > col_limit){
                    char_l.push('\n');
                    line_len = 0;
                }
                char_l.push(doc[i]);
                line_len++;
            }
        }
        return char_l.join('');
    }
    
    // UI setup

    function Window_MyMessage(){
        this.initialize.apply(this, arguments);
    }

    Window_MyMessage.prototype = Object.create(Window_Selectable.prototype);
    Window_MyMessage.prototype.constructor = Window_MyMessage;

    Window_MyMessage.prototype.initialize = function(x,y,width,height){
        Window_Selectable.prototype.initialize.call(this,x,y,width,height);
        //this.activate();
    }
    
    
    function Scene_LongText(){
        this.initialize.apply(this, arguments);
    }

    Scene_LongText.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_LongText.prototype.constructor = Scene_LongText;

    Scene_LongText.prototype.initialize = function(){
        Scene_MenuBase.prototype.initialize.call(this);	
    }

    Scene_LongText.prototype.create = function(){
        Scene_MenuBase.prototype.create.call(this);
        this._commandWindow = new Window_MyMessage(YyzManager.wx, YyzManager.wy, YyzManager.ww, YyzManager.wh);
        //this._commandWindow.drawText(YyzManager.text,0,0,360,'left');
        //this._commandWindow.drawTextEx(YyzManager.text,0,0);
        
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this._commandWindow.setHandler('ok', this.onPageDown.bind(this));
        this._commandWindow.setHandler('pagedown', this.onPageDown.bind(this));
        this._commandWindow.setHandler('pageup', this.onPageUp.bind(this));
        //这两个暂时不生效，似乎是与游戏机一致性的原因
        this._commandWindow.setHandler('up', this.onUp.bind(this));
        this._commandWindow.setHandler('down', this.onDown.bind(this));

        this.addWindow(this._commandWindow);
        
        this.idx=0;
        this.refreshWindow();
        this._commandWindow.activate();
    }
    
    Scene_LongText.prototype.refreshWindow = function(){
        this._commandWindow.contents.clear();
        //this._commandWindow.drawTextEx(YyzManager.text,0,0);
        var textList = rerange(YyzManager.text, YyzManager.col_limit).split('\n');
        var textSubList = [];
        var idx = this.idx;
        for(var i=0; i<YyzManager.line_limit; i++){
            if(i+idx<textList.length && i+idx>=0){
                textSubList.push(textList[this.idx+i]);
            }
        }
        console.log(textSubList);
        this._commandWindow.drawTextEx(textSubList.join('\n'),0,0);
    }
    
    Scene_LongText.prototype.onPageDown = function(){
        console.log('onPageDown');
        this.idx += YyzManager.line_limit;
        this.refreshWindow();
        // 一旦windows接受一个handler事件处理，如果不重新activate就不能接收事件，意义不明的设计。
        this._commandWindow.activate();
    }
    
    Scene_LongText.prototype.onPageUp = function(){
        console.log("onPageUp");
        if(this.idx - YyzManager.line_limit >=0){
            this.idx -= YyzManager.line_limit;
        }
        this.refreshWindow();
        this._commandWindow.activate();
    }

    
    Scene_LongText.prototype.onUp = function(){
        console.log("onUp");
        this.idx -= 1;
        this.refreshWindow();
        this._commandWindow.activate();
    }

    Scene_LongText.prototype.onDown = function(){
        console.log("onDown");
        this.idx += 1;
        this.refreshWindow();
        this._commandWindow.activate();
    }

    
    
    
    
    function quickMessage(text, wx, wy, ww, wh){
        YyzManager.text = text || "<NULL>";
        YyzManager.wx = wx || YyzManager.wx;
        YyzManager.wy = wy || YyzManager.wy;
        YyzManager.ww = ww || YyzManager.ww;
        YyzManager.wh = wh || YyzManager.wh;
        //YyzManager.line_limit || YyzManager.line_limit;
        //YyzManager.col_limit
        
        SceneManager.push(Scene_LongText);
    }

    // export name and default value
    
    return {Scene_LongText: Scene_LongText,
            quickMessage: quickMessage,
            text: '<NULL>',
            wx:50,
            wy:50,
            ww:700,
            wh:500,
            line_limit:12,
            col_limit :20};


}());

