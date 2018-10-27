<template>
	<div class="z_right_warp">

		<el-autocomplete class="inline-input" v-model="Classify" :fetch-suggestions="querySearch" placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect">
			<el-button slot="append" icon="el-icon-search"></el-button>
		</el-autocomplete>

		<el-table :data="ClassifyData" style="width: 100%">
			<el-table-column prop="Classify" label="类型" width="180">
			</el-table-column>
			<el-table-column prop="Number" label="数量" width="180">
			</el-table-column>
			<el-table-column prop="Date" label="添加日期">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="Edit">编辑</el-button>
					<el-button size="mini" type="danger" @click="Delete">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

	</div>
</template>
<script>
	export default {
		data() {
			return {
				restaurants: [],
				Classify: '',
				Loading: false,
				ClassifyData: [{
					Classify: '自然',
					Number: '123',
					Date: '2016-05-02'
				}, {
					Classify: '自然',
					Number: '123',
					Date: '2016-05-02'
				}, {
					Classify: '自然',
					Number: '123',
					Date: '2016-05-02'
				}]
			}
		},
		mounted() {
			this.restaurants = this.loadAll();
		},
		methods: {
			Edit() {
				this.$prompt('请输入类型名称', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',

				}).then(
					({value}) => {
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
			loadAll() {
				return [{
						"value": "word1",
						"address": "a"
					},
					{
						"value": "word2",
						"address": "b"
					}
				];
			},
			handleSelect(item) {
				console.log(item);
			},
		}
	}
</script>