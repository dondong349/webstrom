module hc {
	export class BaseComponent extends eui.Component{
		private _data:any;
		public constructor() {
			super();
			this.addEventListener(eui.UIEvent.CREATION_COMPLETE,this.onCompleted,this);
		}
		/** 创建完成 */
		private onCompleted():void{
			this.removeEventListener(eui.UIEvent.CREATION_COMPLETE,this.onCompleted,this);
		}
		public onOpen():void{
			
		}
		/** 初始化界面 */
		public initUI():void{

		}
		/** 初始化事件 */
		public initEvent():void{

		}
		/** 初始化数据 */
		public initData(data):void{

		}
		/** 屏幕自适应 */
		public onResize():void{

		}
		/** closed */
		public onClose():void{
			if(this.parent) this.parent.removeChild(this);
		}
	}
}