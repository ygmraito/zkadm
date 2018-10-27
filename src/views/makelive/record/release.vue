<template>
	<div class="app-container">
		<el-form ref="Form" :model="Form" class="el-form el-form--label-left">
			<el-form-item label="标题" class="is-required">
				<el-input placeholder="输入标题" v-model="Form.Title">
				</el-input>
			</el-form-item>
			<el-form-item label="分类" class="is-required">
				<el-autocomplete style=" width: 100%" v-model="Form.Classify" :fetch-suggestions="querySearchAsync" placeholder="输入类型关键字" @select="handleSelect"></el-autocomplete>
			</el-form-item>

			<el-form-item label="日期" class="is-required">

				<el-date-picker style=" width: 100%" v-model="Form.Time" align="left" type="date" placeholder="选择日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-radio-group v-model="tabPosition" @change="UpLoadType">
					<el-radio-button label="picture">图片</el-radio-button>
					<el-radio-button label="video">视频</el-radio-button>
					<el-radio-button label="sound">音频</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<Upload :UploadType="tabPosition" @UploadData="GetUploadData"></Upload>
			<!--<el-form-item v-show="tabPosition=='picture'">
				
			</el-form-item>
			<el-form-item v-show="tabPosition=='video'">-->
			<!--<el-upload class="upload-demo" drag accept="video/mp4" action="/api/upload/upload_progress" :data="{'class':'record','type':'video'}" :on-error="UploadError" :on-success="UploadSuccess" :on-remove="UploadRemove" :before-upload="VideobeforeUpload">
					<div class="z_upload_icon">
						<i class="el-icon-upload" v-if="UploadProgressNumber=='100'||UploadProgressNumber=='0'"></i>
						<div class="z_circle_progress" v-if="UploadProgressNumber!='100'&&UploadProgressNumber>'0'">
							<el-progress :width='Global.CircleProgressSize' type="circle" :percentage="UploadProgressNumber"></el-progress>
						</div>
					</div>
					<div class="el-upload__text">将视频拖到此处，或<em>点击上传</em></div>
					<div class="el-upload__tip" slot="tip">只能上传mp4，且不超过{{Form.VideoSize}}mb</div>
				</el-upload>-->
			<!--</el-form-item>
			<el-form-item v-show="tabPosition=='sound'">-->
			<!--<el-upload class="upload-demo" drag action="/api/upload/upload_progress" enctype="multipart/form-data" :data="{'class':'record','type':'sound'}" auto-upload :on-error="UploadError" :on-success="UploadSuccess" :on-remove="UploadRemove" :before-upload="SoundBeforeUpload">
					<div class="z_upload_icon">
						<i class="el-icon-upload" v-if="UploadProgressNumber=='100'||UploadProgressNumber=='0'"></i>
						<div class="z_circle_progress" v-if="UploadProgressNumber!='100'&&UploadProgressNumber>'0'">
							<el-progress :width='Global.CircleProgressSize' type="circle" :percentage="UploadProgressNumber"></el-progress>
						</div>
					</div>
					<div class="el-upload__text">将音频拖到此处，或<em>点击上传</em></div>
					<div class="el-upload__tip" slot="tip">只能上传mp3，且不超过{{Form.SoundSize}}mb</div>
				</el-upload>-->
			<!--		</el-form-item>-->
			<!--<el-button type="text" @click="PreviewVideo.Visible = true">点击打开 Dialog</el-button>-->
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
	import Upload from '../../template/upload.vue'

	let UploadProgress
	export default {
		name: 'Release',
		data() {
			return {
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					},
					shortcuts: [{
						text: '今天',
						onClick(picker) {
							picker.$emit('pick', new Date());
						}
					}, {
						text: '昨天',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24);
							picker.$emit('pick', date);
						}
					}, {
						text: '一周前',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', date);
						}
					}]
				},
				width: 50,
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
				SubmitLoading: false,
				timeout: null,
				oss: '',
				Form: {
					Title: '',
					Classify: '',

					Picture: [],
					Sound: [],
					Video: [],
					PictureSize: 10,
					VideoSize: 100,
					SoundSize: 30,
				},
				UploadProgressNumber: 0,
			}
		},
		components: {
			VideoPlayer,
			Upload
		},
		mounted() {

		},
		methods: {
			GetUploadData(data) {
				console.log("获取数据",data)
				this.Form.Picture = data.picture
				this.Form.Video = data.video
				this.Form.Sound = data.sound
				this.Form.Cover = data.cover
			},
			handleClose(done) {
				done()
			},
			UpLoadType(value) {},
			querySearchAsync(queryString, cb) {
				let This = this
				This.$axios.get(This.Global.ServerSrc + '/admin/record/check_classify', {
					params: {
						Classify: This.Form.Classify
					}
				}).then(function(Res) {
					var restaurants = Res
					var results = queryString ? restaurants.filter(This.createStateFilter(queryString)) : restaurants
					clearTimeout(This.timeout)
					This.timeout = setTimeout(() => {
						cb(results)
					}, 1000 * Math.random())
				})
			},
			createStateFilter(queryString) {
				return(state) => {
					return(state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
				}
			},
			Submit() {
				var This = this
			        var CoverUrl
			        
			        if(this.Form.Picture.length>=1){
			        	CoverUrl= this.Form.Cover.replace(This.Global.OssUrlReplace, '').replace(This.Global.OssThumbReplace, '')
			        }
			        else{
			        	CoverUrl= this.Form.Cover.replace(This.Global.OssUrlReplace, '')
			        }
			        
			        
				//console.log("获取封面",CoverUrl)
				this.$axios.post(this.Global.ServerSrc + '/admin/record/release_record', { //加载我的
					Title: this.Form.Title,
					Classify: this.Form.Classify,
					Sound: JSON.stringify(this.Form.Sound).replace(This.Global.OssUrlReplace, ''),
					Video: JSON.stringify(this.Form.Video).replace(This.Global.OssUrlReplace, '').replace(This.Global.OssVideoThumbReplace, ''),
					Picture: JSON.stringify(this.Form.Picture).replace(This.Global.OssUrlReplace, '').replace(This.Global.OssThumbReplace, ''),
					Time: this.Form.Time,
					Address: this.Form.Address,
					//Cover:this.Form.Cover.replace(This.Global.OssUrlReplace, '').replace(This.Global.OssThumbReplace, ''),
					Cover:CoverUrl,

				}).then(function(State) {
					if(State.ReleaseState == "Success") {
						This.$message.success('添加成功!')
					} else {
						This.$message.error('添加失败，请重新试!')
					}
				})
			},
			querySearch(queryString, cb) {
				var restaurants = this.restaurants
				var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
				cb(results)
			},
			createFilter(queryString) {
				return(restaurant) => {
					return(restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
				}
			},
			handleSelect(item) {},

		}
	}
</script>