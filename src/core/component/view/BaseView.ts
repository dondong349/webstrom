module hc {
	/**
	 *
	 * @author 帅波
	 * @date 2016.12.05
	 * @description 所有模块的基类
	 *
	 */
	export class BaseModule extends UIComponent{
		/**
		 * _data: {
		 * 		index:number   打开第几个子界面
		 * }
		 */
		private _isShow:boolean;
		private _qmrSkinName:string;
		public  resName:string;      //模块所引用的资源组

		//采用 addClickEvent 监听的控件，必须要触发了touchBegin才能做touchEnd
		//private touchBeginTaret;
		public constructor() {
			super();
		}

		/**
		 * 组件初始化完毕
		 */
		protected onCreationComplete(evt: eui.UIEvent): void
		{
			super.onCreationComplete(evt);
		}
		protected onStageResize(evt?:egret.Event):void{
			this.width = lemon.StageUtil.stageWidth;
			this.height = lemon.StageUtil.stageHeight;
		}
		/**
		 * @description 设置皮肤名字,需要在构造函数里面调用
		 */
		public set qmrSkinName(value:string){
			this._qmrSkinName=value;
		}
		/**
		 * @description 初始化组件,需被子类继承
		 */
		protected initComponent():void{
		}
		/**
		 * @description 初始化事件,需被子类继承
		 */
		protected initListener():void{
			super.initListener();
		}
		/**
		 * @description 初始化数据,需被子类继承
		 */
		protected initData():void{
			super.initData();
		}
		/**
		 * @description 打开模块
		 * @param needLoadSkin 是否需要加载皮肤，这个在模块管理器ModuleManager里面自动判断了
		 * @param data 打开模块时，需要向这个模块传递的一些数据
		 * @param layer 当前模块所处的层级
		 */
		public openModule(needLoadSkin:boolean,data:any,layer:number):void{
			this.data = data;
			if(needLoadSkin){
				this.skinName = this._qmrSkinName;
			}else{
				this.initData();
				this.initListener();
			}
			this.show(layer);
		}
		/**
		 * @description 显示模块
		 */
		private show(layer:number,zIndex?:number):void{
			this._isShow = true;
			//this.height = lemon.StageUtil.stageHeight;
			LayerManager.getInstance().addDisplay(this,layer);
		}
		/**
		 * @description 获取当前模块的显示状态
		 */
		public get isShow():boolean{
			return this._isShow;
		}
		/**
		 * @description 获取模块中某个控件在舞台中的位置
		 */
		public getComponentGlobalPoint(componentName:string):any{
			let component:egret.DisplayObject=this[componentName];
			if(component){
				if(component.parent){
					return component.parent.localToGlobal(component.x,component.y);
				}else{
					return component.localToGlobal(component.x,component.y);
				}
			}
			return {x:0,y:0};
		}
		/**
		 * @description 资源释放
		 */
		public dispos():void{
			lemon.NotifyManager.removeThisObjectNofity(this);
			for(let key in this.eventDic){
				let eventParams:any=this.eventDic[key];
				if(eventParams.target){
					eventParams.target.removeEventListener(eventParams.type,eventParams.callBack,eventParams.thisObject);
				}
				delete this.eventDic[key];
			}
			this._isShow=false;
			if(this.parent){
				this.parent.removeChild(this);
			}
		}
	}
}
