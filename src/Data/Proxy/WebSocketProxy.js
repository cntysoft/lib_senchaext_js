/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */

/**
 * WebOs平台数据调用代理，使用websocket通道
 */
Ext.define("SenchaExt.Data.Proxy.WebSocketProxy", {
   extend: "Ext.data.proxy.Server",
   alias: "proxy.websocketgateway",
   requires: [
      "Cntysoft.Framework.Rpc.Request",
      "Cntysoft.Framework.Rpc.ServiceInvoker"
   ],
   /**
    * 数据调用网关
    * 
    * @var {Cntysoft.Framework.Rpc.ServiceInvoker} serviceInvoker
    */
   serviceInvoker : null,
   /**
    * 请求元信息
    *
    * @property {Object} invokeMetaInfo
    */
   invokeMetaInfo : null,
   
   /**
    * websocket entry 
    * 
    * @property {String} websocketEntryName
    */
   websocketEntryName : null,
   /**
    * 请求参数对象
    *
    * @property {Object} invokeParams
    */
   invokeParams : null,
   /**
    * 需要集成的参数字段名称
    *
    * @property {Array} paramFields
    */
   paramFields : [],
   /**
    * 原始数据
    *
    * @property {Object} rawData
    */
   rawData : null,
   /**
    * 跨请求的参数,多次请求保持不变
    *
    * @property {Ext.util.HashMap} pArgs
    */
   pArgs : null,
   /**
    * 构造函数
    *
    * 在这里进行相关调用数据的格式检测
    *
    * @property {Object} config
    */
   constructor : function(config)
   {
      var meta;
      var arg;
      var pArgs;
      Ext.apply(this, config);
      this.callParent([config]);
      if(null == this.invokeMetaInfo){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'constructor',
            'invoke meta info must not be null'
         );
      }
      if(null == this.websocketEntryName){
          Cntysoft.raiseError(
            Ext.getClassName(this),
            'constructor',
            'websocketEntryName must not be null'
         );
      }
      //匹配检查下放到Request对象中检查
      var websocketUrl = CloudController.Kernel.Funcs.getWebSocketEntry(this.websocketEntryName);
      this.serviceInvoker = new Cntysoft.Framework.Rpc.ServiceInvoker({
         serviceHost: websocketUrl,
         listeners : {
            connecterror : function(invoker, event){
               Cntysoft.raiseError(Ext.getClassName(this), "run", "connect to websocket server " + websocketUrl + " error");
               
            },
            scope : this
         }
      });
      pArgs = new Ext.util.HashMap();
      if(Ext.isArray(this.pArgs) && this.pArgs.length > 0){
         var arg;
         for(var i = 0; i < this.pArgs.length; i++) {
            arg = this.pArgs[i];
            pArgs.add(arg.key, arg.value);
         }
      }else if(Ext.isObject(this.pArgs)){
         for(var key in this.pArgs){
            pArgs.add(key, this.pArgs[key]);
         }
      }
      this.pArgs = pArgs;
   },
   
   /**
    * 创建请求对象
    *
    * @return {Cntysoft.Framework.Rpc.Request}
    */
   buildRequest : function(operation)
   {
      var request;
      var invokeParams = {};
      var meta = this.getInvokeMetaInfo();
      
      this.pArgs.each(function(k, v){
         invokeParams[k] = v;
      });
      //invoke 参数优先级高
      Ext.apply(invokeParams, this.getInvokeParams(), operation.getParams() ||{});
      Ext.apply(invokeParams, {
         start : operation.getStart(),
         limit : operation.getLimit()
      });
      if(Ext.isFunction(this.invokeParamsReady)){
         invokeParams = this.invokeParamsReady(invokeParams);
      }
      request = new Cntysoft.Framework.Rpc.Request(meta.name, meta.method, invokeParams);
      return request;
   },
   
   /**
    * 进行数据请求
    *
    * @param {Ext.data.Operation} operation The Ext.data.Operation object
    * @param {Function} callback The callback function to call when the Operation has completed
    * @param {Object} scope The scope in which to execute the callback
    */
   doRequest : function(operation, callback, scope)
   {
      var request = this.buildRequest(operation);
      this.serviceInvoker.request(request,  this.createRequestCallback(request, operation, callback, scope), scope);
   },
   
   /**
    * @param {Cntysoft.Framework.Network.Request} request The Request object
    * @param {Ext.data.Operation} operation The Operation being executed
    * @param {Function} callback The callback function to be called when the request completes. This is usually the callback
    * passed to doRequest
    * @param {Object} scope The scope in which to execute the callback function
    * @return {Function} The callback function
    */
   createRequestCallback : function(request, operation, callback, scope)
   {
      var me = this;
      var fn = function(response){
         var data;
         if(false == response.status){
            var errContext = response.errorInfo.context;
            data = [];
            //这里需要探测是否是认证信息失效如果是的，那么重新引导
            //抛出异常
            //if(errContext == "Cntysoft.Framework.UserCenter.ErrorType"){
            //   if(10037 == response.errorCode){
            //      Cntysoft.showErrorWindow(Cntysoft.GET_LANG_TEXT("MSG.SYS_AUTH_FAIL"), function(){
            //         Cntysoft.WebOs.logout(true);
            //      }, this);
            //      return;
            //   }
            //}
            Cntysoft.raiseError(
               Ext.getClassName(this),
               "createRequestCallback",
               me.getInvokeMetaInfoItem("name") +" "+ response.msg
            );
         } else{
            if(Ext.isFunction(me.onDataReady)){
               data = me.onDataReady(response.getExtraData());
            }else{
               data = response.getExtraData();
            }
            if(me.hasListeners.dataready){
               me.fireEvent("dataready", data);
            }
         }
         me.rawData = data;
         me.processResponse(response.status, operation, request, data, callback, scope);
         //对调用参数清空
         me.invokeParams = {};
      }
      return fn;
   },
   
   /**
    * 设置调用元信息
    *
    * @param {Object} meta
    * @return {Cntysoft.Extend.Data.Proxy.ApiProxy}
    */
   setInvokeMetaInfo : function(meta)
   {
      if(!Ext.isObject(meta)){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'setInvokeMetaInfo',
            'param meta must be the type of Object'
         );
      }
      this.invokeMetaInfo = meta;
      return this;
   },
   /**
    * 获取调用元信息
    *
    * @return {Object}
    */
   getInvokeMetaInfo : function()
   {
      return this.invokeMetaInfo;
   },
   /**
    * 设置调用元信息
    *
    * @param {String} key
    * @param {Mixed} value
    * @return {Cntysoft.Extend.Data.Proxy.ApiProxy}
    */
   setInvokeMetaInfoItem : function(key, value)
   {
      var me = this;
      if(null == me.invokeMetaInfo){
         me.invokeMetaInfo = {};
      }
      me.invokeMetaInfo[key] = value;
      return this;
   },
   /**
    * 获取调用元信息项数据
    *
    * @param {String} key
    * @return {mixed}
    */
   getInvokeMetaInfoItem : function(key)
   {
      //@todo 需要检测是否未字符串吗？
      return this.invokeMetaInfo[key] || null;
   },
   /**
    * 设置调用参数
    *
    * @param {String} key
    * @param {Mixed} value
    * @return {Cntysoft.Extend.Data.Proxy.ApiProxy}
    */
   setInvokeParam : function(key, value)
   {
      if(null == this.invokeParams){
         this.invokeParams = {};
      }
      this.invokeParams[key] = value;
      return this;
   },
   /**
    * 设置持久化的参数
    *
    * @param {String} key
    * @param {String} value
    */
   setPermanentArg : function(key, value)
   {
      this.pArgs.add(key, value);
   },
   /**
    * 获取调用参数数据
    *
    * @param {String}
    * @return {Mixed}
    */
   getInvokeParam : function(key)
   {
      //@todo 需要检测是否未字符串吗？
      return this.invokeParams[key] || null;
   },
   /**
    * 获取系统请求参数
    *
    * @return {Object}
    */
   getInvokeParams : function()
   {
      return this.invokeParams;
   },
   /**
    * 设置系统请求参数
    *
    * @param {Object} params
    * @return {Cntysoft.Extend.Data.Proxy.ApiProxy}
    */
   setInvokeParams : function(params)
   {
      this.invokeParams = params;
      return this;
   },
   
   destroy : function()
   {
      Ext.destroy(this.serviceInvoker);
      delete this.serviceInvoker;
      this.callParent();
   }
});