module hc{
	/**
	 *
	 * @author 帅波
	 * @date 2016.11.30
	 * @description loader加载器，包含了版本管理
	 *
	 */
	export class ResMgr {
		private static instance: ResMgr;
		private versionJson:any;                //版本管理配置json
		private groupDic:any;
		public constructor() {
			this.versionJson={};
			this.groupDic={};
			RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
			RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
			RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR,this.onResourceILoadError,this);
			RES.setMaxRetryTimes(-2);
		}
		/**
		 * @description 获取单例对象
		 */
		public static getInstance(): ResMgr{
			if(ResMgr.instance==null){
				ResMgr.instance = new ResMgr();
			}
			return ResMgr.instance;
		}
		/**
		 * @description 当资源加载完毕
		 */
		private onResourceLoadComplete(evt: RES.ResourceEvent): void {
			for(let groupName in this.groupDic){
				if(groupName==evt.groupName){
					let groupLoader:GroupLoader = this.groupDic[groupName];
					if(groupLoader&&groupLoader.callback){
						groupLoader.callback.call(groupLoader.thisObject,evt);
					}
					delete this.groupDic[groupName];
				}
			}
		}
		/**
		 * @description 资源加载进度
		 */
		private onResourceProgress(evt: RES.ResourceEvent): void {
			for(let groupName in this.groupDic) {
				if(groupName == evt.groupName) {
					let groupLoader: GroupLoader = this.groupDic[groupName];
					if(groupLoader && groupLoader.progressCallBack) {
						groupLoader.progressCallBack.call(groupLoader.thisObject,evt);
					}
				}
			}
		}
		/**
		 * @description 资源加载出错
		 */
		private onResourceILoadError(evt: RES.ResourceEvent):void{
			for(let groupName in this.groupDic) {
				if(groupName == evt.groupName) {
					let groupLoader: GroupLoader = this.groupDic[groupName];
					if(groupLoader && groupLoader.failCallBack) {
						groupLoader.failCallBack.call(groupLoader.thisObject,evt);
					}
					delete this.groupDic[groupName];
				}
			}
		}
		/**
		 * @description 加载版本号文件
		 */
		public loadVersionConfig(url:string,callBack:Function,thisObject:any):void{
			if(url.indexOf("?")==-1){
				url = url+"?"+Date.now();
			}
			let self: ResMgr = this;
			RES.getResByUrl(url,function(data:any){
				self.versionJson = data.files;
				if(callBack){
					callBack.call(thisObject);
				}
			},this,RES.ResourceItem.TYPE_JSON);
		}
		/**
		 * @description 加载资源配置文件
		 */
		public loadConfig(url:string,callBack:Function,thisObject:any):void{
			if(url.indexOf("?") == -1) {
				if(this.versionJson[url]){
					url = url + "?" + this.versionJson[url];
				}
			}
			let self: ResMgr = this;
			RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,function(evt:RES.ResourceEvent){
				if(callBack){
					callBack.call(thisObject);
				}
			},this);
			RES.loadConfig(url,"resource/");
		}
		/**
		 * @description 加载资源组
		 */
		public loadGroup(groupName: string,callback: Function,progressCallBack:Function,failCallBack:Function,thisObject: any,priority:number=1):void{
			if(RES.isGroupLoaded(groupName)){
				if(callback){
					callback.call(thisObject);
				}
			}else{
				let groupLoader: GroupLoader = new GroupLoader(groupName,callback,progressCallBack,failCallBack,thisObject,priority);
				this.groupDic[groupLoader.groupName]=groupLoader;
				RES.loadGroup(groupName);
			}
		}
		/**
		 * @description 加载其它资源
		 */
		public loadItem(url: string,callBack: Function,thisObject: any,type:string):void{
			if(url.indexOf("?") == -1) {
				if(this.versionJson[url]) {
					url = url + "?" + this.versionJson[url];
				}
			}
			RES.getResByUrl(url,callBack,thisObject,type);
		}
		/**
		 * @description 根据url地址返回带版本号的url地址
		 */
		public getVersionUrl(url:string):string{
			if(url.indexOf("?") == -1) {
				if(this.versionJson[url]) {
					url = url + "?" + this.versionJson[url];
				}
			}
			return url;
		}
		/**
		 * @description 销毁资源
		 */
		public destoryRes(res:any):void{
			RES.destroyRes(res,true);
		}
	}
	/**
	 * @description 组加载器
	 */
	class GroupLoader{
		private _groupName:string;
		private _priority:number;
		public callback:Function;
		public progressCallBack:Function;
		public failCallBack:Function;
		public thisObject:any;
		public constructor(groupName: string,callback: Function,progressCallBack: Function,failCallBack:Function,thisObject: any,priority: number){
			this._groupName = groupName;
			this._priority = priority;
			this.callback = callback;
			this.progressCallBack=progressCallBack;
			this.failCallBack = failCallBack;
			this.thisObject = thisObject;
		}
		/**
		 * @description 获取组名
		 */
		public get groupName():string{
			return this._groupName;
		}
	}
}
