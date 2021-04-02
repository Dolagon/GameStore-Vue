<template>
  <div id="container">
    <div id="clock">
      <h2>the time is now</h2>
      <div id="time">
        <div><span id="hour">00</span><span>Hours</span></div>
        <div><span id="min">00</span><span>Minutes</span></div>
        <div><span id="sec">00</span><span>Seconds</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/views/admin/config/time'

export default {
  name: "Background",
}
</script>

<style scoped>
#container{
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
#clock h2{
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.4em;
  font-size: 0.9em;
  text-align: center;
  margin-bottom: 20px;
  /*position: relative;*/
  /*display: block;*/
}
#clock #time{
  display: flex;
}
#clock #time div{
  /*position: relative;*/
  margin: 0 5px;
  -webkit-box-reflect: below 1px linear-gradient(transparent, #0005);     /*below向下镜像，距离1px，全透明彩色渐变*/
}
#clock #time div span{
  /*position: relative;*/
  /*display: block;*/
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 80px;
  background: #099b63;
  color: #fff;
  font-weight: 100;
  font-size: 3em;
  /*z-index: 100;*/
  /*border: #1b5e20 solid 1px;*/
  box-shadow: 0 0 0 3px rgba(0,0,0,.2);       /*设置span的阴影边框，颜色，透明度*/
}
#clock #time div span:nth-child(2){
  height: 30px;
  font-size: 0.9em;
  letter-spacing: 0.1em;
  box-shadow: none;
  background: #098450;
  text-transform: uppercase;
}
#clock #time div:last-child span{
  background: #e36221;
}
#clock #time div:last-child span:nth-child(2){
  background: #bf5921;
}
</style>