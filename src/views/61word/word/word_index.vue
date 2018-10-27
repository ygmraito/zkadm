<template>
	<div class="app-container">
		<div class="filter-container">
			<el-select v-model="Search.Type" slot="prepend" class="filter-item" placeholder="请选择">
				<el-option v-for="(item,index) in Search.Select" :label="item.label" :value="item.value" :key="item.value"></el-option>
			</el-select>
			<div class="filter-item" style="width:250px;" v-if="Search.Type=='word'||Search.Type=='chinese'">
				<el-input placeholder="输入关键字" v-model="Search.KeyWord" class="input-with-select">
					<el-button slot="append" icon="el-icon-search" @click.native.prevent="SearchData(Search.Type)"></el-button>
				</el-input>
			</div>
			<el-select class="filter-item" v-if="Search.Type=='age_group'||Search.Type=='level'" v-model="Search.TypeLevel2" slot="prepend" placeholder="请选择" @change="SearchSelect" @focus="SelectData(Search.Type)">
				<el-option v-for="(item,index) in Search.SelectLevel2" :label="item.name" :value="item.value" :key="item.value"></el-option>
			</el-select>
			<el-autocomplete class="filter-item" v-if="Search.Type=='classify'" v-model="Search.Classify" :fetch-suggestions="querySearchAsync" placeholder="输入类型关键字" @select="handleSelect"></el-autocomplete>
			<div class="filter-item">
				<el-date-picker value-format="yyyy-MM-dd hh:ss" v-if="Search.Type=='createdAt'||Search.Type=='updatedAt'" v-model="Search.Time" type="daterange" range-separator="至" default-time start-placeholder="开始日期" end-placeholder="结束日期" @change="SearchTime">
				</el-date-picker>
			</div>
			<el-button v-waves :loading="DownLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出表格</el-button>
			<el-popover placement="bottom" trigger="click" class="filter-item">
				<el-row style="min-width: 280px; max-width: 350px;">
					<el-col :span="8">
						<el-checkbox v-model="CheckTable.word" label="word" @change="key=key+1">单词名</el-checkbox>
					</el-col>
					<el-col :span="8">
						<el-checkbox v-model="CheckTable.chinese" label="chinese" @change="key=key+1">中译</el-checkbox>
					</el-col>
					<el-col :span="8">
						<el-checkbox v-model="CheckTable.phonetic_symbol" label="phonetic_symbol" @change="key=key+1">音标</el-checkbox>
					</el-col>
					<el-col :span="8">
						<el-checkbox v-model="CheckTable.classify" label="classify" @change="key=key+1">类型</el-checkbox>
					</el-col>
					<el-col :span="8">
						<el-checkbox v-model="CheckTable.age_group" label="age_group" @change="key=key+1">年龄层</el-checkbox>
					</el-col>
					<el-col :span="8">
						<el-checkbox v-model="CheckTable.level" label="level" @change="key=key+1">等级</el-checkbox>
					</el-col>
					<el-col :span="8">
						<el-checkbox v-model="CheckTable.picture" label="picture" @change="key=key+1">图片</el-checkbox>
					</el-col>
					<el-col :span="8">
						<el-checkbox v-model="CheckTable.sound" label="sound" @change="key=key+1">音频</el-checkbox>
					</el-col>
					<el-col :span="8">
						<el-checkbox v-model="CheckTable.video" label="video" @change="key=key+1">视频</el-checkbox>
					</el-col>
					<el-col :span="8">
						<el-checkbox v-model="CheckTable.createdAt" label="createdAt" @change="key=key+1">上传时间</el-checkbox>
					</el-col>
					<el-col :span="8">
						<el-checkbox v-model="CheckTable.updatedAt" label="updatedAt" @change="key=key+1">更新时间</el-checkbox>
					</el-col>
					<el-col :span="8">
						<el-checkbox v-model="CheckTable.operation" label="operation" @change="key=key+1">操作</el-checkbox>
					</el-col>
				</el-row>
				<el-button slot="reference" icon="el-icon-view">显示项</el-button>
			</el-popover>
		</div>
		<el-table :data="WordListData" :key="key" border fit highlight-current-row>
			<!--<el-table-column v-for="fruit in formThead" :key="fruit" :label="fruit">
				<template slot-scope="scope">
					{{ scope.row[fruit] }}
				</template>
			</el-table-column>-->
			<el-table-column label="单词" v-if="CheckTable.word">
				<template slot-scope="scope">
					{{scope.row.word}}
				</template>
			</el-table-column>
			<el-table-column label="中译" v-if="CheckTable.chinese">
				<template slot-scope="scope">
					{{scope.row.chinese}}
				</template>
			</el-table-column>
			<el-table-column label="音标" v-if="CheckTable.phonetic_symbol">
				<template slot-scope="scope">
					{{scope.row.phonetic_symbol}}
				</template>
			</el-table-column>
			<el-table-column label="类型" v-if="CheckTable.classify">
				<template slot-scope="scope">
					{{scope.row.classify}}
				</template>
			</el-table-column>
			<el-table-column label="年龄层" v-if="CheckTable.age_group">
				<template slot-scope="scope">
					{{scope.row.age_group}}
				</template>
			</el-table-column>
			<el-table-column label="等级" v-if="CheckTable.level">
				<template slot-scope="scope">
					{{scope.row.level}}
				</template>
			</el-table-column>
			<el-table-column label="图片" width="200" v-if="CheckTable.picture">
				<template slot-scope="scope">
					<img :src="scope.row.picture">
				</template>
			</el-table-column>
			<el-table-column label="音频" v-if="CheckTable.sound">
				<template slot-scope="scope">
					<el-button slot="reference" size="mini" icon="el-icon-service" @cilck="PlayerSound(scope.row.sound)">播放</el-button>
				</template>
			</el-table-column>
			<el-table-column label="视频" v-if="CheckTable.video">
				<template slot-scope="scope">
					<el-button slot="reference" size="mini" icon="el-icon-caret-right" @cilck="PlayerVideo(scope.row.sound)">播放</el-button>
				</template>
			</el-table-column>
			<el-table-column label="上传日期" v-if="CheckTable.createdAt">
				<template slot-scope="scope">
					{{scope.row.createdAt| moment("YYYY-MM-DD") }}
				</template>
			</el-table-column>
			<el-table-column label="更新日期" v-if="CheckTable.updatedAt">
				<template slot-scope="scope">
					{{scope.row.updatedAt| moment("YYYY-MM-DD") }}
				</template>
			</el-table-column>
			<!--
			<el-table-column prop="createdAt" key="createdAt" label="上传日期">
			</el-table-column>
			<el-table-column prop="updatedAt" key="updatedAt" label="更新日期">
			</el-table-column>-->
			<el-table-column label="操作" width="200" v-if='CheckTable.operation'>
				<template slot-scope="scope">
					<el-button size="mini" @click="Edit">编辑</el-button>
					<el-button size="mini" type="danger" @click="Delete">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination-container">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="Global.PageSizes" :page-size="Global.LoadNum" layout="total, sizes, prev, pager, next, jumper" :total="Total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import waves from '@/directive/waves' // 水波纹指令
	import moment from 'moment' // 水波纹指令
	import { parseTime } from '@/utils'
	const defaultFormThead = ['word', 'chinese', 'phonetic_symbol', 'classify', 'age_group', 'level']
	export default {
		name: 'WordIndex',
		directives: {
			waves
		},
		data() {
			return {
				key: 1,
				formTheadOptions: ['word', 'chinese', 'phonetic_symbol', 'classify', 'age_group', 'level'],
				CheckTable: {
					word: true,
					chinese: true,
					phonetic_symbol: false,
					classify: true,
					age_group: true,
					level: true,
					picture: true,
					sound: false,
					video: false,
					createdAt: true,
					updatedAt: false,
					operation: false
				},
				//checkboxVal: defaultFormThead,
				formThead: defaultFormThead,
				DownLoading: false,
				currentPage: 1,
				Total: 1,
				timeout: null,
				Search: {
					Select: [{
							label: '单词名',
							value: 'word'
						},
						{
							label: '中译',
							value: 'chinese'
						},
						{
							label: '类型',
							value: 'classify'
						},
						{
							label: '年龄',
							value: 'age_group'
						},
						{
							label: '等级',
							value: 'level'
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
					Type: 'word',
					KeyWord: '',
					SelectLevel2: [],
					TypeLevel2: '',
					Classify: '',
					TimeType: '',
					StartTime: '',
					EndTime: '',
				},
				PageNum: 1,
				LoadPage:10,
				restaurants: [],
				Loading: false,
				WordListData: [],
				ExcelWord:[]
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
			PlayerSound() {},
			PlayerVideo() {},
			LoadContent(page,loadpage, excel) {

				let This = this
				let CurPage = page || This.PageNum
				This.LoadPage=loadpage || This.LoadPage
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
					Excel: excel
				}
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
				if(!excel) {
					This.$axios.get(This.Global.ServerSrc + '/admin/word/get_word', {
						params: ParamsData
					}).then(function(Res) {
						This.WordListData = Res.rows
						This.Total = Res.count
						console.log(Res)
					})

				} else {
					This.$axios.get(This.Global.ServerSrc + '/admin/word/excel_word', {
						params: ParamsData
					}).then(function(Res) {
						console.log("导出数据", Res)
						This.ExcelWord = Res
						This.DownLoading = true
						import('@/vendor/Export2Excel').then(excel => {
							const tHeader = ['单词名', '中译', '音标', '类型', '年龄层', '等级', '图片', '音频', '视频', '上传时间', '更新时间']
							const filterVal = ['word', 'chinese', 'phonetic_symbol', 'classify', 'age_group', 'level', 'picture', 'sound', 'video', 'createdAt', 'updatedAt']
							const data = This.formatJson(filterVal, This.ExcelWord)
							excel.export_json_to_excel({
								header: tHeader,
								data,
								filename: 'table-list'
							})
							This.DownLoading = false
						})

					})
				}
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
			handleDownload() {
				let This = this
				This.DownLoading = true
				This.LoadContent(false, false, true)

			},
			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => {
					if(j === 'timestamp') {
						return parseTime(v[j])
					} else {
						return v[j]
					}
				}))
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
			    this.LoadPage=loadpage
				this.LoadContent(false, this.LoadPage, false)
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
			},
		}
	}
</script>