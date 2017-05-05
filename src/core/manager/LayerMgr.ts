/**
 * @desc 游戏layer管理
 */
module hc {
	export class LayerMgr {
		private static ins:LayerMgr;
		private root:eui.UILayer;
		private _bottomLayer:BottomLayer;
		private _uiLayer:UILayer;
		private _popLayer:PopLayer;
		private _tipLayer:TipLayer;
		public constructor() {
		}
		public static getIns():LayerMgr{
			if(!this.ins) this.ins = new LayerMgr();
			return this.ins;
		}
		public init(root:eui.UILayer):void{
			this.root = root;
			this._bottomLayer = new BottomLayer();
			this._uiLayer = new UILayer();
			this._popLayer = new PopLayer();
			this._tipLayer = new TipLayer();

			this.root.addChild(this._bottomLayer);
			this.root.addChild(this._uiLayer);
			this.root.addChild(this._popLayer);
			this.root.addChild(this._tipLayer);
		}
		/** 打开界面操作 */
		public openView(view:string,data?:any,layerType?:number,zIndex?:number):void{
			let parentLayer:egret.DisplayObjectContainer;
			switch(layerType) {
				case LayerType.BOTTOM:
					parentLayer = this._bottomLayer;
					break;
				case LayerType.POP:
					parentLayer = this._popLayer;
					break;
				case LayerType.TIP:
					parentLayer = this._tipLayer;
					break;
				default:
					parentLayer = this._uiLayer;
					break;
			}
			parentLayer.openView(view,data,zIndex);
		}
		public get bottomLayer():egret.DisplayObjectContainer{
			return this._bottomLayer;
		}
		public get uiLayer():egret.DisplayObjectContainer{
			return this._uiLayer;
		}
		public get popLayer():egret.DisplayObjectContainer{
			return this._popLayer;
		}
		public get tipLayer():egret.DisplayObjectContainer{
			return this._tipLayer;
		}
	}
}