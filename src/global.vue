<script>
	import Cookies from 'js-cookie'
	//服务端接口
	var ServerSrc = '/api'
	//oss地址
	var OssUrl = 'https://makelive-hn1.oss-cn-shenzhen.aliyuncs.com/'
	
	var OssUrlReplace= /https:\/\/makelive-hn1.oss-cn-shenzhen.aliyuncs.com\//g

	var OssThumb = '-thumb'
	var OssThumbReplace = /-thumb/g
	var OssVideoThumb = '?x-oss-process=video/snapshot,t_10000,m_fast'
	var OssVideoThumbReplace= /\?x-oss-process=video\/snapshot,t_10000,m_fast/g
	//翻页配置
	var LoadNum = 10
	var PageSizes = [10, 20, 50, 100, 200]
	var UserInfo=Cookies.get('UserInfo')
	if(UserInfo){
		UserInfo = JSON.parse(UserInfo)
	}
	
	export default {
		ServerSrc,
		OssUrl,
		OssUrlReplace,
		LoadNum,
		PageSizes,
		OssThumb,
		OssThumbReplace,
		OssVideoThumb,
		OssVideoThumbReplace,
		UserInfo,

	}
</script>