module hc {
	export class UILayer extends egret.DisplayObjectContainer{
		private _views:any;
		private _currentView:any;
		public constructor() {
			super();
			this._views = {};
		}
		
		public openView(viewName:string,data?:any,zIndex?:number):void{
			//关闭当前打开界面
			if(this._currentView){
				this.closeView(this._currentView);
			}
			let view = this._views[viewName];
			if(view){
				if(view.isShow){
					view.initData(data);
				} else {
					view.onOpen(data);
					view.initListener();
					this.addChild(view);
				}		
			} else {
				view = eval("new "+ viewName);
				this._views[viewName] = view;
				this.addChild(view);
			}

			this._currentView = view;
		}

		/** 关闭该界面 */
		public closeView(viewName:string|any,callBack?:Function,target?:any):void{
			let view = viewName;
			if(typeof(view) != "string"){
				view = this._views[viewName];
			}
			if(view){
				view.onClosed();
				if(callBack) {
					callBack.call(target);
				}
			} else {
				console.info("不存在该界面");
			}
		}
	}
}