/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 加上一些额外的上传字段, 暂时不进行字符型的字段存在性检查
 */
Ext.define('Cntysoft.SenchaExt.Data.TreeStore', {
   extend : 'Ext.data.TreeStore',
   alias : 'store.cntytreestore',
   extraParams : [],
   load : function(options)
   {
      options = options || {};
      options.params = options.params || {};

      var me = this,
         node = options.node || me.tree.getRootNode(),
         extraLen,
         extraParams = this.extraParams,
         extraItem;

      // If there is not a node it means the user hasnt defined a rootnode yet. In this case lets just
      // create one for them.
      if(!node){
         node = me.setRootNode({
            expanded : true
         }, true);
      }

      // Assign the ID of the Operation so that a REST proxy can create the correct URL
      options.id = node.getId();

      if(me.clearOnLoad){
         if(me.clearRemovedOnLoad){
            // clear from the removed array any nodes that were descendants of the node being reloaded so that they do not get saved on next sync.
            me.clearRemoved(node);
         }
         // temporarily remove the onNodeRemove event listener so that when removeAll is called, the removed nodes do not get added to the removed array
         //        me.tree.un('remove', me.onNodeRemove, me);
         // remove all the nodes
         node.removeAll(false);
         // reattach the onNodeRemove listener
         //      me.tree.on('remove', me.onNodeRemove, me);
      }
      Ext.applyIf(options, {
         node : node
      });
      options.params[me.nodeParam] = node ? node.getId() : 'root';
      extraLen = extraParams.length;
      for(var i = 0; i < extraLen; i++) {
         extraItem = extraParams[i];
         if(Ext.isObject(extraItem)){
            options.params[extraItem.key] = extraItem.value;
         } else{
            options.params[extraItem] = node ? node.get(extraItem) : null;
         }
      }
      if(node){
         node.set('loading', true);
      }
      return me.superclass.superclass.load.apply(me, [options]);
   },

   /**
    * 设置附加参数的值
    *
    * @param {string} key
    * @param {Object} value
    */
   setExtraParam : function(key, value)
   {
      if(!Ext.isArray(this.extraParams)){
         this.extraParams = [];
      }
      Ext.each(this.extraParams, function(item){
         if(Ext.isObject(item)){
            if(key == item.key){
               item.value = value;
               return false;
            }
         }
      }, this);
   },
   /**
    * 添加附加参数数据
    *
    * @param {string | object} data
    */
   addExtraParam : function(data)
   {
      if(!Ext.isArray(this.extraParams)){
         this.extraParams = [];
      }
      this.extraParams.push(data);
   }
});