<template>
	<div class="app-container">
		<el-form ref="Form" :model="Form" class="el-form el-form--label-left">
			<el-form-item label="单词" class="is-required">
				<el-input placeholder="输入单词" v-model="Form.Word">
					<el-button slot="append" icon="el-icon-search" @click="CheckRepeat"></el-button>
				</el-input>
			</el-form-item>
			<el-form-item label="中译" class="is-required">
				<el-input v-model="Form.Chinese" placeholder="输入中译"></el-input>
			</el-form-item>

			<el-form-item label="类型" class="is-required">
				<el-autocomplete style=" width: 100%;" class="filter-item" v-model="Form.Classify" :fetch-suggestions="querySearchAsync" placeholder="输入类型关键字" @select="handleSelect"></el-autocomplete>

			</el-form-item>

			<el-form-item label="音标">
				<el-input v-model="Form.PhoneticSymbol" placeholder="输入音标"></el-input>
			</el-form-item>
			<el-form-item label="等级" class="is-required">
				<el-select style=" width: 100%;" v-model="Form.SelectLevel" placeholder="选择等级" @focus="SelectData('level')" :loading="SelectLoading">
					<el-option v-for="(item,index) in Form.Level" :key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="年龄层" class="is-required">
				<el-select style=" width: 100%;" v-model="Form.SelectAgeGroup" placeholder="选择年龄层" @focus="SelectData('age_group')" :loading="SelectLoading">
					<el-option v-for="(item,index) in Form.AgeGroup" :key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-radio-group v-model="tabPosition" @change="UpLoadType">
					<el-radio-button label="picture">图片</el-radio-button>
					<el-radio-button label="sound">音频</el-radio-button>
					<el-radio-button label="video">视频</el-radio-button>

				</el-radio-group>

			</el-form-item>
			<el-form-item v-show="tabPosition=='picture'">
				<el-upload class="upload-demo" drag action="/api/upload/upload" enctype="multipart/form-data" :data="{'class':'word','type':'img'}" :limit="1" auto-upload :on-progress="UploadProgress" :on-error="UploadError" :on-success="UploadSuccess" :before-upload="ImgbeforeUpload">
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
					<div class="el-upload__tip" slot="tip">只能上传jpg，且不超过2mb</div>
				</el-upload>
			</el-form-item>

			<el-form-item v-show="tabPosition=='sound'">
				<el-upload class="upload-demo" drag action="/api/upload/upload" enctype="multipart/form-data" :data="{'class':'word','type':'mp3'}" :limit="1" auto-upload :on-progress="UploadProgress" :on-error="UploadError" :on-success="UploadSuccess" :before-upload="SoundBeforeUpload">
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将音频拖到此处，或<em>点击上传</em></div>
					<div class="el-upload__tip" slot="tip">只能上传mp3，且不超过10mb</div>
				</el-upload>
			</el-form-item>

			<el-form-item v-show="tabPosition=='video'">
				<el-upload class="upload-demo" drag action="/api/upload/upload" enctype="multipart/form-data" :data="{'class':'word','type':'mp4'}" :limit="1" auto-upload :on-progress="UploadProgress" :on-error="UploadError" :on-success="UploadSuccess" :before-upload="Mp4beforeUpload">
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
	import MD5 from 'js-md5'
	export default {
		name: 'Release',
		data() {
			return {
				tabPosition: 'picture',
				restaurants: [],
				BanSubmit: false,
				SelectLoading: false,
				UploadLoading: false,
				SubmitLoading: false,
				timeout: null,
				oss: '',
				Form: {
					Word: '',
					Sound: '',
					SelectLevel: '',
					Classify: '',
					PhoneticSymbol: '',
					Picture: '',
					Sound: '',
					Chinese: '',
					Video: '',
					Level: [],
					SelectAgeGroup: '',
					AgeGroup: []
				}
			}
		},
		mounted() {


		},
		methods: {
			UpLoadType(value) {
				console.log(value)
			},

			SelectData(value) {
				let This = this
				if(value == 'level') {
					This.$axios.get(This.Global.ServerSrc + '/admin/word/get_level').then(function(Res) {
						This.Form.Level = Res
						console.log(Res)
					})
				} else if(value == 'age_group') {
					This.$axios.get(This.Global.ServerSrc + '/admin/word/get_age_group').then(function(Res) {
						This.Form.AgeGroup = Res
					})
				}

			},
			querySearchAsync(queryString, cb) {
				let This = this

				This.$axios.get(This.Global.ServerSrc + '/admin/word/check_classify', {
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
					console.log(Res)
				})
			},
			createStateFilter(queryString) {
				console.log("解析", queryString)
				return(state) => {
					return(state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
			},
			//查询重复
			CheckRepeat() {
				let This = this
				This.$axios.get(This.Global.ServerSrc + '/admin/word/check_word', {
					params: {
						Word: This.Form.Word,
					}
				}).then(function(Res) {
					console.log(Res)
					var HaveWordJson = Res.HaveWord
					var HaveWord = []
					if(Res.CheckState == "HaveWord") {
						for(var i = 0; i < HaveWordJson.length; i++) {
							HaveWord += "<b>" + HaveWordJson[i].word + "、</b>"
						}
						This.$alert(HaveWord, '已有单词', {
							dangerouslyUseHTMLString: true
						})

					} else if(Res.CheckState == "NoWord") {
						This.$message.success('可添加!')
						This.EnToCn(This.Form.Word)
					}
				})
			},
			//英文翻译
			EnToCn(Word) {
				let This = this
				var appid = '20180624000179628'
				var key = 'POVJZKEpk6iNaQagjH9r'
				var salt = (new Date).getTime()
				var query = Word
				var from = 'en'
				var to = 'zh'
				var str1 = appid + query + salt + key;
				var sign = MD5(str1)

				$.ajax({
					url: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
					type: 'get',
					dataType: 'jsonp',
					data: {
						q: query,
						appid: appid,
						salt: salt,
						from: from,
						to: to,
						sign: sign
					},
					success: function(data) {
						This.Form.Chinese = data.trans_result[0].dst
					}
				})

			},
			Submit() {
				let This = this
				console.log(this.Form.SelectLevel)
				this.$axios.post(this.Global.ServerSrc + '/admin/word/release_word', { //加载我的
					Level: this.Form.SelectLevel,
					Word: this.Form.Word,
					Sound: this.Form.Sound,
					Video: this.Form.Video,
					Picture: this.Form.Picture,
					Chinese: this.Form.Chinese,
					PhoneticSymbol: this.Form.PhoneticSymbol,
					Classify: this.Form.Classify,
					AgeGroup: this.Form.SelectAgeGroup,
				}).then(function(State) {
					if(State.ReleaseState == "HaveWord") {
						This.$message.warning('已经有单词!')
					} else if(State.ReleaseState == "Success") {
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
				console.log(item);
			},
			UploadProgress(event, file, fileList) {
				this.UploadLoading = true
				console.log("上传进度", event, file, fileList)
			},
			UploadError(res, file) {
				this.$message.error('上传失败，请重新试!')
				this.UploadLoading = false
				console.log(res, file)
			},
			UploadSuccess(res, file) {
				var This = this
				This.UploadLoading = false
				if(file.raw.type == 'image/jpeg') {
					This.Form.Picture = res.file_url
				} else if(file.raw.type == 'audio/mp3') {
					This.Form.Sound = res.file_url
				} else if(file.raw.type == 'video/mp4') {
					This.Form.Video = res.file_url
				}
			},

			Mp4beforeUpload(file) {
				let size = 10
				let filetype = file.type === 'video/mp4'
				let filesize = file.size / 1024 / 1024 < size
				if(!filetype) {
					this.$message.error('请上传MP4格式!')
				}
				if(!filesize) {
					this.$message.error('视频大小不能超过' + size + 'MB!')
				}
				return filetype && filesize
			},

			ImgbeforeUpload(file) {
				let size = 2
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
				let size = 50
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