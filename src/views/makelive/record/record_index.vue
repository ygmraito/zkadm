<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select v-model="Search.Type" slot="prepend" class="filter-item" placeholder="请选择">
				<el-option v-for="(item,index) in Search.Select" :label="item.label" :value="item.value" :key="item.value"></el-option>
			</el-select>
			<div class="filter-item" style="width:250px;" v-if="Search.Type=='title'||Search.Type=='author'">
				<el-input placeholder="输入关键字" v-model="Search.KeyWord" class="input-with-select">
					<el-button slot="append" icon="el-icon-search" @click.native.prevent="SearchData(Search.Type)"></el-button>
				</el-input>
			</div>

			<el-autocomplete class="filter-item" v-if="Search.Type=='classify'" v-model="Search.Classify" :fetch-suggestions="querySearchAsync" placeholder="输入类型关键字" @select="handleSelect"></el-autocomplete>
			<div class="filter-item" v-if="Search.Type=='createdAt'||Search.Type=='updatedAt'">
				<el-date-picker value-format="yyyy-MM-dd hh:ss" v-model="Search.Time" type="daterange" range-separator="至" default-time start-placeholder="开始日期" end-placeholder="结束日期" @change="SearchTime">
				</el-date-picker>
			</div>

		</div>

		<div class="z_card_list filter-container">
			<el-row :gutter="12">
				<el-col :span="6" v-for="(item,index) in RecordListData" :key="index">
					<el-card shadow="hover">
						<div @click="RecordShow(item.url_id)">

							<div v-if="item.cover.indexOf(Global.OssVideoThumb) >= 0" class="image" :style="{ 'background-image': 'url(' +Global.OssUrl+ item.cover+')' }">

							</div>

							<div v-else class="image" :style="{ 'background-image': 'url(' +Global.OssUrl+ item.cover + Global.OssThumb+')' }">

							</div>

							<div class="p">
								<span>{{item.title}}</span>
								<div class="bottom clearfix">

									<time class="time fl">{{item.classify}}</time>
									<time class="time fr"> {{item.time| moment("YYYY-MM-DD") }}</time>
								</div>
							</div>
						</div>

					</el-card>
				</el-col>
			</el-row>
		</div>

		<div class="pagination-container">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="Global.PageSizes" :page-size="Global.LoadNum" layout="total, sizes, prev, pager, next, jumper" :total="Total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import waves from '@/directive/waves' // 水波纹指令
	import moment from 'moment'

	export default {
		name: 'WordIndex',
		directives: {
			waves
		},
		data() {
			return {
				RecordListData: [],
				DownLoading: false,
				currentPage: 1,
				Total: 1,
				timeout: null,
				Search: {
					Select: [{
							label: '标题',
							value: 'title'
						},

						{
							label: '分类',
							value: 'classify'
						},
						{
							label: '作者',
							value: 'author'
						},
						{
							label: '上传日期',
							value: 'createdAt'
						},
						{
							label: '更新日期',
							value: 'updatedAt'
						}
					],
					Time: '',
					Type: 'title',
					KeyWord: '',
					Classify: '',
					TimeType: '',
					StartTime: '',
					EndTime: ''
				},
				PageNum: 1,
				LoadPage: 10,
				restaurants: [],
				Loading: false,

			}
		},
		mounted() {
			this.LoadContent()
			//console.log(this.CheckTable)
			//this.SearchTime()
		},
		watch: {
			//			checkboxVal(valArr) {
			//				console.log(valArr)
			//				this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
			//				this.key = this.key + 1 // 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
			//			}
		},
		methods: {
			RecordShow(urlid) {
				console.log("点击内容", urlid)

				this.$router.push({
					path: '/makelive/record/record_show',
					query: {
						url_id: urlid
					}
				})

			},
			LoadContent(page, loadpage) {

				let This = this
				let CurPage = page || This.PageNum
				This.LoadPage = loadpage || This.LoadPage
				//				This.Search.StartTime = "2018-09-07 00:00:00"
				//				This.Search.EndTime = "2018-09-09 00:00:00"
				//				This.Search.Type = "createdAt"
				let ParamsData = {
					Type: This.Search.Type,
					KeyWord: This.Search.KeyWord,
					LoadNum: This.LoadPage,
					PageNum: CurPage,
					StartTime: This.Search.StartTime,
					EndTime: This.Search.EndTime,

				}
				console.log("查询内容", ParamsData)
				//console.log("翻页", CurPage)
				//				if(This.Search.Type == 'createdAt' || This.Search.Type == 'updatedAt') {
				//					This.$axios.get(This.Global.ServerSrc + '/admin/word/get_word_time', {
				//						params: ParamsData
				//					}).then(function(Res) {
				//						This.WordListData = Res.rows
				//						This.Total = Res.count
				//						console.log("按时间查询", Res)
				//
				//					})
				//				} else {

				This.$axios.get(This.Global.ServerSrc + '/admin/record/get_record', {
					params: ParamsData
				}).then(function(Res) {
					console.log("查询数据", Res)
					This.RecordListData = Res.rows
					This.Total = Res.count
					console.log(Res)
				})

				//				}
			},
			SearchTime(date) {
				let This = this
				This.Search.StartTime = moment(date[0]).format("YYYY-MM-DD") + " 00:00:00"
				This.Search.EndTime = moment(date[1]).format("YYYY-MM-DD") + " 00:00:00"
				if(This.Search.StartTime == This.Search.EndTime) {
					This.Search.EndTime = moment(moment(This.Search.StartTime).add(1, 'days')).format("YYYY-MM-DD") + " 00:00:00"
				} else {
					This.Search.EndTime = moment(moment(This.Search.EndTime).add(1, 'days')).format("YYYY-MM-DD") + " 00:00:00"
				}
				console.log("加", This.Search.EndTime)
				//This.Search.StartTime = "2018-09-07 00:00:00"
				//This.Search.EndTime = "2018-09-09 00:00:00"
				This.LoadContent()
				//				This.$axios.get(this.Global.ServerSrc + '/admin/word/get_word2', {
				//					params: {
				//						StartTime: This.Search.StartTime,
				//						EndTime: This.Search.EndTime,
				//					}
				//				}).then(function(Res) {
				//					This.WordListData = Res.rows
				//					This.Total = Res.count
				//					console.log("按日期查询", Res.rows)
				//				})
			},

			SearchSelect(value) {
				this.Search.KeyWord = value
				//console.log(value)
				this.LoadContent()
			},
			SelectData(value) {
				let This = this
				if(value == 'level') {
					This.$axios.get(This.Global.ServerSrc + '/admin/word/get_level').then(function(Res) {
						This.Search.SelectLevel2 = Res
					})
				} else if(value == 'age_group') {
					This.$axios.get(This.Global.ServerSrc + '/admin/word/get_age_group').then(function(Res) {
						This.Search.SelectLevel2 = Res
					})
				}
			},
			SearchData(type) {
				this.LoadContent()
			},
			handleSizeChange(loadpage) {
				this.LoadPage = loadpage
				this.LoadContent(false, this.LoadPage)
			},
			handleCurrentChange(page) {
				//console.log(page)
				this.LoadContent(page)
			},
			Edit() {
				this.$prompt('请输入类型名称', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(
					({
						value
					}) => {
						this.$message({
							type: 'success',
							message: '类型名称: ' + value
						});
					}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});
			},
			Delete() {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			querySearchAsync(queryString, cb) {
				let This = this
				console.log("This.Search.Classify", This.Search.Classify)
				This.$axios.get(This.Global.ServerSrc + '/admin/word/check_classify', {
					params: {
						Classify: This.Search.Classify
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
			handleSelect(item) {
				console.log("选择查询分类", this.Search.Type)
				this.Search.KeyWord = item.value
				console.log("选择", item);
				this.LoadContent()
			}
		}
	}
</script>