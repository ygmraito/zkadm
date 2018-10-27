<template>
	<div class="app-container">

		<el-dialog title="视频播放" :visible.sync="PreviewVideo.Visible" :width="PreviewVideo.Width+40+'px'" :before-close="handleClose">
			<VideoPlayer :VideoAuto="PreviewVideo.Auto" :VideoClose="PreviewVideo.Close" :VideoUrl="PreviewVideo.Url" :VideoHeight="PreviewVideo.Height" :VideoWidth="PreviewVideo.Width" :VideoCover="PreviewVideo.Cover"></VideoPlayer>

		</el-dialog>

		<transition name="el-fade-in-linear">

			<div class="z_swiper_warp" v-show="RecordShow.PictureShow">
				<div class="z_swiper">
					<em class="iconfont icon-close" @click="RecordShow.PictureShow=false"></em>
					<div class="swiper-container">
						<div class="swiper-wrapper">
							<div class="swiper-slide" v-for="(item,index) in RecordShow.ImgsArr" :key="index">
								<img :src="item.url+'1024'">

							</div>

						</div>

						<div class="swiper-button-next"></div>
						<div class="swiper-button-prev"></div>
					</div>

				</div>
			</div>
		</transition>
		<div class="filter-container z_show_warp">
			<el-row :gutter="24">
				<el-col :span="20">

					<div class="z_show_cont">

						<el-tabs v-model="ActiveName" @tab-click="handleClick">

							<el-tab-pane :label="'图片 ('+RecordShow.ImgsArrGet.length+')'" name="picture" class="z_show_cont_box">

								<div class="z_show_piclist">

									<vue-waterfall-easy @preloaded="Preloaded" @scrollReachBottom="ScrollBottom" :gap="RecordShow.ImgGap" :imgsArr="RecordShow.ImgsArr" srcKey="url" :loadingDotCount="0" :imgWidth="RecordShow.ImgWidth" :maxCols="5" @click="PreviewPicPop"></vue-waterfall-easy>
								</div>

							</el-tab-pane>
							<el-tab-pane :label="'视频 ('+RecordShow.VideosArr.length+')'" name="video">
								<div class="z_card_list z_video_list filter-container">
									<el-row :gutter="12">
										<el-col :span="6" v-for="(item,index) in RecordShow.VideosArr" :key="index">
											<el-card shadow="hover">

												<div @click="PreviewVideoPop(item.url)" class="image" :style="{ 'background-image': 'url(' +Global.OssUrl+ item.url + Global.OssVideoThumb+')' }">
													<em class="iconfont icon-video"></em>
												</div>

												<div class="p">
													<span>{{item.name}}</span>
													<div class="bottom clearfix">

														<time class="time fl">{{item.size}}</time>

													</div>
												</div>

											</el-card>
										</el-col>
									</el-row>
								</div>
							</el-tab-pane>
							<el-tab-pane label="音频" name="sound">

							</el-tab-pane>
						</el-tabs>

					</div>

				</el-col>
				<el-col :span="4">

					<div class="z_show_info">

						<div class="z_author_img">
							<img :src="RecordShow.authorimg">
						</div>
						<div class="z_author_info">
							<strong>{{RecordShow.authorname}}</strong>

						</div>
						<div class="z_other_info">
							<ul>
								<li v-for="(item,index) in RecordShow.info" v-if="item.value">
									<el-row>
										<el-col :span="5">
											{{item.name}}：
										</el-col>
										<el-col :span="19">
											{{item.value}}
										</el-col>
									</el-row>

								</li>

							</ul>
						</div>

					</div>

				</el-col>
			</el-row>

		</div>
	</div>
</template>
<script>
	var mySwiper
	var loadingInstance

	var PageNumber = 20
	import moment from 'moment'
	import vueWaterfallEasy from 'vue-waterfall-easy'
	import VideoPlayer from '../../template/video_player.vue'
	import Swiper from 'swiper'
	import { Loading } from 'element-ui'
	export default {
		name: 'RecordShow',
		data() {
			return {

				ActiveName: 'picture',
				RecordShow: {
					VideosArr: [],
					ImgsArr: [],
					ImgsArrGet: [],
					ImgWidth: 290,
					ImgGap: 10,
					PictureShow: false,
				},
				PreviewVideo: {
					Visible: false,
					Close: false,
					Auto: true,
					Url: "",
					Cover: "",
					Width: 700,
					Height: 400,
				},
				ScrollBottomNumber: 1,

			}
		},
		mounted() {
			var This = this
			this.getData()
			$(".z_show_cont_box").css("height", $(window).height() - $(".navbar").height() - $(".tags-view-container").height() - 90)

			mySwiper = new Swiper('.swiper-container', {
				observer: true,
				observeParents: true,
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
				keyboard: {
					enabled: true,
					onlyInViewport: true,
				},
			});

		},
		methods: {
			handleClose(){
				
				this.PreviewVideo.Visible=false
			},
			PreviewVideoPop(Url) {
				console.log("视频地址", Url)
				this.PreviewVideo.Visible = true
				this.PreviewVideo.Url = this.Global.OssUrl + Url

				this.PreviewVideo.Cover = this.Global.OssUrl + Url + this.Global.OssVideoThumb

			},
			Preloaded() {
				console.log("加载完成")
				loadingInstance.close()
			},
			ScrollBottom() {
				var This = this
				//console.log("底部")
				//				loadingInstance = Loading.service({
				//					fullscreen: true
				//				})
				//console.log("获取内容",This.imgsArrGet.length)
				var Limit = 0
				var Number = PageNumber * This.ScrollBottomNumber
				if(PageNumber * (This.ScrollBottomNumber + 1) >= This.RecordShow.ImgsArrGet.length) {
					Limit = This.RecordShow.ImgsArrGet.length

				} else {
					Limit = PageNumber * (This.ScrollBottomNumber + 1)
				}
				//console.log("限制",Limit,Number)
				for(var i = Number; i < Limit; i++) {
					//console.log("新增",This.imgsArrGet[i])
					This.RecordShow.ImgsArr.push(This.RecordShow.ImgsArrGet[i])

				}

				This.ScrollBottomNumber++

					//					loadingInstance.close()

					//console.log("第" + This.ScrollBottomNumber + "次加载", This.RecordShow.ImgsArr)
			},
			PreviewPicPop(event, {
				index,
				value
			}) {

				var This = this

				// 阻止a标签跳转
				event.preventDefault()
				// 只有当点击到图片时才进行操作
				if(event.target.tagName.toLowerCase() == 'img') {
					//console.log('img clicked', index, value)
					//console.log(This.imgsArr)

				}
				This.RecordShow.PictureShow = true
				if(This.RecordShow.PictureShow) {
					$(".z_swiper").css("height", $(window).height())
					mySwiper.update()
					mySwiper.slideTo(index, 1000, false); //切换到第一个slide，速度为1秒
				}

			},
			handleClick(tab, event) {
				//console.log(tab, event);
			},
			getData() {
				var This = this
				var ParamsData = {
					UrlId: this.$route.query.url_id
				}

				this.$axios.get(this.Global.ServerSrc + '/admin/record/get_record_show', {
					params: ParamsData
				}).then(function(Res) {
					console.log("加载数据", Res)

					if(Res.picture.length > 0) {
						loadingInstance = Loading.service({
							fullscreen: true
						})
						This.RecordShow.ImgsArrGet = Res.picture

					}
					else{
						This.ActiveName="video"
					}

					//console.log("所有内容", Res.picture)
					//					var Imgs =JSON.parse(Res.picture)
					//				
					//			
					//					for(var i=0;i<Imgs.length;i++){
					//		                  This.imgsArr.push({
					//		                  	url:This.Global.OssUrl+Imgs[i].url+This.Global.OssThumb}
					//		                  )
					//					}
					//					console.log(This.imgsArr)

					This.RecordShow.VideosArr = Res.video
					var LoadNumber = 0
					if(PageNumber >= This.RecordShow.ImgsArrGet.length) {
						LoadNumber = This.RecordShow.ImgsArrGet.length
					} else {
						LoadNumber = PageNumber
					}

					for(var i = 0; i < LoadNumber; i++) {
						//console.log(This.imgsArrGet[i])
						This.RecordShow.ImgsArr.push(This.RecordShow.ImgsArrGet[i])

					}
					//console.log("第一次加载", This.imgsArr)
					//This.RecordShow.picture = JSON.parse(Res.picture)
					This.RecordShow.authorname = JSON.parse(Res.author).UserName
					This.RecordShow.authorimg = JSON.parse(Res.author).UserThumb

					This.RecordShow.info = [{
						name: "时间",
						value: moment(Res.time).format("YYYY-MM-DD"),

					}, {
						name: "分类",
						value: Res.classify,

					}, {
						name: "浏览",
						value: Res.view,

					}, {
						name: "收藏",
						value: Res.collect,

					}, {
						name: "地址",
						value: Res.address,

					}, {
						name: "更新",
						value: moment(Res.date).format("YYYY-MM-DD"),

					}]

				})
			}

		},

		created() {

		},
		components: {
			vueWaterfallEasy,
			VideoPlayer
		}
	}
</script>