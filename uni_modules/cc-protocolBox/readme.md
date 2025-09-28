# cc-protocolBox 
 


##uniapp专属精品组件页面模板（由前端组件开发出品）精品组件页面模板

###●组件模板规划：
由前端组件开发出品的精品组件页面模板，将陆续发布，预计高达约几百种供您使用，是快速快发项目、创业的必备精品。

合集地址： uni-app模板合集地址：(https://ext.dcloud.net.cn/publisher?id=274945) 如查看全部页面模板，请前往上述uniapp插件市场合集地址；

###●组件模板效果图：
可下载项目后预览，效果图见右侧图片；

###●组件模板费用：
学习：免费下载，进行学习，无费用；

使用/商用：本页面地址赞赏10元后，可终身商用；

###●组件模板使用版权/商用：
本组件模板免费下载可供学习，如需使用及商用，请在本组件页面模板进行赞赏10元

（仅需10元获取精品页面模板代码-物有所值，1个组件页面市场价100元 ）

赞赏10元后（当前项目产生赞赏订单可追溯）即可终身商用当前本地址下载的页面模版代码，不同下载地址需进行不同的赞赏。（不赞赏就进行商用使用者，面临侵权！保留追究知识产权法律责任！后果自负！）

### 我的技术公众号(私信可加前端技术交流群)

群内气氛挺不错的，应该或许可能大概，算是为数不多的，专搞技术的前端群，偶尔聊天摸鱼

![图片](https://i.postimg.cc/RZ0sjnYP/front-End-Component.jpg)


#### 使用方法 
```使用方法
<!-- agree：是否同意勾选  protocolArr：协议数组 @click：勾选同意点击 @protocolClick：协议点击 -->
<cc-protocolBox :agree="agree" :protocolArr="protocolArr" @click="agree = !agree"
			@protocolClick="protocolClick"></cc-protocolBox>	

```

#### HTML代码实现部分
```html
<template>
	<view>

		<view class="header">单个协议条款</view>

		<!-- agree：是否同意勾选  protocolArr：协议数组 @click：勾选同意点击 @protocolClick：协议点击 -->
		<cc-protocolBox :agree="agree" :protocolArr="protocolArr" @click="agree = !agree"
			@protocolClick="protocolClick"></cc-protocolBox>


		<view class="header">多个协议条款</view>

		<!-- agree：是否同意勾选  protocolArr：协议数组 @click：勾选同意点击 @protocolClick：协议点击 -->
		<cc-protocolBox :agree="agreeTwo" :protocolArr="protocolArrTwo" @click="agreeTwo = !agreeTwo"
			@protocolClick="protocolClickTwo"></cc-protocolBox>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				agree: false,
				agreeTwo: false,
				protocolArr: ["<App隐私协议>"],
				protocolArrTwo: ["风险提示函", "基金合同", "招募说明书", "基金产品概要"],

			}
		},
		methods: {

			protocolClick(tag) {

				console.log('点击协议序列 = ' + tag);
				uni.showModal({
					title: '点击协议',
					content: '点击协议序列 = ' + tag
				})
			},

			protocolClickTwo(tag) {

				console.log('点击协议序列 = ' + tag);
				uni.showModal({
					title: '点击协议',
					content: '点击协议序列 = ' + tag
				})
			},
		}
	}
</script>

<style scoped>
	.header {
		margin-top: 20px;
		padding: 10px 20px;
		font-size: 16px;
		background-color: antiquewhite;

	}
</style>



```

#### 组件实现代码 
```组件实现代码
<template>
	<view class="protocol_box">
		<view class="select" :class="{active: agree}" @click="agreeClick"></view>
		我已仔细阅读

		<view v-for="(item, index) in protocolArr" :key="index">

			<text @click="protocolClick(index)">{{protocolArr[index]}}</text>

			<span v-if="index < (protocolArr.length - 1)">{{" 、"}}</span>

		</view>

	</view>
</template>

<script>
	export default {
		props: {
			// 是否同意
			agree: {
				type: Boolean,
				default: false
			},
			// 协议数组
			protocolArr: {
				type: Array,
				default: function() {
					return [];
				}
			},

		},

		methods: {
			// 是否同意勾选
			agreeClick() {

				this.$emit('click')

			},
			protocolClick(tag) {

				this.$emit('protocolClick', tag)

			}

		}


	}
</script>




<style lang="scss" scoped>
	//主题色 #ea552d
	$themeColor: #ea552d;



	.protocol_box {

		display: flex;
		flex-wrap: wrap;


		justify-content: center;
		align-items: center;

		margin-top: 40rpx;
		margin-left: 2%;
		width: 96%;
		font-size: 28rpx;
		color: #333333;
		font-size: 13px;




		.select {
			width: 36rpx;
			height: 36rpx;
			background-image: url("./ic_nor.png");
			background-position: center center;
			background-repeat: no-repeat;
			background-size: 100% auto;
			margin-right: 15rpx;
			margin-top: 2px;


			&.active {
				background-image: url("./ic_sel.png");
			}
		}

		text {


			color: $themeColor;
			font-size: 13px;

			white-space: pre-wrap;



		}


	}
</style>
					


```