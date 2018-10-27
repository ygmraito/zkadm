<template>
	<div class="app-container">
		
		
		
		<a-player autoplay :music='data1' :narrow="false" stmaxheight='96px' mode="circulation"> 
</a-player>
		
		
	
	</div>
</template>
<script>
	import VueAplayer from 'vue-aplayer'
	export default {
		components: {
			//别忘了引入组件
			'a-player': VueAplayer
		},
		data() {
			return {
				
				data1:{
		title:"BF_L1_CDA_Tr3 hallo song",
		author:"bigfun",
		url:"https://makelive-hn1.oss-cn-shenzhen.aliyuncs.com/record/GdX54H1527341236000/img/20180911/BF_L1_CDB_Tr2.mp3",
		pic:"https://makelive-hn1.oss-cn-shenzhen.aliyuncs.com/record/GdX54H1527341236000/img/20180911/1536673039011u%3D3086157192%2C4051919734%26fm%3D58%26s%3D2417EF36CCB06C0322E9D57F03005061%26bpow%3D121%26bpoh%3D75.jpg?OSSAccessKeyId=LTAIEmFZoFJ5SIlN&Expires=1536738044&Signature=ilyf7ggY2kLaYe82bFJd0Q2ylhM%3D",
		irl:"https://makelive-hn1.oss-cn-shenzhen.aliyuncs.com/record/GdX54H1527341236000/img/20180911/1487150211.lrc?OSSAccessKeyId=LTAIEmFZoFJ5SIlN&Expires=1536738237&Signature=WVNmmSxwbz688g6pKTt9I6cbSA4%3D"
	},
data2:[{
		title:"BF_L1_CDA_Tr3 hallo song",
		author:"bigfun",
		url:"https://makelive-hn1.oss-cn-shenzhen.aliyuncs.com/record/GdX54H1527341236000/img/20180911/BF_L1_CDA_Tr3+hallo+song.mp3?OSSAccessKeyId=LTAIEmFZoFJ5SIlN&Expires=1536737938&Signature=KSlKGh7UHpv5rMeQp%2BeprUTVUSA%3D",
		pic:"https://makelive-hn1.oss-cn-shenzhen.aliyuncs.com/record/GdX54H1527341236000/img/20180911/1536673039011u%3D3086157192%2C4051919734%26fm%3D58%26s%3D2417EF36CCB06C0322E9D57F03005061%26bpow%3D121%26bpoh%3D75.jpg?OSSAccessKeyId=LTAIEmFZoFJ5SIlN&Expires=1536738044&Signature=ilyf7ggY2kLaYe82bFJd0Q2ylhM%3D",
		irl:"https://makelive-hn1.oss-cn-shenzhen.aliyuncs.com/record/GdX54H1527341236000/img/20180911/1487150211.lrc?OSSAccessKeyId=LTAIEmFZoFJ5SIlN&Expires=1536738237&Signature=WVNmmSxwbz688g6pKTt9I6cbSA4%3D"
	}, {
		title:"BF_L1_CDB_Tr2",
		author:"bigfun",
		url:"https://makelive-hn1.oss-cn-shenzhen.aliyuncs.com/record/GdX54H1527341236000/img/20180911/BF_L1_CDA_Tr3+hallo+song.mp3?OSSAccessKeyId=LTAIEmFZoFJ5SIlN&Expires=1536737938&Signature=KSlKGh7UHpv5rMeQp%2BeprUTVUSA%3D",
		pic:"https://makelive-hn1.oss-cn-shenzhen.aliyuncs.com/record/GdX54H1527341236000/img/20180911/1536673039011u%3D3086157192%2C4051919734%26fm%3D58%26s%3D2417EF36CCB06C0322E9D57F03005061%26bpow%3D121%26bpoh%3D75.jpg?OSSAccessKeyId=LTAIEmFZoFJ5SIlN&Expires=1536738044&Signature=ilyf7ggY2kLaYe82bFJd0Q2ylhM%3D",
		irl:"https://makelive-hn1.oss-cn-shenzhen.aliyuncs.com/record/GdX54H1527341236000/img/20180911/1487150211.lrc?OSSAccessKeyId=LTAIEmFZoFJ5SIlN&Expires=1536738237&Signature=WVNmmSxwbz688g6pKTt9I6cbSA4%3D"
	}, {
		title:"BF_L1_CDB_Tr3",
		author:"bigfun",
		url:"https://makelive-hn1.oss-cn-shenzhen.aliyuncs.com/record/GdX54H1527341236000/img/20180911/BF_L1_CDB_Tr2.mp3?OSSAccessKeyId=LTAIEmFZoFJ5SIlN&Expires=1536738000&Signature=orTq5l40r7CSanF9k9%2FucopDKD8%3D",
		pic:"https://makelive-hn1.oss-cn-shenzhen.aliyuncs.com/record/GdX54H1527341236000/img/20180911/1536673039011u%3D3086157192%2C4051919734%26fm%3D58%26s%3D2417EF36CCB06C0322E9D57F03005061%26bpow%3D121%26bpoh%3D75.jpg?OSSAccessKeyId=LTAIEmFZoFJ5SIlN&Expires=1536738044&Signature=ilyf7ggY2kLaYe82bFJd0Q2ylhM%3D",
		irl:"https://makelive-hn1.oss-cn-shenzhen.aliyuncs.com/record/GdX54H1527341236000/img/20180911/1487150211.lrc?OSSAccessKeyId=LTAIEmFZoFJ5SIlN&Expires=1536738237&Signature=WVNmmSxwbz688g6pKTt9I6cbSA4%3D"
	}, {
		title:"BF_L1_CDB_Tr4",
		author:"bigfun",
		url:"https://makelive-hn1.oss-cn-shenzhen.aliyuncs.com/record/GdX54H1527341236000/img/20180911/BF_L1_CDB_Tr2.mp3?OSSAccessKeyId=LTAIEmFZoFJ5SIlN&Expires=1536738000&Signature=orTq5l40r7CSanF9k9%2FucopDKD8%3D",
		pic:"https://makelive-hn1.oss-cn-shenzhen.aliyuncs.com/record/GdX54H1527341236000/img/20180911/1536673039011u%3D3086157192%2C4051919734%26fm%3D58%26s%3D2417EF36CCB06C0322E9D57F03005061%26bpow%3D121%26bpoh%3D75.jpg?OSSAccessKeyId=LTAIEmFZoFJ5SIlN&Expires=1536738044&Signature=ilyf7ggY2kLaYe82bFJd0Q2ylhM%3D",
		irl:"https://makelive-hn1.oss-cn-shenzhen.aliyuncs.com/record/GdX54H1527341236000/img/20180911/1487150211.lrc?OSSAccessKeyId=LTAIEmFZoFJ5SIlN&Expires=1536738237&Signature=WVNmmSxwbz688g6pKTt9I6cbSA4%3D"
	}]
			
		
			}
		},
		mounted() {
			//异步加载，先加载出player再使用
		

		},
		methods: {
			
		}
	}
</script>