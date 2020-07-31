<!-- 首页 -->
<template>
  <div id="home">
    <!-- 轮播图 start -->


    <!-- 轮播图 end -->
    <br />
    <!-- 八宫格 导航 start -->
    <div class="panel-box">
      <div class="palace-box">
        <div class="item-box" data-index="1">
          <!-- 扫描二维码组件 -->
          <!-- <scanit /> -->
        </div>
        <div class="item-box" data-index="2"><i class="icon iconfont icon-tableware"></i><span>预约点餐</span></div>
        <div class="item-box" data-index="3"><i class="icon iconfont icon-people"></i><span>推荐好友</span></div>
        <div class="item-box" data-index="4"><i class="icon iconfont icon-shop"></i><span>商铺位置</span></div>
        <div class="item-box" data-index="5"><i class="icon iconfont icon-phone-1"></i><span>电话联系</span></div>
        <div class="item-box" data-index="6"></div>
      </div>
    </div>
    <!-- 八宫格 导航 end -->
    <!-- 商家店铺基本信息 start -->
    <br />
    <div class="panel-box">
      <ul class="base-info-list">
        <li>
          <i class="icon iconfont icon-phone"></i>
          <span class="title">电话：</span>
          <span class="content"><a href="tel:400-666-666">400-666-666</a></span>
          <i class="tips">拨打</i>
        </li>
        <li>
          <i class="icon iconfont icon-address"></i>
          <span class="title">商家地址：</span>
          <span class="content">北京市东城区故宫博物馆</span>
          <i class="tips">导航</i>
        </li>
        <li>
          <i class="icon iconfont icon-time"></i>
          <span class="title">营业时间：</span>
          <span class="content">早上8点 - 下午8点</span>
          <!-- <i class="tips"></i> -->
        </li>
      </ul>
    </div>
    <br>
    <!-- 商家店铺基本信息 end -->
    <!-- 优惠信息 start -->
    <div class="panel-box">
      <ul class="discount-info-list">
        <li><i class="icon-block-blue">付</i><span>该商家支持在线支付</span></li>
        <li><i class="icon-block-red">惠</i><span>消费满10元配送</span></li>
      </ul>
    </div>
    <br />
    <!-- 优惠信息 end -->
    <!-- 查看店铺 start -->
    <div class="panel-box">
      <router-link :to="{path:'/order/1223'}">
        <!-- <p class="lookShop">查看店铺<x-icon type="ios-arrow-forward" class="arrow-right" size="20">右箭头</x-icon></p> -->
      </router-link>
    </div>
    <!-- 查看店铺 end -->
    <div class="message-bar">
      <ul class="message-bar-box">
        <li><i class="icon iconfont icon-address"></i><span>一键导航</span></li>
        <li><i class="icon iconfont icon-phone-1"></i><span>一键拨号</span></li>
        <li><i class="icon iconfont icon-inline-phone"></i><span>在线客服</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
  // import scanit from "./com/scanit.vue";

  export default {
    name: 'home',
    components: {
      // scanit
    },
    data() {
      return {
        imgsList: [{
          src: require('./banner.jpg'),
        }, {
          src: require('./banner.jpg'),
          fallbackImg: require('./banner.jpg')
        }]
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "./fonts/iconfont.css";

  #home {
    background-color: #f0f0f0;

    .panel-box {
      background-color: white;
      box-shadow: 0 3px 8px 3px #f3f3f3;
    }

    .palace-box {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;

      .item-box {
        float: left;
        width: 25%;
        position: relative;

        i,
        span {
          display: block;
          text-align: center;
        }

        i.icon {
          // font-size: 10px;
        }

        .icon-scanit {
          color: #69a238;
        }

        .icon-tableware {
          color: #31ae93
        }

        .icon-people {
          color: #df8c88;
        }

        .icon-shop {
          color: #369ce4;
        }

        .icon-phone-1 {
          color: #40af34;
        }
      }
    }



    /* 店铺基本信息 */
    .base-info-list {
      li {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #f3f3f3;

        .tips {
          background-color: #50b2fc;
          color: white;
          font-size: 12px;
          font-style: normal;
          padding: 3px;
          border-radius: 3px;
        }
      }
    }

    // 优惠信息
    .discount-info-list {
      li {
        height: 40px;
        line-height: 40px;

        i {
          padding: 3px;
          text-align: center;
          margin: 0 5px;
          font-size: 8px;
        }

        .icon-block-blue {
          color: #7eb4ed;
          border: 1px solid #7eb4ed;
        }

        .icon-block-red {
          color: white;
          background-color: #eb5532;
          border: 1px solid #eb5532;
        }
      }
    }

    // 查看店铺
    .lookShop {
      height: 40px;
      line-height: 40px;

      .arrow-right {
        float: right;
        margin-right: 10px;
        margin-top: 10px;
        vertical-align: middle;
      }
    }

    // 消息侧边栏
    .message-bar {
      position: fixed;
      right: 0;
      top: 35%;
      width: 60px;
      height: 200px;
      border-bottom-left-radius: 10px;
      border-top-left-radius: 10px;
      z-index: 2;
      background-color: rgba(0, 0, 0, 0.6);

      .message-bar-box {
        li {
          color: white;
          display: block;
          text-align: center;
          line-height: 28px;

          span {
            font-size: 12px;
          }
        }

        .icon {
          font-size: 32px;
          text-align: center;
          display: block;
        }

        .icon-address {
          color: #1fa3ed;
        }

        .icon-phone-1 {
          color: #f19423;
        }

        .icon-inline-phone {
          color: tomato;
        }
      }
    }
  }
</style>