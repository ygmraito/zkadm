<template>
	<div class="z_plupload">
		<p class="z_drag_area" id="drag-area">
			<i class="el-icon-upload"></i><strong>上传大小{{max_file_size}}<br>类型：{{mime_types[0].extensions}}</strong>
		</p>
		<!--<div id="ossfile">你的浏览器不支持flash,Silverlight或者HTML5！</div>-->
		<div id="container">
			<a id="selectfiles" href="javascript:void(0);" class='btn'>选择文件</a>
			<a id="postfiles" href="javascript:void(0);" class='btn'>开始上传</a>
		</div>
		<!--<pre id="console"></pre>-->

		<div class="z_picture_list z_upload_list" v-show="Type=='picture'">
			<ul>
				<draggable v-model="PictureList" @update="datadragEnd" :options="{animation:500}">
					<transition-group>

						<li v-for="(item,index) in PictureList" :key="item.id">
							<div class="z_icon" :style="{backgroundImage:'url(' + item.url + ')'}">
								<!--<em class="iconfont icon-image" v-if="item.progress=='100'"></em>-->
								<div class="z_progress">
									<el-progress v-if="item.progress!='100'" type="circle" :stroke-width="ProgressCircle.StrokeWidth" :show-text="ProgressCircle.ShowText" :width="ProgressCircle.Width" :percentage="item.progress"></el-progress>
								</div>
							</div>
							<div class="z_cont">
								<strong>{{item.name}}</strong>
								<b>{{item.size}}</b>
							</div>

							<em class="iconfont icon-close" @click="Delete(item.id,'picture')"></em>
						</li>

					</transition-group>
				</draggable>
			</ul>

		</div>
		<div class="z_video_list z_upload_list" v-show="Type=='video'">
			<ul>
				<draggable v-model="VideoList" @update="datadragEnd" :options="{animation:500}">
					<transition-group>
						<li v-for="(item,index) in VideoList" :key="item.id">
							<div class="z_icon" :style="{backgroundImage:'url(' + item.url + ')'}">
								<em class="iconfont icon-video" v-if="item.progress=='100'"></em>
								<div class="z_progress">
									<el-progress v-if="item.progress!='100'" type="circle" :stroke-width="ProgressCircle.StrokeWidth" :show-text="ProgressCircle.ShowText" :width="ProgressCircle.Width" :percentage="item.progress"></el-progress>
								</div>
							</div>
							<div class="z_cont">
								<strong>{{item.name}}</strong>
								<b>{{item.size}}</b>
							</div>

							<em class="iconfont icon-close" @click="Delete(item.id,'video')"></em>
						</li>
					</transition-group>
				</draggable>
			</ul>
		</div>
		<div class="z_sound_list z_upload_list" v-show="Type=='sound'">
			<ul>
				<draggable v-model="SoundList" @update="datadragEnd" :options="{animation:500}">
					<transition-group>
						<li v-for="(item,index) in SoundList" :key="item.id">
							<div class="z_icon">
								<em class="iconfont icon-music" v-if="item.progress=='100'"></em>
								<div class="z_progress">
									<el-progress v-if="item.progress!='100'" type="circle" :stroke-width="ProgressCircle.StrokeWidth" :show-text="ProgressCircle.ShowText" :width="ProgressCircle.Width" :percentage="item.progress"></el-progress>
								</div>
							</div>
							<div class="z_cont">
								<strong>{{item.name}}</strong>
								<b>{{item.size}}</b>
							</div>

							<em class="iconfont icon-close" @click="Delete(item.id,'sound')"></em>
						</li>
					</transition-group>
				</draggable>
			</ul>
		</div>
	</div>
</template>
<script>
	import plupload from 'plupload'
	import draggable from 'vuedraggable'

	import '../../../static/plupload/lib/crypto1/crypto/crypto.js'
	import '../../../static/plupload/lib/crypto1/hmac/hmac.js'
	import '../../../static/plupload/lib/crypto1/sha1/sha1.js'
	import { RandomString, TimeTrans } from '@/utils/utils'
	var Base64 = require('js-base64').Base64
	var accessid = 'LTAI7ktfqgor5cZD'
	var accesskey = 'U4ktMoWNRcRlpjfX03lnux5CBSp8Y7'
	var host = 'https://makelive-hn1.oss-cn-shenzhen.aliyuncs.com'
	var g_dirname = 'picture'
	var g_object_name = ''
	var timestamp
	var now = timestamp = Date.parse(new Date()) / 1000;
	var policyText = {
		"expiration": "2020-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
		"conditions": [
			["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
		]
	}
	var policyBase64 = Base64.encode(JSON.stringify(policyText))
	var message = policyBase64
	var bytes = Crypto.HMAC(Crypto.SHA1, message, accesskey, {
		asBytes: true
	})
	var signature = Crypto.util.bytesToBase64(bytes);
	var uploader
	export default {
		props: ["UploadType"],
		name: 'upload',
		data() {
			return {

				ProgressCircle: {
					Width: 38,
					ShowText: true,
					StrokeWidth: 4,
				},
				mime_types: [{
					title: "picture",
					extensions: "image/*,jpg,jpeg,png,gif,bmp"
				}],
				max_file_size: '20m',
				PictureList: [],
				VideoList: [],
				SoundList: [],

				Type: 'picture',
			}
		},
		watch: {
			UploadType(curVal, oldVal) {
				g_dirname = curVal
				this.Type = g_dirname
				console.log(this.Type)
				if(curVal == 'picture') {
					this.max_file_size = '20m'
					this.mime_types = [{
						title: "picture",
						extensions: "image/*,jpg,jpeg,png,gif,bmp"
					}]
					uploader.setOption('filters', {
						max_file_size: this.max_file_size,
						mime_types: this.mime_types,
						prevent_duplicates: true
					})
				} else if(curVal == 'video') {
					this.max_file_size = '500m'
					this.mime_types = [{
						title: "video",
						extensions: "video/*,mp4"
					}]
					uploader.setOption('filters', {
						max_file_size: this.max_file_size,
						mime_types: this.mime_types,
						prevent_duplicates: true
					})
				} else if(curVal == 'sound') {
					this.max_file_size = '30m'
					this.mime_types = [{
						title: "sound",
						extensions: "audio/*,mp3"
					}]
					uploader.setOption('filters', {
						max_file_size: this.max_file_size,
						mime_types: this.mime_types,
						prevent_duplicates: true
					})
				}
			},
		},
		mounted() {
			var This = this
console.log("用户ID",This.Global.UserInfo.UserId )
			//为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
			document.body.ondrop = function(event) {
				event.preventDefault();
				event.stopPropagation();
			}

			uploader = new plupload.Uploader({
				runtimes: 'html5,flash,silverlight,html4',
				browse_button: 'selectfiles',
				//multi_selection: false,
				filters: { //上传文件限制
					mime_types: This.mime_types,
					max_file_size: This.max_file_size,
					prevent_duplicates: true //不允许选取重复文件
				},
				container: document.getElementById('container'),
				flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
				silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
				url: 'http://oss.aliyuncs.com',
				drop_element: 'drag-area',
				init: {
					PostInit: function(up, files) {
						//console.log("PostInit", up, files)
						//document.getElementById('ossfile').innerHTML = '';
						document.getElementById('postfiles').onclick = function() {
							This.set_upload_param(uploader, '', false);
							return false;
						};
					},
					FilesAdded: function(up, files) {
						//console.log("添加文件", up, files)
						plupload.each(files, function(file) {
							if(g_dirname == 'picture') {
								This.PictureList.push({
									id: file.id,
									name: file.name,
									size: plupload.formatSize(file.size),
									progress: 0
								})
							} else if(g_dirname == 'video') {
								This.VideoList.push({
									id: file.id,
									name: file.name,
									size: plupload.formatSize(file.size),
									progress: 0
								})
							} else if(g_dirname == 'sound') {
								This.SoundList.push({
									id: file.id,
									name: file.name,
									size: plupload.formatSize(file.size),
									progress: 0
								})
							}
							console.log("图片", This.PictureList, "视频", This.VideoList, "音频", This.SoundList)
							//							document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>' +
							//								'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>' +
							//								'</div>';
						});
					},
					BeforeUpload: function(up, file) {
						//console.log("file", file)
						//This.check_object_radio();
						This.set_upload_param(up, file.name, true, file.type, file);
					},
					UploadProgress: function(up, file) {
						This.UploadByValue(up, file)
						//						for(var i = 0; i < up.files.length; i++) {
						//							if(file.type == "image/jpg" || file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif") {
						//								for(var j = 0; j < This.PictureList.length; j++) {
						//									if(file.id == This.PictureList[j].id) {
						//										This.PictureList[j].progress = file.percent
						//										//console.log("ID等于", file.id, "：", This.PictureList[j].id, "进度", This.PictureList[j].progress)
						//									}
						//								}
						//							} else if(file.type == "video/mp4") {
						//								for(var j = 0; j < This.VideoList.length; j++) {
						//									if(file.id == This.VideoList[j].id) {
						//										This.VideoList[j].progress = file.percent
						//									}
						//								}
						//							} else if(file.type == "audio/mp3") {
						//								for(var j = 0; j < This.SoundList.length; j++) {
						//									if(file.id == This.SoundList[j].id) {
						//										This.SoundList[j].progress = file.percent
						//									}
						//								}
						//							}
						//						}
						//						var d = document.getElementById(file.id);
						//						d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
						//						var prog = d.getElementsByTagName('div')[0];
						//						var progBar = prog.getElementsByTagName('div')[0]
						//						progBar.style.width = 2 * file.percent + 'px';
						//						progBar.setAttribute('aria-valuenow', file.percent);
					},
					FileUploaded: function(up, file, info) {

						if(info.status == 200) {
							if(file.type == "image/jpg" || file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif") {
								for(var j = 0; j < This.PictureList.length; j++) {
									console.log("ID", file)

									if(This.PictureList[j].id == file.id) {
										This.PictureList.splice(j, 1, {
											url: This.Global.OssUrl + This.PictureList[j].url + This.Global.OssThumb,
											size: plupload.formatSize(file.size),
											name: file.name,
											progress: 100,
											id: file.id,
										});
									}

								}
							} else if(file.type == "video/mp4") {
								for(var j = 0; j < This.VideoList.length; j++) {
									console.log("ID", file)

									if(This.VideoList[j].id == file.id) {
										This.VideoList.splice(j, 1, {
											url: This.Global.OssUrl + This.VideoList[j].url + This.Global.OssVideoThumb,
											size: plupload.formatSize(file.size),
											name: file.name,
											progress: 100,
											id: file.id,
										});
									}

								}
							} else if(file.type == "audio/mp3") {
								for(var j = 0; j < This.SoundList.length; j++) {
									console.log("ID", file)

									if(This.SoundList[j].id == file.id) {
										This.SoundList.splice(j, 1, {
											url: This.Global.OssUrl + This.SoundList[j].url,
											size: plupload.formatSize(file.size),
											name: file.name,
											progress: 100,
											id: file.id,
										});
									}

								}
							}
							This.PostUploadData()
							//console.log("完成赋值",  This.PictureList)
							//This.UploadByValue(up, file)
							//document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'upload to oss success, object name:' + g_object_name;
						} else {
							//document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
						}
					},
					Error: function(up, err) {
						//console.log("上传错误", up, err)
						This.$message({
							message: err.message,
							type: 'warning'
						});

						//document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
					}
				}
			})
			uploader.init()
		},
		methods: {

			datadragEnd(evt) {
				evt.preventDefault();
				console.log('拖动前的索引 :' + evt.oldIndex)
				console.log('拖动后的索引 :' + evt.newIndex)
				console.log("拖动", this.PictureList);
				this.PostUploadData()
			},

			PostUploadData() {

				var CoverUrl
				if(this.PictureList.length >= 1) {
					CoverUrl = this.PictureList[0].url + this.Global.OssThumb
				} else {
					CoverUrl = this.VideoList[0].url + this.Global.OssVideoThumb
				}

				console.log("封面", CoverUrl)
				var Json = {
					picture: this.PictureList,
					video: this.VideoList,
					sound: this.SoundList,
					cover: CoverUrl,
				}

				this.$emit('UploadData', Json);
				console.log("更新", Json)
			},

			Delete(id, type) {
				var This = this

				if(type == 'picture') {

					for(var j = 0; j < This.PictureList.length; j++) {
						if(id == This.PictureList[j].id) {
							This.PictureList.splice(j, 1)

						}
					}

				} else if(type == 'video') {

					for(var j = 0; j < This.VideoList.length; j++) {
						if(id == This.VideoList[j].id) {
							This.VideoList.splice(j, 1)

						}
					}
				} else if(type == 'sound') {
					for(var j = 0; j < This.SoundList.length; j++) {
						if(id == This.SoundList[j].id) {
							This.SoundList.splice(j, 1)

						}
					}

				}
				console.log("删除", This.PictureList, This.VideoList, This.SoundList)
				This.PostUploadData()
			},
			UploadByValue(up, file) {
				var This = this
				for(var i = 0; i < up.files.length; i++) {
					if(file.type == "image/jpg" || file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif") {
						for(var j = 0; j < This.PictureList.length; j++) {
							if(file.id == This.PictureList[j].id) {
								This.PictureList[j].progress = file.percent
								//console.log("ID等于", file.id, "：", This.PictureList[j].id, "进度", This.PictureList[j].progress)
							}
						}
					} else if(file.type == "video/mp4") {
						for(var j = 0; j < This.VideoList.length; j++) {
							if(file.id == This.VideoList[j].id) {
								This.VideoList[j].progress = file.percent
							}
						}
					} else if(file.type == "audio/mp3") {
						for(var j = 0; j < This.SoundList.length; j++) {
							if(file.id == This.SoundList[j].id) {
								This.SoundList[j].progress = file.percent
							}
						}
					}
				}
			},
			set_upload_param(up, filename, ret, type, file) {
				//console.log("刚", file)
				var This = this
				var pos = filename.lastIndexOf('.')
				var suffix = ''
				if(pos != -1) {
					suffix = filename.substring(pos)
				}
				g_object_name = This.Global.UserInfo.UserId + "/" + type + "/" + TimeTrans(Date.now(), 'file') + "/" + Date.now() + RandomString(10) + suffix
console.log("上传日期********************",TimeTrans(Date.now(), 'file'))
				var new_multipart_params = {
					'key': g_object_name,
					'policy': policyBase64,
					'OSSAccessKeyId': accessid,
					'success_action_status': '200', //让服务端返回200,不然，默认会返回204
					'signature': signature,
				}
				up.setOption({
					'url': host,
					'multipart_params': new_multipart_params
				})
				up.start()
				for(var i = 0; i < up.files.length; i++) {
					if(type == "image/jpg" || type == "image/jpeg" || type == "image/png" || type == "image/gif") {
						for(var j = 0; j < This.PictureList.length; j++) {
							console.log("id", file.id, "：", This.PictureList[j].id)
							if(file.id == This.PictureList[j].id) {
								This.PictureList[j].url = g_object_name

							}

							//console.log("ID等于", file.id, "：", This.PictureList[j].id, "进度", This.PictureList[j].progress)

						}
					} else if(type == "video/mp4") {
						for(var j = 0; j < This.VideoList.length; j++) {
							if(file.id == This.VideoList[j].id) {
								This.VideoList[j].url = g_object_name
							}

						}
					} else if(type == "audio/mp3") {
						for(var j = 0; j < This.SoundList.length; j++) {
							if(file.id == This.SoundList[j].id) {
								This.SoundList[j].url = g_object_name
							}

						}
					}
				}
			},
		},
		components: {
			draggable
		},

	}
</script>
<style lang="scss" scoped>
	.test {
		border: 1px solid #ccc;
	}
	
	.drag-item {
		width: 200px;
		height: 50px;
		line-height: 50px;
		margin: auto;
		position: relative;
		background: #ddd;
		margin-top: 20px;
	}
	
	.ghostClass {
		opacity: 1;
	}
	
	.bottom {
		width: 200px;
		height: 50px;
		position: relative;
		background: blue;
		top: 2px;
		left: 2px;
		transition: all .5s linear;
	}
</style>