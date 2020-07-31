<template>
    <div class="item-box" @click="clickScanIt"><i class="icon iconfont icon-scanit"></i><span>扫一扫</span></div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    methods: {
      clickScanIt: function () {
        //这里【url参数一定是去参的本网址】
        this.$http.get('获取微信认证参数的地址?url=去参的本网页地址').then((response) => {
          var jsondata = JSON.parse(response);
          this.$wechat.config({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            // 必填，公众号的唯一标识
            appId: jsondata.model.appId,
            // 必填，生成签名的时间戳
            timestamp: "" + jsondata.model.timestamp,
            // 必填，生成签名的随机串
            nonceStr: jsondata.model.nonceStr,
            // 必填，签名
            signature: jsondata.model.signature,
            // 必填，需要使用的JS接口列表，所有JS接口列表
            jsApiList: ['checkJsApi', 'scanQRCode']
          });
        });
        this.$wechat.error(function (res) {
          alert("出错了：" + res.errMsg); //这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
        });

        this.$wechat.ready(function () {
          this.$wechat.checkJsApi({
            jsApiList: ['scanQRCode'],
            success: function (res) {

            }
          });

          this.$wechat.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
              alert("扫描结果：" + result);
              window.location.href = result; //因为我这边是扫描后有个链接，然后跳转到该页面
            }
          });

        });
      }

    }
  }

</script>
