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
Ext.define('SenchaExt.Data.TreeStore', {
   extend : 'Ext.data.TreeStore',
   alias : 'store.cntytreestore',
   extraParams : [],
   load : function(options)
   {
      options = options || {};
      options.params = options.params || {};

      var me = this,
         node = options.node || me.getRoot(),
         proxy = me.getProxy(),
         callback = options.callback,
         scope = options.scope,
         operation,
         extraLen,
         extraParams = this.extraParams,
         extraItem;

      // If there is not a node it means the user hasn't defined a root node yet. In this case let's just
      // create one for them. The expanded: true will cause a load operation, so return.
      if (!node) {
         me.setRoot({
            expanded: true
         });
         return;
      }

      // If the node we are loading was expanded, we have to expand it after the load
      if (node.data.expanded) {
         node.data.loaded = false;

         // Must set expanded to false otherwise the onProxyLoad->fillNode->appendChild calls will update the view.
         // We ned to update the view in the callback below.
         if (me.clearOnLoad) {
            node.data.expanded = false;
         }
         options.callback = function() {

            // If newly loaded nodes are to be added to the existing child node set, then we have to collapse
            // first so that they get removed from the NodeStore, and the subsequent expand will reveal the
            // newly augmented child node set.
            if (!me.clearOnLoad) {
               node.collapse();
            }
            node.expand();

            // Call the original callback (if any)
            Ext.callback(callback, scope, arguments);
         };
      }

      // Assign the ID of the Operation so that a ServerProxy can set its idParam parameter,
      // or a REST proxy can create the correct URL
      options.id = node.getId();

      options = Ext.apply({
         filters: me.getFilters().items,
         sorters: me.getSorters().items,
         node: options.node || node,
         internalScope: me,
         internalCallback: me.onProxyLoad
      }, options);

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
      me.lastOptions = Ext.apply({}, options);

      operation = proxy.createOperation('read', options);

      if (me.fireEvent('beforeload', me, operation) !== false) {

         // Set the loading flag early
         // Used by onNodeRemove to NOT add the removed nodes to the removed collection
         me.loading = true;
         if (me.clearOnLoad) {
            if (me.clearRemovedOnLoad) {
               // clear from the removed array any nodes that were descendants of the node being reloaded so that they do not get saved on next sync.
               me.clearRemoved(node);
            }
            // remove all the nodes
            node.removeAll(false);
         }
         operation.execute();
      }

      if (me.loading && node) {
         node.set('loading', true);
      }
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