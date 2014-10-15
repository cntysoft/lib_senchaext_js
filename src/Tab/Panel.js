/**
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define('Cntysoft.SenchaExt.Tab.Panel', {
    extend : 'Ext.tab.Panel',
    alias : 'widget.addbuttontabpanel',
    requires : [
        'Cntysoft.SenchaExt.Tab.AddButton'
    ],
    tabPosition : 'bottom',
    border : false,
    bodyBorder : false,
    /**
     * 空白对象生成回调函数
     * 
     * @return {Ext.Component}
     */
    blankObjGenerator : Ext.emptyFn,
    initComponent : function()
    {
        this.callParent();
        this.tabBar.add({
            xtype : 'tabaddbutton',
            tabPanel : this
        });
        this.tabBar.addListener({
            add : this.tabAddedHandler,
            remove : this.tabRemoveHandler,
            scope : this
        });
        /**
         * 初始化之前items里面就有值的话会导致这些TAB的关闭事件不能捕捉
         */
        this.addListener({
            afterrender : function(){
                this.items.each(function(item){
                    item.addListener({
                        beforeclose : this.beforeTabCloseHandler,
                        close : this.tabCloseHandler,
                        scope : this
                    });
                }, this);
            },
            scope : this
        });
    },
    tabAddedHandler : function(tabBar, tab)
    {
        tab.addListener({
            beforeclose : this.beforeTabCloseHandler,
            close : this.tabCloseHandler,
            scope : this
        });
    },
    tabRemoveHandler : function(tabBar, tab)
    {
        tab.removeListener('beforeclose', this.beforeTabCloseHandler, this);
        tab.removeListener('close', this.tabCloseHandler, this);
    },
    beforeTabCloseHandler : function(tab)
    {
        if(this.hasListeners.beforetabclose){
            return this.fireEvent('beforetabclose', this, tab);
        }
    },
    tabCloseHandler : function(panel)
    {
        if(this.hasListeners.tabclose){
            return this.fireEvent('tabclose', this, panel);
        }
    },
    destroy : function()
    {
        delete this.startupComponent;
        this.callParent();
    }
});