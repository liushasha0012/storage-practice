<template>
    <div class="wrapper">
        <div class="text">距离<span class="notice">分享结束</span>还有：</div> 
        <count-down :countDownTime="time"></count-down>

        <div class="cont">
            <div class="text">新年快乐～1234~</div>
        </div>
    </div>
</template>
<script>
import CountDown from './count-down.vue';
export default {
    components: {
        CountDown
    },
    data() {
        return {
            time: 7234000,
        }
    }
}
</script>
<style src="./index.css"></style>
