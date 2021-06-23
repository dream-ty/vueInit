<!-- 图标加文字 -->
<template>
  <div class="imgBox">
    <img :src="imgMap[text] || ''" /><span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      require: true,
      default: '',
      type: [String],
    },
    src: {
      require: true,
      default: '',
      type: [String, Object],
    },
  },
  data() {
    return {};
  },
  computed: {
    imgMap() {
      return {
        etc: require('@/assets/images/graphicsImg/currency/ETC.png'),
        eth: require('@/assets/images/graphicsImg/currency/ETH.png'),
        binance: require('@/assets/images/graphicsImg/pool/币安Binance.png'),
        poolin: require('@/assets/images/graphicsImg/pool/币印Poolin.png'),
        '666pool': require('@/assets/images/graphicsImg/pool/独角兽.png'),
        'n-huobipool': require('@/assets/images/graphicsImg/pool/火币Huobipool.png'),
        's-huobipool': require('@/assets/images/graphicsImg/pool/火币Huobipool.png'),
        beepool: require('@/assets/images/graphicsImg/pool/蜜蜂.png'),
        uupool: require('@/assets/images/graphicsImg/pool/双优UUpool.png'),
        viabtc: require('@/assets/images/graphicsImg/pool/微比特ViaBTC.png'),
        xnpool: require('@/assets/images/graphicsImg/pool/小鸟Xnpool.png'),
        sparkpool: require('@/assets/images/graphicsImg/pool/星火Sparkpool.png'),
        pandaminer: require('@/assets/images/graphicsImg/pool/熊猫Pandaminer.png'),
        easy2mine: require('@/assets/images/graphicsImg/pool/易池Easy2Mine.png'),
        'f2pool': require('@/assets/images/graphicsImg/pool/鱼池F2Pool.png'),
        'ethermine': require('@/assets/images/graphicsImg/pool/Ethermine.png'),
        cloudpool: require('@/assets/images/graphicsImg/pool/云池Cloudpool.png'),
        spiderPool: require('@/assets/images/graphicsImg/pool/蜘蛛SpiderPool.png'),
        'n-btccom': require('@/assets/images/graphicsImg/pool/BTCcom.png'),
        's-btccom': require('@/assets/images/graphicsImg/pool/BTCcom.png'),
        okpool: require('@/assets/images/graphicsImg/pool/OKEx.png'),
        yunpools: require('@/assets/images/graphicsImg/pool/Yunpools.png'),
        // 钱包: require('@/assets/images/graphicsImg/wallet/钱包.png'),
        // 子账户: require('@/assets/images/graphicsImg/wallet/子账户.png'),
      };
    },
  },
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang='scss' scoped>
/* @import '~./index.scss'; 引入scss类 */
.imgBox {
  text-overflow: ellipsis;
  overflow: hidden;
  width:120px;
  white-space: nowrap;  
  > img {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin-right: 2px;
  }
  > span {
    vertical-align: middle;
  }
}
</style>