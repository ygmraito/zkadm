//随机生成字符串
export function RandomString(Len) {
	Len = Len || 32;
	var Chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	var MaxPos = Chars.length;
	var Encrypt = '';
	for(var i = 0; i < Len; i++) {
		Encrypt += Chars.charAt(Math.floor(Math.random() * MaxPos));
	}
	return Encrypt;
}
//随机生成数字
export function RandomNum(Len) {
	var Num = 0;
	for(var i = 0; i < Len; i++) {
		Num += Math.floor(Math.random() * 10)
	}
	return Num
}

//时间戳转换
export function TimeTrans(date, format) {
	var date = new Date(date)
	var Y=""
	var M=""
	var D=""
	if(format == 'file') {
		 Y = date.getFullYear()+''
		 M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)+''
		 D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())+''
	} else {
		 Y = date.getFullYear() + '年'
		 M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月'
		 D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '日'
	}
	var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
	var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
	var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
	if(format == "hm") {
		return Y + M + D + h + m
	} else if(format == "day" || format == "file") {
		return Y + M + D
	} else if(format == "md") {
		return M + D;
	} else {
		return Y + M + D + h + m + s
	}

}