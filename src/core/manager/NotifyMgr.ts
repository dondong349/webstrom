module hc {
	export class NotifyMgr {
		private static _ins:NotifyMgr;
		private notify:any;
		public constructor() {
			this.notify = {};
		}
		public static getIns():NotifyMgr{
			if(!this._ins) this._ins = new NotifyMgr();
			return this._ins;
		}

		public addNotify(type:string,target:any,callBack:Function):void{
			let callAndTarget = this.notify[type];
			if(!callAndTarget) this.notify[type] = {};
			if(this.notify[type] && this.notify[type])
		}
	}
}