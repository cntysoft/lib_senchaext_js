/**
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
/**
 * WebOs平台数据调用代理，广泛运用在Grid 和 Tree 组建中， 底层使用WebOs数据网关跟后端系统通信
 */
Ext.define('SenchaExt.Data.Proxy.ApiProxy', {
   extend : 'Ext.data.proxy.Server',
   alias : 'proxy.apigateway',
   requires : [
      'Cntysoft.Framework.Net.Gateway',
      'Cntysoft.Framework.Net.Request'
   ],
   /**
    * 数据调用网关
    *
    * @property {Cntysoft.Framework.Network.Gateway} gateway
    */
   gateway : null,
   /**
    * 调用的类型, 系统支持两种调用类型
    *
    * * {@link Cntysoft.Framework.Network.Gateway#static-property-CALL_TYPE_SYS}
    * * {@link Cntysoft.Framework.Network.Gateway#static-property-CALL_TYPE_APP}
    * @property {String} callType
    */
   callType : null,
   /**
    * 请求元信息
    *
    * @property {Object} invokeMetaInfo
    */
   invokeMetaInfo : null,
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
      meta = this.invokeMetaInfo;
      if(null == this.callType){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'constructor',
            'call type must not be null'
         );
      }
      if(null == meta){
         Cntysoft.raiseError(
            Ext.getClassName(this),
            'constructor',
            'invoke meta info must not be null'
         );
      }
      //匹配检查下放到Request对象中检查
      this.gateway = Cntysoft.Framework.Net.Gateway;
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
    * @return {Cntysoft.Framework.Network.Request}
    */
   buildRequest : function(operation)
   {
      var request;
      var invokeParams = {};
      var meta;
      request = new Cntysoft.Framework.Net.Request(this.callType);
      meta = this.getInvokeMetaInfo();
      this.pArgs.each(function(k, v){
         invokeParams[k] = v;
      });
      //invoke 参数优先级高
      Ext.apply(invokeParams, this.getInvokeParams(), operation.getParams() ||{});
      Ext.apply(invokeParams, {
         start : operation.getStart(),
         limit : operation.getLimit()
      });
      request.setSync(false);
      request.setInvokeInfo(meta, this.callType);
      invokeParams = this.invokeParamsReady(invokeParams);
      request.set(invokeParams);
      return request;
   },
   /**
    * 本次API调用参数就绪
    *
    * @param {Object} invokeParams
    */
   invokeParamsReady : function(invokeParams)
   {
      return invokeParams;
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
      //系统在这里只能是异步的请求
      request.setSync(false);
      request.setCallbacks({
         callback : this.createRequestCallback(request, operation, callback, scope),
         scope : this
      });
      //设置系统参数 回调函数等等
      this.gateway.call(request);
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
   /**
    * 资源清除
    */
   destroy : function()
   {
      me.gateway = null;
      this.pArgs.clear();
      this.callParent();
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
      return me.gateway.getCallback(function(response){
         var data;
         if(false == response.status){
            var errContext = response.errorInfo.context;
            data = [];
            //这里需要探测是否是认证信息失效如果是的，那么重新引导
            //抛出异常
            //if(errContext == 'Cntysoft.Framework.UserCenter.ErrorType'){
            //   if(10037 == response.errorCode){
            //      Cntysoft.showErrorWindow(Cntysoft.GET_LANG_TEXT('MSG.SYS_AUTH_FAIL'), function(){
            //         Cntysoft.WebOs.logout(true);
            //      }, this);
            //      return;
            //   }
            //}
            Cntysoft.raiseError(
               Ext.getClassName(this),
               'createRequestCallback',
               me.getInvokeMetaInfoItem('name') +' '+ response.msg
            );
         } else{
            data = me.onDataReady(response.data);
            if(me.hasListeners.dataready){
               me.fireEvent('dataready', data);
            }
         }
         me.rawData = data;
         me.processResponse(response.status, operation, request, data, callback, scope);
         //对调用参数清空
         me.invokeParams = {};
      });
   },
   /**
    * 当数据准备好之后调用的数据的处理器
    *
    * @template
    * @param {Object} data
    */
   onDataReady : function(data)
   {
      return data;
   }
});