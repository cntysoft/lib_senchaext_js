/**
 * A plugin that provides the ability to visually indicate to the user that a node is disabled.
 *
 * Notes:
 * - Compatible with Ext 4.x
 * - If the view already defines a getRowClass function, the original function will be called before this plugin.
 *
 var tree = Ext.create('Ext.tree.Panel',{
 plugins: [{
 ptype: 'nodedisabled'
 }]   
 ...
 });
 */
Ext.define('SenchaExt.Tree.DisableNodePlugin', {
    alias : 'plugin.nodedisabled',
    extend : 'Ext.AbstractPlugin',
    //configurables
    /**
     * @cfg {String} disabledCls
     * The CSS class applied when the {@link Ext.data.Model} of the node has a 'disabled' field with a true value.
     */
    disabledCls : 'sencha-ext-tree-node-disabled',
    /**
     * @cfg {Boolean} preventSelection
     * True to prevent selection of a node that is disabled. Default true.
     */
    preventSelection : true,
    //properties

    /**
     * @private
     * @param {Ext.tree.Panel} tree
     */
    init : function(tree)
    {
        var me = this,
            view = tree.getView(),
            origFn,
            origScope;

        me.callParent(arguments);

        origFn = view.getRowClass;
        if(origFn){
            origScope = view.scope || me;
            Ext.apply(view, {
                getRowClass : function(){
                    var v1, v2;
                    v1 = origFn.apply(origScope, arguments) || '';
                    v2 = me.getRowClass.apply(me, arguments) || '';
                    return (v1 && v2) ? v1 + ' ' + v2 : v1 + v2;
                },
                onCheckboxChange : me.onCheckboxChange
            });
        } else{
            Ext.apply(view, {
                getRowClass : Ext.Function.bind(me.getRowClass, me),
                onCheckboxChange : me.onCheckboxChange
            });
        }

        if(me.preventSelection){
            tree.getSelectionModel().on('beforeselect', me.onBeforeNodeSelect, me);
        }
        if(me.preventCheckChange){
            view.on('checkchange', me.onCheckChange, me);
        }
    },
    /**
     * Returns a properly typed result.
     * @return {Ext.tree.Panel}
     */
    getCmp : function()
    {
        return this.callParent(arguments);
    },
    /**
     * @private
     * @param {Ext.data.Model} record
     * @param {Number} index
     * @param {Object} rowParams
     * @param {Ext.data.Store} ds
     * @return {String}
     */
    getRowClass : function(record, index, rowParams, ds)
    {
        return record.get('disabled') ? this.disabledCls : '';
    },
    /**
     * @private
     * @param {Ext.selection.TreeModel} sm
     * @param {Ext.data.Model} node
     * @return {Boolean}
     */
    onBeforeNodeSelect : function(sm, node)
    {
        if(node.get('disabled')){
            return false;
        }
    },
    /**
     * @override {@link Ext.tree.View#onCheckboxChange}
     * @private
     * @param {Ext.EventObject} e
     * @param {Object} target
     */
    onCheckboxChange : function(e, t){
        var item = e.getTarget(this.getItemSelector(), this.getTargetEl()),
            record, value;

        if(item){
            record = this.getRecord(item);
            if(record.get('disabled')){
                return;
            }

            value = !record.get('checked');
            record.set('checked', value);
            this.fireEvent('checkchange', record, value);
        }
    }
});