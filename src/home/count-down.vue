<template>
    <div class="time-down">
        <span class="time-unit small-space">{{ countTime.hours | time }}</span>
        <span class="gap-unit">:</span>
        <span class="time-unit small-space">{{ countTime.minutes | time }}</span>
        <span class="gap-unit">:</span>
        <span class="time-unit small-space">{{ countTime.seconds | time }}{{ hasMillisecond ? `.${countTime.millisecond}` : '' }}</span>
    </div>
</template>

<script>
/*
1.beforeTex，倒计时之前的文案

2.hasMillisecond，精度是否是0.1秒，默认false

3.showReplaceText，是否需要文案代替倒计时，默认false

4.replaceText，当不展示倒计时的替代文案

5.showTimeUnit，是否展示倒计时的时间块样式，默认false

6.timeNow，当前时间

7.timeEnd，结束时间
*/
// let timer;
export default {
    name: 'count-down',
    filters: {
        time(value) {
            return (`0${value}`).slice(-2);
        },
    },
    props: {
        countDownTime: {
            type: [Number, String],
            required: true,
            default: 0,
        },
        hasMillisecond: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            timer: null,
            countTime: {
                hours: '00',
                minutes: '00',
                seconds: '00',
                millisecond: '0',
            },
        };
    },
    watch: {
        countDownTime: {
            immediate: true,
            handler() {
                this.init();
            },
        },
    },
    methods: {
        init() {
            this.countDownTime && this.countDown();
        },
        countDown() {
            this.setTimer(this.countDownTime);
        },
        setTimer(countDownTime) {
            clearTimeout(this.timer);

            const interval = this.hasMillisecond ? 100 : 1000;

            const MILLISECOND = 100;
            const SECOND = 1000;
            const MINUTE = SECOND * 60;
            const HOUR = MINUTE * 60;
            this.timer = setTimeout(() => {
                if (countDownTime < SECOND) {
                    clearTimeout(this.timer);
                    window.location.reload();
                } else {
                    let hours = (countDownTime / HOUR) | 0;
                    let minutes = ((countDownTime - (hours * HOUR)) / MINUTE) | 0;
                    let seconds = ((countDownTime - (hours * HOUR) - (minutes * MINUTE)) / SECOND) | 0;
                    let millisecond = ((countDownTime - (hours * HOUR) -
                    (minutes * MINUTE) - (seconds * SECOND)) / MILLISECOND) | 0;
                    this.countTime = {
                        hours,
                        minutes,
                        seconds,
                        millisecond,
                    };
                    this.setTimer(countDownTime - interval);
                }
            }, interval);
        },
    },
};
</script>
<style>

.time-down {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 28px;
    white-space: nowrap;
    font-size: 22px;
    color: #222222;
    line-height: 1;
}
.time-unit {
    text-align: center;
    color: #FFFFFF;
    line-height: 28px;
    background: #222222;
    border-radius: 4px;
}
.gap-unit {
    margin: 0 4px;
}
.small-space {
    width: 36px;
    height: 28px;
}
.large-space  {
    width: 54px;
    height: 28px;
}
</style>
