<template>
	<div class="app-container">

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
				<v-uploader :multiple="true" @done="UploadPictureDone" delete-file-url="/api/upload/delete_record_multiple" upload-file-url="/api/upload/upload_record_multiple" @before-upload="MultipleBeforeUpload" file-size-limit="10mb" file-type-exts="png,jpg,jpeg,gif"></v-uploader>
			</el-form-item>

			<!--<el-form-item v-show="tabPosition=='video'">
				<v-uploader :multiple="true" @done="UploadVideoDone" delete-file-url="/api/upload/delete_record_multiple" upload-file-url="/api/upload/upload_record_multiple" @before-upload="MultipleBeforeUpload" file-size-limit="100mb" file-type-exts="mp4"></v-uploader>
			</el-form-item>

			<el-form-item v-show="tabPosition=='sound'">
				<v-uploader :multiple="true" @done="UploadSoundDone" delete-file-url="/api/upload/delete_record_multiple" upload-file-url="/api/upload/upload_record_multiple" @before-upload="MultipleBeforeUpload" file-size-limit="50mb" file-type-exts="mp3"></v-uploader>
			</el-form-item>-->

			<el-button type="text" @click="PreviewVideo.Visible = true">点击打开 Dialog</el-button>

			<el-dialog title="提示" :visible.sync="PreviewVideo.Visible" width="30%" :before-close="handleClose">

				<VideoPlayer :VideoAuto="PreviewVideo.Auto" :VideoClose="PreviewVideo.Close" :VideoUrl="PreviewVideo.Url" :VideoCover="PreviewVideo.Cover"></VideoPlayer>

				<span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="PreviewVideo.Visible = false">确 定</el-button>
                </span>

			</el-dialog>

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
					Picture: [],
					PictureNumber: 0,
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
			UploadPictureDelete() {
				
				console.log("ddd")
			},
			UploadPictureDone(files) {
				console.log("上传文件", files)
				if(files.length == 1) {
					this.Form.Picture = files
				} else if(this.Form.Picture > files.length) {
					this.Form.Picture = files
				} else {
					this.Form.Picture.push(files.pop())
				}
				console.log("当前上传", this.Form.Picture)
				//this.Form.Picture.push()
				//console.log("返回",this.Form.Picture)

				//				if(this.Form.PictureNumber > files.length) {
				//					this.Form.PictureNumber = files.length
				//					for(let i = 0; i < files.length; i++) {
				//						this.Form.Picture[i] = {
				//							url: files[i].url,
				//							size: files[i].size
				//						}
				//					}
				//					console.log("减法数值",this.Form.Picture,this.Form.PictureNumber)
				//				} else {
				//					this.Form.PictureNumber = files.length
				//				}

				//				if(files && Array.isArray(files) && files.length) {
				//
				//					for(let i = 0; i < files.length; i++) {
				//
				//						this.Form.Picture[i] = {
				//							url: files[i].url,
				//							size: files[i].size
				//						}
				//
				//					}
				//					console.log(this.Form.Picture)
				//
				//				}
			},
			UploadVideoDone(files) {
				if(files && Array.isArray(files) && files.length) {
					this.UploadDone(files, "video")
					console.log(this.Form.Video)
				}
			},
			UploadSoundDone(files) {
				if(files && Array.isArray(files) && files.length) {

					this.UploadDone(files, "sound")
					console.log(this.Form.Sound)
				}
			},
			UploadDone(res, type) {
				console.log("文件", res)
				this.Form.Picture = []

			}

		}

	}
</script>