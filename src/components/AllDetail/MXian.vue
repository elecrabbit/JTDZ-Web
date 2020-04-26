
<template>
  <div class="MXian">
    <p class="title tit">{{title}}</p>
    <ul>
      <li v-for="(item,index) in list" :key="index" class="mxbox">
        <p v-show="false">{{getMsg}}</p>
        <p v-show="false">{{getlist}}</p>
        <div class="mxsta">
          <img :src="img" alt class='img' />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data()  {
    return {
      img: ''
    }
  },
  props: ['title', 'list', "roomNum"],
  computed: {
    getlist()    {
      console.log(this.list)
      for (var i in this.list[0].DeviceProperty)      {
        var device = this.list[0].DeviceProperty[i]
        if (device.AttributeValue == '开')        {
          if (device.AttributeName == '清理')          {
            this.img = './../../../static/images/qingli.png'
            //  $('.MXian .img').attr('width','60px !important')
          } else if (device.AttributeName == '勿扰')          {
            this.img = './../../../static/images/wurao.png'
          } else if (device.AttributeName == '请稍侯')          {
            this.img = './../../../static/images/shaohou.png'
          }
        } else if (this.list.length == 0)        {
          this.img = './../../../static/images/weilianjie.jpg'
        }
      }
    },
    getMsg()    {
      var dd = this.$store.state.count;
      console.log(this.list)
      console.log(dd);
      if (dd.DeviceName == this.list[0].DeviceName && dd.AreaOfRoom == this.list[0].AreaOfRoom && dd.OwinSHA == this.list[0].OwinSHA)      {
        for (var j = 0; j < dd.DeviceProperty.length; j++)        {
          if (dd.DeviceProperty[j].AttributeName == "勿扰")          {
            if (dd.DeviceProperty[j].AttributeValue == "开")            {
              this.img = './../../../static/images/wurao.png'
            }else{
              this.img=''
            }
          } else if (dd.DeviceProperty[j].AttributeName == "清理")          {
            if (dd.DeviceProperty[j].AttributeValue == "开")            {
              this.img = './../../../static/images/qingli.png';
              // $('.img').attr('width','60px')
              // this.$notify({
              //   title: "清理",
              //   message: this.roomNum + "房间需要清理，请尽快处理",
              //   duration: 0,
              //   type: "warning"
              // });
            }else{
              this.img=''
            }
          } else if (dd.DeviceProperty[j].AttributeName == "请稍候")          {
            if (dd.DeviceProperty[j].AttributeValue == "开")            {
              this.img = './../../../static/images/shaohou.png'
            }else{
              this.img = ''
            }
          }
        }
      }
      return dd;
    },
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.MXian {
  display: flex;
  flex-direction: column;
  // justify-content:center;
  align-items: center;
  margin: 0 20px;
  .title {
    font-size: 15px;
  }
  ul {
    list-style: none;
    li {
      width: 80px;
      height: 80px;
      border: 1px solid #ccc;
      border-radius: 50%;
      // min-width: 40px;
      margin: 20px 0;
      overflow: hidden;
      background: rgb(108, 185, 221);
      .mxsta {
        height: 80px;
        width: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 90px;
          height: 90px;
          // border-radius: 50%;
          // overflow: hidden;
          // margin:0 auto;
          // line-height: 80px;
        }
      }
    }
  }
}
</style>