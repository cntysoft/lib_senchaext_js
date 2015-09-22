/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 图标View定义，这个类主要负责显示指定大小的图标列表
 */
Ext.define('SenchaExt.View.ImageView', {
   extend : 'Ext.view.View',
   alias : 'widget.senchaextimageview',
   /**
    * 指定渲染模板
    *
    * @property {Ext.XTemplate} tpl
    */
   tpl : new Ext.XTemplate(['<tpl for=".">',
      '<div class="sencha-ext-view-imageview-wrapper x-unselectable" style="width:{width}px;height:{height}px;margin: {margin}">',
          '<img class="sencha-ext-view-imageview-icon"  src = "{icon}" style="width:{iconWidth}px;height:{iconHeight}px;margin:10px auto;{iconBgStyle}" title="{text}"/>',
      '</div>',
      '<div class="sencha-ext-view-imageview-text" style = "line-height:20px;height : 20px;">{text}</div>',
      '</div>',
      '</tpl>',
      '<div class="x-clear"></div>']),
   /**
    * 构造函数
    *
    * @param {Object} config
    */
   constructor : function(config)
   {
      var config = config || {};
      Ext.applyIf(config,{
         singleSelect : true,
         trackOver : true,
         overItemCls : 'sencha-ext-view-imageview-icon-hover',
         itemSelector : 'div.sencha-ext-view-imageview-wrapper',
         autoScroll : true,
         trackOver : true,
         iconInfo : {
            width : 110,
            height : 110,
            iconWidth : 64,
            iconHeight : 64,
            margin : '2px'
         }
      });
      this.callParent([config]);
   },
   prepareData : function(data, index, record)
   {
      var data = this.callParent([data, index, record]);
      Ext.apply(data, this.iconInfo);
      return data;
   }
});