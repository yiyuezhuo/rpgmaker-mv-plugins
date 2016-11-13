function Window_MyMessage(){
	this.initialize.apply(this, arguments);
}

Window_MyMessage.prototype = Object.create(Window_Selectable.prototype);
Window_MyMessage.prototype.constructor = Window_MyMessage;

Window_MyMessage.prototype.initialize = function(x,y,width,height){
	Window_Selectable.prototype.initialize.call(this,x,y,width,height);
	this.activate();
}


function Scene_MyScene(){
	this.initialize.apply(this, arguments);
}

Scene_MyScene.prototype = Object.create(Scene_MenuBase.prototype);
Scene_MyScene.prototype.constructor = Scene_MyScene;

Scene_MyScene.prototype.initialize = function(){
	Scene_MenuBase.prototype.initialize.call(this);
}

Scene_MyScene.prototype.create = function(){
	Scene_MenuBase.prototype.create.call(this);
	this._commandWindow = new Window_MyMessage(0,0,400,200);
	this.addWindow(this._commandWindow);
}

Scene_MyScene.prototype.update = function(){
	if(Input.isTriggered('escape') || Input.isTriggered('cancel')){
		//this._commandWindow.hide();
		SceneManager.goto(Scene_Map);
	}
}

function Scene_MyScene2(){
	this.initialize.apply(this, arguments);
}


Scene_MyScene2.prototype = Object.create(Scene_MenuBase.prototype);
Scene_MyScene2.prototype.constructor = Scene_MyScene2;

Scene_MyScene2.prototype.initialize = function(){
	Scene_MenuBase.prototype.initialize.call(this);
	this._text = this._text || 'default text';
	
}

Scene_MyScene2.prototype.create = function(){
	Scene_MenuBase.prototype.create.call(this);
	this._commandWindow = new Window_MyMessage(0,0,400,200);
	this._commandWindow.drawText(this._text,0,0,360,'left');
	//this._commandWindow.setHandler('escape', this.popScene.bind(this));
	this._commandWindow.setHandler('cancel', this.popScene.bind(this));
	console.log("register");
	//var _callback = function(){console.log('bind callback')};
	//this._commandWindow.setHandler('escape', _callback);
	//this._commandWindow.setHandler('cancel', _callback);

	this.addWindow(this._commandWindow);
}

Scene_MyScene2.prototype.update = function(){
	//if(Input.isTriggered('escape') || Input.isTriggered('cancel')){
	Scene_MenuBase.prototype.update.call(this);
	//console.log(this._commandWindow.isOpenAndActive());
	//console.log(this._commandWindow.isOkEnabled() ,'|', this._commandWindow.isOkTriggered());
	//console.log(this._commandWindow.isCancelEnabled() ,' ', this._commandWindow.isCancelTriggered())
	//console.log(this._commandWindow.isOpen() ,' ', this._commandWindow.active);
	if(Input.isRepeated('escape') || Input.isRepeated('cancel')){
		//this._commandWindow.hide();
		//SceneManager.goto(Scene_Map);
		console.log('callback');
	}
}


function Scene_MyScene3(){
	this.initialize.apply(this, arguments);
}

Scene_MyScene3.prototype = Object.create(Scene_MenuBase.prototype);
Scene_MyScene3.prototype.constructor = Scene_MyScene3;

Scene_MyScene3.prototype.initialize = function(){
	Scene_MenuBase.prototype.initialize.call(this);	
}

Scene_MyScene3.prototype.create = function(){
	Scene_MenuBase.prototype.create.call(this);
	this._commandWindow = new Window_MyMessage(0,0,400,200);
	this._commandWindow.drawText(this._text,0,0,360,'left');
	this._commandWindow.setHandler('cancel', this.popScene.bind(this));
	this._commandWindow.setHandler('ok', this.popScene.bind(this));
	this.addWindow(this._commandWindow);
}

Scene_MyScene3.prototype.update = function(){
	Scene_MenuBase.prototype.update.call(this);
	// window的update是通过Scene某个基类的方法进行的，不调用基类update就截断了更新。
	// 当然直接不覆盖这个方法也是可以的。
}

function Scene_MyScene_Factory(text){
	function _Scene_MyScene3(){
		Scene_MyScene3.prototype.initialize.apply(this, arguments);
	}
	_Scene_MyScene3.prototype = Object.create(Scene_MyScene3.prototype);
	_Scene_MyScene3.constructor = _Scene_MyScene3;
	
	_Scene_MyScene3.prototype._text = text;
	
	return _Scene_MyScene3
}

function quickMessage(text){
	var newClass = Scene_MyScene_Factory(text);
	SceneManager.push(newClass);
}


function Window_MySelectable(){
	this.initialize.apply(this, arguments);
}

Window_MySelectable.prototype = Object.create(Window_Selectable.prototype);
Window_MySelectable.prototype.constructor = Window_MySelectable;

Window_MySelectable.prototype.initialize = function(x,y,width,height){
	Window_Selectable.prototype.initialize.call(this,x,y,width,height);
	//this._list = ['yiyuezhuo','zhuoyueyi','statistic'];
	this._list = [];
	this.refresh();
	this.activate();
}

Window_MySelectable.prototype.drawItem = function(index) {
	var name = this._list[index];
	var rect = this.itemRectForText(index);
	this.drawText(name, rect.x, rect.y, rect.width);
};

Window_MySelectable.prototype.refresh = function(){
	this.createContents();
    this.drawAllItems();
}

Window_MySelectable.prototype.maxItems = function(){
	return this._list ? this._list.length : 0;
}

Window_MySelectable.prototype.setList = function(_list){
	this._list = _list;
	this.refresh();
}


function Window_MySelectableWithCallback(){
	this.initialize.apply(this, arguments);
}
Window_MySelectableWithCallback.prototype = Object.create(Window_MySelectable.prototype);
Window_MySelectableWithCallback.prototype.constructor = Window_MySelectableWithCallback;

Window_MySelectableWithCallback.prototype.setCallback = function(callback){
	this._callback = callback;
}

Window_MySelectableWithCallback.prototype.update = function() {
	Window_MySelectable.prototype.update.call(this);
	if(this._callback){
		this._callback(this._list[this.index()]);
	}
};



function Window_AttributeBox(){
	this.initialize.apply(this,arguments);
}

Window_AttributeBox.prototype = Object.create(Window_Base.prototype);
Window_AttributeBox.prototype.constructor = Window_AttributeBox;

Window_AttributeBox.prototype.initialize = function(x,y,width,height){
	Window_Base.prototype.initialize.call(this,x,y,width,height);
	this._data = null;
	//this.refresh();
	this.activate();
}

Window_AttributeBox.prototype.refresh = function(){
	this.contents.clear();
	
	var x = 0;
	var y = 0;
	var key_width = 160;
	var value_width = 60;
	var lineHeight = this.lineHeight();
	
	var item = this.getItem();
	if(!item){
		return;
	}
	
	x = this.textPadding();
	y = lineHeight + this.textPadding();
	
	var that = this;
	this.getKeys().forEach(function(key){
		var value = item[key];
		
		that.drawText(key, x, y, key_width);
		that.drawText(value, x + key_width, y, value_width,'right');
		
		y += lineHeight;
	});
	
}

Window_AttributeBox.prototype.getKeys = function(){
	return [];
}

Window_AttributeBox.prototype.setItem = function(data){
	if(this._data!=data){
		this._data = data;
		this.refresh();
	}
}

Window_AttributeBox.prototype.getItem = function(){
	return this._data;
}


function Window_AttributeBox_1(){
	this.initialize.apply(this,arguments);
}
Window_AttributeBox_1.prototype = Object.create(Window_AttributeBox.prototype);
Window_AttributeBox_1.prototype.constructor = Window_AttributeBox_1;
Window_AttributeBox_1.prototype.getKeys = function(){
	return ['Name','HP','MP'];
}



function Scene_Selector(){
	this.initialize.apply(this, arguments);
}

Scene_Selector.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Selector.prototype.constructor = Scene_Selector;

Scene_Selector.prototype.initialize = function(){
	Scene_MenuBase.prototype.initialize.call(this);	
}

Scene_Selector.prototype.create = function(){
	Scene_MenuBase.prototype.create.call(this);
	this._mySelectable = new Window_MySelectable(0,0,400,200);
	this._mySelectable.setList(['yiyuezhuo','zhuoyueyi','statistic','prolog','javascript','ruby','python','china']);
	this._mySelectable.setHandler('cancel', this.popScene.bind(this));
	this.addWindow(this._mySelectable);
	
	//begin bebug
	Scene_Selector._mySelectable = this._mySelectable;
	//end debug
}



function Scene_ListViewer(){
	this.initialize.apply(this,arguments);
}
Scene_ListViewer.prototype = Object.create(Scene_MenuBase.prototype);
Scene_ListViewer.prototype.constructor = Scene_ListViewer;

Scene_ListViewer.prototype.initialize = function(){
	Scene_MenuBase.prototype.initialize.call(this);	
}

Scene_ListViewer.prototype.create = function(){
	Scene_MenuBase.prototype.create.call(this);
	
	this._mySelectable = new Window_MySelectableWithCallback(0,0,300,500);
	
	var keyList = ['yiyuezhuo','zhuoyueyi','statistic'];
	var data = {yiyuezhuo:{name:'yiyuezhuo',HP:0,MP:0},
				zhuoyueyi:{name:'zhuoyueyi',HP:1,MP:2},
				statistic:{name:'statistic',HP:3,MP:4}};
	
	
	this._mySelectable.setList(keyList);
	this._mySelectable.setHandler('cancel', this.popScene.bind(this));
	this.addWindow(this._mySelectable);
	
	this.attribute_box = new Window_AttributeBox_1(310,0,300,500);
	this.addWindow(this.attribute_box);
	
	var that = this;
	function callback(key){
		that.attribute_box.setItem(data[key]);
	}
	
	this._mySelectable.setCallback(callback);
	
	//begin bebug
	Scene_ListViewer._mySelectable = this._mySelectable;
	Scene_ListViewer.attribute_box = this.attribute_box;
	//end debug
}
