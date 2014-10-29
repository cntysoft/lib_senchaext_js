/*
 * Cntysoft Cloud Software Team
 * 
 * @author SOFTBOY <cntysoft@163.com>
 * copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * 出错错误提示
 */
Ext.define('SenchaExt.Tip.ErrorToolTip',{
    extend : 'Ext.tip.ToolTip',
    alias : 'cmperrortooltip',
    style :  'border:red 1px solid;background:#ffffff',
    statics : {
        ANCHOR_MAP : {
            top : 'borderBottomColor',
            bottom : 'borderTopColor',
            left : 'borderRightColor',
            right : 'borderLeftColor'
        }
    },
    afterRender : function()
    {
        var border = this.self.ANCHOR_MAP[this.anchor];
        this.anchorEl.setStyle(border, 'red');
        this.callParent();
    }
});