<template>
	<div class="app-container">
		<el-row :gutter="12">

  <el-col :span="6">
    <el-card shadow="hover">
     <img src="" class="image">
      <div style="padding: 14px;">
        <span>好吃的汉堡</span>
        <div class="bottom clearfix">
          <time class="time">123</time>
          <el-button type="text" class="button">操作按钮</el-button>
        </div>
      </div>
    </el-card>
  </el-col>

</el-row>
	</div>
</template>
<script>
	export default {
		data() {
   return {
   
    };
		},
		mounted() {

		},
		methods: {

		}
	}
</script>
<style>
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>