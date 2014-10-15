/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('Cntysoft.SenchaExt.Mixin.MultiTabPanel', {
   requires : [
      'Cntysoft.SenchaExt.Tab.Panel'
   ],
   /**
    * @property {Object} panelClsMap 多标签panel映射数据
    */
   panelClsMap : {},
   /**
    * 初始的面板类型
    *
    * @property {String} initPanelType
    */
   initPanelType : null,
   /**
    * 初始化参数
    *
    * @property {Object} initPanelConfig
    */
   initPanelConfig : null,
   constructor : function()
   {
      if(0 == Ext.Object.getSize(this.panelClsMap)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'constructor',
            'panelClsMap canot be empty'
         );
      } else if(null === this.initPanelType){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'constructor',
            'initPanelType canot be null'
         );
      }
   },
   /**
    * 渲染面板
    *
    * @param {String} panelType 面板的种类
    * @param {Object} config 面板的配置对象
    */
   renderPanel : function(panelType, config)
   {
      var activeTab = this.tabPanel.getActiveTab();
      var pos;
      if(activeTab.panelType != panelType){
         //从这里导入的一定义修改模式
         this.getPanelObject(panelType, config, function(targetPanel){
            pos = this.tabPanel.items.indexOf(activeTab);
            this.tabPanel.remove(activeTab, true);
            this.tabPanel.add(pos, targetPanel);
            this.tabPanel.setActiveTab(targetPanel);
         }, this);
      } else{
         //存在的时候调用一个处理函数
         this.panelExistHandler(activeTab, config);
      }
   },
   /**
    * 渲染一个新的TAB标签面板
    *
    * @param {String} panelType 面板的种类
    * @param {Object} config 面板的配置对象
    */
   renderNewTabPanel : function(panelType, config)
   {
      this.getPanelObject(panelType, config, function(targetPanel){
         this.tabPanel.add(targetPanel);
         this.tabPanel.setActiveTab(targetPanel);
      }, this);
   },
   /**
    * 初始化多标签的起始标签页， 看一般是绑定到afterrender事件
    *
    * @param {Cntysoft.Kernel.CoreComp.Tab.Panel} tabPanel
    */
   initStartupTab : function(tabPanel)
   {
      var initPanelConfig = this.getInitPanelConfig();
      this.tabPanel = tabPanel;
      this.getPanelObject(this.initPanelType, initPanelConfig, function(panel){
         this.tabPanel.add(panel);
         this.tabPanel.setActiveTab(0);
      }, this);
   },
   /**
    * 当面板存在之后调用的处理函数
    *
    * @param {Ext.panel.Panel} panel 当前面板对象引用
    * @param {Object} config 传递的配置信息
    */
   panelExistHandler : Ext.emptyFn,
   /**
    * @return {Object}
    */
   getInitPanelConfig : function()
   {
      return this.initPanelConfig;
   },
   /**
    * 获取面板对象
    *
    * @param {String} type 面板对象的键值
    * @param {Object} config 传给面板的配置对象
    */
   getPanelObject : function(type, config, callback, scope)
   {
      config = config || {};
      callback = Ext.isFunction(callback) ? callback : Ext.emptyFn;
      scope = scope || this;
      var clsMap = this.panelClsMap;
      var cls;
      if(!clsMap.hasOwnProperty(type)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'getPanelObject',
            'panel type : ' + type + ' is not exist'
         );
      }
      cls = clsMap[type];
      Ext.apply(config, {
         mainPanel : this,
         closable : true
      });
      //Cntysoft.showLoadScriptMask();
      Ext.require(cls, function(){
         //Cntysoft.hideLoadScriptMask();
         callback.call(scope, Ext.create(cls, config));
      }, this);
   },
   getTabPanelConfig : function()
   {
      return {
         xtype : 'addbuttontabpanel',
         region : 'center',
         layout : 'fit',

         listeners : {
            afterrender : this.initStartupTab,
            beforetabclose : function(tabPanel, tab){
               if(1 == tabPanel.items.getCount()){
                  //留住一个标签
                  return false;
               }
            },
            scope : this
         },
         blankObjGenerator : Ext.bind(function(callback){
            this.getNewTabObject(callback);
         }, this)
      };
   },
   getNewTabObject : function(callback, scope)
   {
      this.getPanelObject(this.initPanelType, this.getInitPanelConfig(), callback, scope);
   },

   destroy : function()
   {
      delete this.tabPanel;
   }
});