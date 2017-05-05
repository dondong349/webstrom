module hc {
	export class TipLayer extends egret.DisplayObjectContainer{
		private tipViewPool:Array<any>;
		public constructor() {
			super();
		}
		public openView(viewName:string,data?:any,zIndex?:number):void{
			let view = eval("new "+ viewName);
			this.addChild(view);
		}
	}
}