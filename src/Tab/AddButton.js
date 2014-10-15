/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('Cntysoft.SenchaExt.Tab.AddButton', {
   extend : 'Ext.Component',
   alias : 'widget.tabaddbutton',
   cls : 'cnty-tab-add-button',
   overCls : 'cnty-tab-add-button-over',
   width : 16,
   height : 16,
   margin : 4,
   /**
    * @property {Ext.tab.Panel} tabPanel
    */
   tabPanel : null,
   LANG_TEXT : null,
   constructor : function(config)
   {
      this.LANG_TEXT = Cntysoft.GET_COMP_LANG_TEXT('TAB.ADD_BUTTON');
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
      targetEl.removeListener('click', this.clickHandler, this);
   }
});