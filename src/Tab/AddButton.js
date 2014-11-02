/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('SenchaExt.Tab.AddButton', {
   extend : 'Ext.Component',
   alias : 'widget.tabaddbutton',
   requires : [
      'Ext.layout.container.Fit'
   ],
   mixins : {
      langProvider : 'SenchaExt.Mixin.LangProvider'
   },

   /**
    * @property {Ext.tab.Panel} tabPanel
    */
   tabPanel : null,
   LANG_TEXT : null,
   constructor : function(config)
   {
      this.mixins.langProvider.constructor.call(this);
      Ext.applyIf(config,{
         width : 32,
         height : 32,
         margin : 4,
         cls : 'sencha-ext-tab-add-button',
         overCls : 'sencha-ext-tab-add-button-over'
      })
      this.LANG_TEXT = this.GET_LANG_TEXT('VIEW.TAB.ADD_BUTTON');
      this.callParent([config]);
   },

   afterRender : function()
   {
      this.callParent();
      var el = this.getTargetEl();
      el.addListener('click', this.clickHandler, this);
   },
   clickHandler : function()
   {
      var generator = this.tabPanel.blankObjGenerator;
      var me = this;
      generator(function(cmp){
         var TITLE = me.LANG_TEXT.TEXT;
         if(null == cmp){
            cmp = {
               title : TITLE,
               closable : true,
               border : false,
               bodyBorder : false,
               layout : 'fit'
            };
         }
         var tab = me.tabPanel.add(cmp);
         me.tabPanel.setActiveTab(tab);
      });

   },
   /**
    * 清除资源
    */
   destory : function()
   {
      delete this.LANG_TEXT;
      this.callParent();
      var targetEl = this.getTargetEl();
      this.mixins.langProvider.destroy.call(this);
      targetEl.removeListener('click', this.clickHandler, this);
   }
});