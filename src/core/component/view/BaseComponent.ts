module hc
{
	/**
	 *
	 * @desc 基本的UI界面显示类
	 *
	 */
	export class UIComponent extends eui.Component
	{
		private _data:any;
		public eventDic: any;
		private touchBeginTaret:any;
		protected isSkinLoaded:boolean;
		public constructor()
		{
			super();
			this.eventDic = {};
			this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onCreationComplete, this);
		}

		/**
		 * 组件初始化完毕
		 */
		protected onCreationComplete(evt: eui.UIEvent): void
		{
			this.initComponent();
			this.initData();
			this.initListener();
			this.isSkinLoaded=true;
			this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.onCreationComplete, this);
		}
		/**
		 * 初始化组件,需被子类继承
		 */
		protected initComponent(): void
		{

		}
		/**
		 * 初始化数据
		 */
		protected initData(): void
		{
			this.onStageResize();
		}

		/**
		 * @description 获取当前属于这个模块的数据
		 */
		public get data():any{
			return this._data;
		}
		/**
		 * @description 获取当前属于这个模块的数据
		 */
		public set data(data:any){
			this._data = data;
		}
		/**
		 * 初始化事件监听器,需被子类继承
		 */
		protected initListener(): void
		{
			//this.addEventListener(egret.Event.RESIZE, this.onStageResize, this);
			lemon.NotifyManager.registerNotify(lemon.StageUtil.STAGE_RESIZE, this.onStageResize, this);
		}
		protected onStageResize(){

		}
		/**
		 * 事件注册，所有事件的注册都需要走这里
		 */
		public addEvent(target:egret.EventDispatcher,type:string,callBack:Function,thisObject:any):void{
			var eventParams: any = {};
			eventParams.target = target;
			eventParams.type = type;
			eventParams.callBack = callBack;
			eventParams.thisObject = thisObject;
			if(target) {
				target.addEventListener(type,callBack,thisObject);
				this.eventDic[target.hashCode + type]=eventParams;
			}
		}
		/**
		 * @description 添加点击函数
		 */
		protected addClickEvent(target:egret.EventDispatcher,callBack:Function,thisObject:any):void{
			var eventParams: any = {};
			eventParams.target = target;
			eventParams.type = egret.TouchEvent.TOUCH_BEGIN;
			if(target) {
				target.addEventListener(eventParams.type,this.onTouchBegin,this);
				this.eventDic[target.hashCode + eventParams.type] = eventParams;
			}
			var eventParamsEnd: any = {};
			eventParamsEnd.target = target;
			eventParamsEnd.type = egret.TouchEvent.TOUCH_END;
			eventParamsEnd.callBack = callBack;
			eventParamsEnd.thisObject = thisObject;
			if(target) {
				target.addEventListener(eventParamsEnd.type,this.onTouchEnd,this);
				this.eventDic[target.hashCode + eventParamsEnd.type] = eventParamsEnd;
			}
			var eventParamsOutSide: any = {};
			eventParamsOutSide.target = target;
			eventParamsOutSide.type = egret.TouchEvent.TOUCH_RELEASE_OUTSIDE;
			if(target) {
				target.addEventListener(eventParamsOutSide.type,this.onTouchReleaseOutSide,this);
				this.eventDic[target.hashCode + eventParamsOutSide.type] = eventParamsOutSide;
			}
		}
		/**
		 * @description 当点击开始
		 */
		private onTouchBegin(evt:egret.TouchEvent):void{
			this.touchBeginTaret = evt.target;
			egret.Tween.get(evt.target).to({scaleX:0.9,scaleY:0.9},50);
		}
		/**
		 * @description 当点击结束
		 */
		private onTouchEnd(evt:egret.TouchEvent):void{
			let self:any=this;
			let target:any=evt.target;
			if(this.touchBeginTaret != target) return;
			this.touchBeginTaret = null;
			egret.Tween.get(target).to({ scaleX: 1,scaleY:1 },50).call(function(){
				for(let key in self.eventDic) {
					let eventParams: any = self.eventDic[key];
					if(eventParams.target == target && eventParams.type == egret.TouchEvent.TOUCH_END) {
						eventParams.callBack.call(eventParams.thisObject);
					}
				}
			},this);
		}
		/**
		 * @description 当点击结束的时候，按钮不在被点击的对象上
		 */
		private onTouchReleaseOutSide(evt:egret.TouchEvent):void{
			if(this.touchBeginTaret != evt.target) return;
			this.touchBeginTaret = null;
			evt.target.scaleX=1;
			evt.target.scaleY=1;
		}
		/**
		 * 统一移除所有事件
		 */
		protected removeAllEvent(): void
		{
			let tempEvent;
			for(let name in this.eventDic) {
				tempEvent = this.eventDic[name];
				if (tempEvent.target != null)
				{
					tempEvent.target.removeEventListener(tempEvent.type, tempEvent.callBack, tempEvent.thisObject);
				}
				delete this.eventDic[name];
			}
			this.eventDic = {};
		}
		/**
		 * 资源释放
		 * @$isDispos 是否彻底释放资源
		 */
		public dispos($isDispos: boolean = false): void
		{
			lemon.NotifyManager.removeThisObjectNofity(this);
			this.removeAllEvent();
			this.touchBeginTaret = null;
			this._data = null;
			if ($isDispos)
			{
				//todo释放资源
			}
			if (this.parent)
			{
				this.parent.removeChild(this);
			}
		}
	}
}
