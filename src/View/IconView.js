/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('SenchaExt.View.IconView', {
   extend : 'Ext.view.View',
   alias : 'widget.senchaexticonview',
   /**
    * 指定渲染模板
    *
    * @property {Ext.XTemplate} tpl
    */
   tpl : new Ext.XTemplate(['<tpl for=".">',
      '<div class="sencha-ext-view-iconview-wrapper x-unselectable" style="width:{width}px;height:{height}px;margin: {margin}">',
         '<div class="sencha-ext-view-iconview-icon {iconCls}"  style="width:{iconWidth}px;height:{iconHeight}px;margin:10px auto;{iconBgStyle}" title="{text}">',
         '</div>',
         '<div class="sencha-ext-view-iconview-text" style = "line-height:20px;height : 20px;">{text}</div>',
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
         overItemCls : 'sencha-ext-view-iconview-icon-hover',
         itemSelector : 'div.sencha-ext-view-iconview-wrapper',
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
   /**
    * Function which can be overridden to provide custom formatting for each Record that is used by this
    * DataView's {@link #tpl template} to render each node.
    * @param {Object/Object[]} data The raw data object that was used to create the Record.
    * @param {Number} recordIndex the index number of the Record being prepared for rendering.
    * @param {Ext.data.Model} record The Record being prepared for rendering.
    * @return {Array/Object} The formatted data in a format expected by the internal {@link #tpl template}'s overwrite() method.
    * (either an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'}))
    */
   prepareData : function(data, index, record)
   {
      var data = this.callParent([data, index, record]);
      Ext.apply(data, this.iconInfo);
      //设置背景大小 CSS3
      var types = [
         '-moz-background-size',
         '-webkit-background-size',
         '-o-background-size',
         'background-size'
      ];
      var len = types.length;
      var style = '';
      for(var i = 0; i < len; i++){
         style += types[i] + ':'+data.iconWidth + 'px '+data.iconWidth+'px;';
      }

      data.iconBgStyle = style;
      this.setupIconCls(data);
      return data;
   },
   /**
    * @template
    * @param data
    */
   setupIconCls : function(data)
   {}
});