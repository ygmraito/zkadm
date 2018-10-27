<template>
	<div class="app-container">

		<v-uploader :multiple="true" @done="UploadMultipleDone" deleteFileUrl="/api/upload/delete_record_multiple" upload-file-url="/api/upload/upload_record_multiple" @before-upload="MultipleBeforeUpload" file-size-limit="10mb" file-type-exts="png,jpg,jpeg,gif"></v-uploader>

		<el-form ref="Form" :model="Form" class="el-form el-form--label-left">
			<el-form-item label="标题" class="is-required">
				<el-input placeholder="输入标题" v-model="Form.Title">

				</el-input>
			</el-form-item>

			<el-form-item label="分类" class="is-required">
				<el-autocomplete style=" width: 100%;" class="filter-item" v-model="Form.Classify" :fetch-suggestions="querySearchAsync" placeholder="输入类型关键字" @select="handleSelect"></el-autocomplete>

			</el-form-item>

			<el-form-item>
				<el-radio-group v-model="tabPosition" @change="UpLoadType">
					<el-radio-button label="picture">图片</el-radio-button>
					<el-radio-button label="video">视频</el-radio-button>
					<el-radio-button label="sound">音频</el-radio-button>
				</el-radio-group>

			</el-form-item>
			<el-form-item v-show="tabPosition=='picture'">
				<el-upload class="upload-demo" drag action="/api/upload/upload" enctype="multipart/form-data" :data="{'class':'record','type':'picture'}" auto-upload :on-progress="UploadProgress" :on-error="UploadError" :on-success="UploadSuccess" :before-upload="PicturebeforeUpload">
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
					<div class="el-upload__tip" slot="tip">只能上传jpg，且不超过2mb</div>
				</el-upload>
			</el-form-item>

			<el-form-item v-show="tabPosition=='sound'">
				<el-upload class="upload-demo" drag action="/api/upload/upload" enctype="multipart/form-data" :data="{'class':'record','type':'sound'}" auto-upload :on-error="UploadError" :on-success="UploadSuccess" :before-upload="SoundBeforeUpload">
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将音频拖到此处，或<em>点击上传</em></div>
					<div class="el-upload__tip" slot="tip">只能上传mp3，且不超过10mb</div>
				</el-upload>
			</el-form-item>

			<el-button type="text" @click="PreviewVideo.Visible = true">点击打开 Dialog</el-button>

			<el-dialog title="提示" :visible.sync="PreviewVideo.Visible" width="30%" :before-close="handleClose">

				<VideoPlayer :VideoAuto="PreviewVideo.Auto" :VideoClose="PreviewVideo.Close" :VideoUrl="PreviewVideo.Url" :VideoCover="PreviewVideo.Cover"></VideoPlayer>

				<span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="PreviewVideo.Visible = false">确 定</el-button>
                </span>

			</el-dialog>

			<el-form-item v-show="tabPosition=='video'">

				<el-progress type="circle" :percentage="GetUploadProgress"></el-progress>
				<el-upload class="upload-demo" accept="video/mp4" drag action="/api/upload/upload_progress" :data="{'class':'record','type':'video'}" :on-error="UploadError" :on-success="UploadSuccess" :on-progress="UploadProgress" :on-remove="UploadRemove" :before-upload="VideobeforeUpload">
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将视频拖到此处，或<em>点击上传</em></div>
					<div class="el-upload__tip" slot="tip">只能上传mp4，且不超过50mb</div>
				</el-upload>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" :loading="SubmitLoading" @click="Submit" :disabled="BanSubmit">立即添加</el-button>

				<el-button>返回</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import VideoPlayer from '../../template/video_player.vue'

	var UploadProgress

	export default {
		name: 'Release',
		data() {
			return {
				PreviewVideo: {
					Visible: false,
					Close: false,
					Auto: true,
					Url: "",
					Cover: "",
				},

				tabPosition: 'picture',
				restaurants: [],
				BanSubmit: false,
				SelectLoading: false,
				UploadLoading: false,
				SubmitLoading: false,
				timeout: null,
				oss: '',
				Form: {
					Title: '',
					Classify: '',

					Sound: '',
					Picture:[],
					Sound: [],
					Video: []
				},
				GetUploadProgress: 0,
			}
		},

		components: {
			VideoPlayer
		},
		mounted() {

		},
		methods: {
			MultipleBeforeUpload(id, name) {
				console.log("开始", id, name)
			},
			handleClose(done) {
				done();
			},
			UpLoadType(value) {
				//console.log(value)
			},
			querySearchAsync(queryString, cb) {
				let This = this

				This.$axios.get(This.Global.ServerSrc + '/admin/record/check_classify', {
					params: {
						Classify: This.Form.Classify
					}
				}).then(function(Res) {
					var restaurants = Res;
					var results = queryString ? restaurants.filter(This.createStateFilter(queryString)) : restaurants;
					clearTimeout(This.timeout);
					This.timeout = setTimeout(() => {
						cb(results);
					}, 1000 * Math.random());
					//console.log(Res)
				})
			},
			createStateFilter(queryString) {
				//console.log("解析", queryString)
				return(state) => {
					return(state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
			},
			Submit() {
				let This = this
				console.log("提交数据", "标题", this.Form.Title, "分类", this.Form.Classify, "作者", "音频", this.Form.Sound, "视频", this.Form.Video, "图片", this.Form.Picture)
				this.$axios.post(this.Global.ServerSrc + '/admin/record/release_record', { //加载我的
					Title: this.Form.Title,
					Classify: this.Form.Classify,
					Sound: JSON.stringify(this.Form.Sound),
					Video: JSON.stringify(this.Form.Video),
					Picture: JSON.stringify(this.Form.Picture)
				}).then(function(State) {
					if(State.ReleaseState == "Success") {
						This.$message.success('添加成功!')
					} else {
						This.$message.error('添加失败，请重新试!')
					}
				})
			},
			querySearch(queryString, cb) {
				var restaurants = this.restaurants;
				var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			createFilter(queryString) {
				return(restaurant) => {
					return(restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
			},
			handleSelect(item) {
				//console.log(item);
			},
			UploadProgress(event, file, fileList) {
				//this.UploadLoading = true
				console.log("上传进度", event, file, fileList)
			},
			UploadPreview(type) {

				console.log("预览视频", type)
				if(type == 'video') {

					//this.PreviewVideo.Visible = true
					//this.PreviewVideoVisible=true
				}
			},
			UploadRemove(res, file) {
				console.log(res, ":", file)
				var UploadRemoveData = []
				for(var i = 0; i < file.length; i++) {

					UploadRemoveData.push(file[i].response.file_url)
				}
				this.Form.Video = UploadRemoveData
				console.log("删除后视频", this.Form.Video)
			},
			UploadError(res, file) {
				this.$message.error('上传失败，请重新试!')
				this.UploadLoading = false
				//console.log(res, file)
			},
			UploadMultipleDone(files) {
                 var This = this
				if(files && Array.isArray(files) && files.length) {
					console.log("文件", files)
					This.Form.Picture = []
					
				 for(let i=0; i<files.length;i++){
				
				 	This.Form.Picture.push({url:files[i].url,size:files[i].size})
	

				 }
					
					console.log("上传图片", This.Form.Picture)
					// do something...
				}

			},
			UploadSuccess(res, file) {
				var This = this
				clearInterval(UploadProgress) //
				This.GetUploadProgress = 100
				This.UploadLoading = false
				//console.log("上传成功", res)
				if(file.raw.type == 'image/jpeg') {
					This.Form.Picture.push(res.file_url)
					//console.log(This.Form.Picture)
				} else if(file.raw.type == 'audio/mp3') {
					This.Form.Sound.push(res.file_url)
					//console.log(This.Form.Sound)
				} else if(file.raw.type == 'video/mp4') {
					This.Form.Video.push(res.file_url)
					console.log("视频", This.Form.Video)
				}

			},
			VideobeforeUpload(file) {
				let This = this
				This.GetUploadProgress = 0
				let size = 500
				let filetype = file.type === 'video/mp4'
				let filesize = file.size / 1024 / 1024 < size
				let GetTime
				if(!filetype) {
					this.$message.error('请上传MP4格式!')
				} else if(!filesize) {
					this.$message.error('视频大小不能超过' + size + 'MB!')
				} else {
					if(file.size / 1024 / 1024 <= 10) { //分大小查询数量
						GetTime = 1000
					} else if(file.size / 1024 / 1024 > 10 && file.size / 1024 / 1024 <= 100) {
						GetTime = 2000
					} else if(file.size / 1024 / 1024 > 100 && file.size / 1024 / 1024 <= 500) {
						GetTime = 5000
					} else {
						GetTime = 10000
					}
					UploadProgress = setInterval(function() { //进度查询
						This.$axios.get(This.Global.ServerSrc + '/upload/get_progress').then(function(State) {
							console.log("上传中", State)
							This.GetUploadProgress = State.getprogress
						})
					}, GetTime)
				}
				return filetype && filesize
			},

			PicturebeforeUpload(file) {
				let size = 10
				let filetype = file.type === 'image/jpeg'
				let filesize = file.size / 1024 / 1024 < size
				if(!filetype) {
					this.$message.error('请上传JPG格式!')
				}
				if(!filesize) {
					this.$message.error('图片大小不能超过' + size + 'MB!')
				}
				return filetype && filesize
			},

			SoundBeforeUpload(file) {
				let size = 10
				let filetype = file.type === 'audio/mp3'
				let filesize = file.size / 1024 / 1024 < size
				if(!filetype) {
					this.$message.error('请上传MP3格式!')
				}
				if(!filesize) {
					this.$message.error('音频大小不能超过' + size + 'MB!')
				}
				return filetype && filesize
			}
		}

	}
</script>