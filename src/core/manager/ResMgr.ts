/** 封装RES，实现加载资源逻辑 */
module hc {
	export class ResMgr {
		private static _ins:ResMgr;

		private resGroups:Array<string>;
		private isLoadedGroups:Array<string>;

		public constructor() {
			this.resGroups = [];
			this.isLoadedGroups = [];
		}
		public static getIns():ResMgr{
			if(!this._ins) this._ins = new ResMgr();
			return this._ins;
		}
		private isInLoadingGroup(resGroup:string):boolean{
			for(let i=0;i<this.resGroups.length;i++){
				if(this.resGroups[i] == resGroup) return true;
			}
			return false;
		}
		private delFromResGroups(resGroup:string):void{
			for(let i=0;i<this.resGroups.length;i++){
				if(this.resGroups[i] == resGroup) {
					this.isLoadedGroups.push(this.resGroups.splice(i,1)[0]);
					return;
				}
			}
		}
		private isLoaded(resGroup:string):boolean{
			for(let i=0;i<this.isLoadedGroups.length;i++){
				if(this.isLoadedGroups[i] == resGroup) return true;
			}
			return false;
		}

		public loadGroup(resGroup:string):void{
			if(this.isInLoadingGroup(resGroup)) return;
			this.resGroups.push(resGroup);
			if(this.resGroups.length == 0) {
				RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
				RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
				RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
				RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
			}
			RES.loadGroup(resGroup);
		}
		/**
		 * preload资源组加载完成
		 * preload resource group is loaded
		 */
		private onResourceLoadComplete(event:RES.ResourceEvent):void {
			this.delFromResGroups(event.groupName);
			if (this.resGroups.length == 0) {
				RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
				RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
				RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
				RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
			}
		}
		/**
		 * 资源组加载出错
		 *  The resource group loading failed
		 */
		private onItemLoadError(event:RES.ResourceEvent):void {
			console.warn("Url:" + event.resItem.url + " has failed to load");
		}
		/**
		 * 资源组加载出错
		 * Resource group loading failed
		 */
		private onResourceLoadError(event:RES.ResourceEvent):void {
			//TODO
			console.warn("Group:" + event.groupName + " has failed to load");
			//忽略加载失败的项目
			//ignore loading failed projects
			this.onResourceLoadComplete(event);
		}

		/**
		 * preload资源组加载进度
		 * loading process of preload resource
		 */
		private onResourceProgress(event:RES.ResourceEvent):void {
			if (event.groupName == "preload") {
				//this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
			}
		}
	}
}