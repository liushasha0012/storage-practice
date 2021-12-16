<template>
    <div class="wrapper">
        <div class="build-btns">
            <div class="btn" @click="createBranch">创建git分支</div>
            <div class="btn btn-1" @click="staging">预发布</div>
            <div class="btn btn-1" @click="production">正式发布</div>
        </div>
        <div class="cache-config">
            <div class="config">
                <div class="time-text">设置强缓存时间：</div> 
                <input  placeholder="请输入时间 /秒" class="input" v-model="cache1"/>
                <div class="time-btn" @click="setCacheTime1">提交</div>
            </div>
            <!-- <div class="config">
                <div class="time-text">设置CDN缓存时间：</div> 
                <input  placeholder="请输入时间 /秒" class="input" v-model="cache2"/>
                <div class="time-btn">提交</div>
            </div> -->
            <div class="use-weak-cache-btn" @click="setWeakCache(1)">使用协商缓存</div>
        </div>
        <div class="cache-config cache-config-1">
            <div class="config">
                <div class="refresh-btn" @click="refreshCacheTime1">刷新强缓存</div>
                <div class="refresh-btn" @click="setWeakCache(0)">刷新协商缓存</div>
                <div class="refresh-btn">刷新CDN缓存</div>
            </div>
        </div>
    </div>
</template>
<script>
import {AjaxClient} from 'ajax-client'
const ajax = new AjaxClient();

export default {
    data() {
        return {
            isDev: true,
            ableCreateBranch: true,
            ableStaging: true,
            ableProduction: true,
            cache1: '', // 强缓存时间
            cache2: '', // cdn缓存时间
            ableCache1: true,
            ableCache2: true,
            ableRefreshCache1: true,
            ableSetWeakCache: true,
        }
    },
    methods: {
        ajaxApi(path, data) {
            return new Promise((resolve, reject) => {
                let host = this.isDev ? '127.0.0.1' : '112.124.201.59';

                ajax.postAsync({
                    url: `http://${host}:9999/${path}`,
                    headers: {
                        'X-Original-Header1': 'header-value-1', //Additional Headers
                        'X-Original-Header2': 'header-value-2',
                    },
                    contentType: 'application/json; charset = UTF-8', //content-type of sending data
                    data: JSON.stringify(data), // text data
                    dataType: 'json', // data type to parse when receiving response from server
                    success: response => {
                        resolve(response);
                    },
                    error: e => {
                        reject(e);
                    },
                });
            })
        },
        createBranch() {
            console.log('createBranch')

            if (this.ableCreateBranch) {
                this.ableCreateBranch = false;
                
                const data = {
                    message: "hello"
                }

                this.ajaxApi('test', data).then((res) => {
                    this.ableCreateBranch = true;

                    console.log('success')
                    console.log(res);
                }).catch((err) => {
                    this.ableCreateBranch = true;
                    
                    console.log('error')
                    console.error(err);
                });
            }
        },
        staging() {
            console.log('staging')

            if (this.ableStaging) {
                this.ableStaging = false;

                const data = {
                    message: "hello"
                }

                this.ajaxApi('staging', data).then((res) => {
                    this.ableStaging = true;

                    console.log('success')
                    console.log(res);
                }).catch((err) => {
                    this.ableStaging = true;

                    console.log('error')
                    console.error(err);
                });
            }
        },
        production() {
            console.log('production')
            
            if (this.ableProduction) {
                this.ableProduction = false;
                const data = {
                    message: "hello"
                }

                this.ajaxApi('production', data).then((res) => {
                    this.ableProduction = true;

                    console.log('success')
                    console.log(res);
                }).catch((err) => {
                    this.ableProduction = true;

                    console.log('error')
                    console.error(err);
                });
            }
        },
        setCacheTime1() {
            if (!this.cache1) {
                window.alert('请填入强缓存时间～');
                return;
            }

            if (this.ableCache1) {
                this.ableCache1 = false;

                const data = {
                    time: this.cache1,
                }

                this.ajaxApi('cache1', data).then((res) => {
                    this.ableCache1 = true;

                    console.log('success')
                    console.log(res);

                    if (res.success) {
                        window.alert('成功~');
                    } else {
                        window.alert('失败~');
                    }
                }).catch((err) => {
                    this.ableCache1 = true;

                    console.log('error')
                    console.error(err);
                });
            }
        },
        refreshCacheTime1() {
            console.log('refreshCacheTime1');
            this.cache1 = 0;

            if (this.ableRefreshCache1) {
                this.ableRefreshCache1 = false;
                
                const data = {
                    time: 0,
                }

                this.ajaxApi('cache1', data).then((res) => {
                    this.ableRefreshCache1 = true;
                    console.log('success')
                    console.log(res);

                    if (res.success) {
                        window.alert('成功~');
                    } else {
                        window.alert('失败~');
                    }
                }).catch((err) => {
                    this.ableRefreshCache1 = true;
                    console.log('error');
                    console.error(err);
                });
            }
        },
        setWeakCache(value) {
            console.log('setWeakCache');

            if (this.ableSetWeakCache) {
                this.ableSetWeakCache = false;
                
                const data = {
                    useWeakcCache: value,
                }

                this.ajaxApi('weak-cache', data).then((res) => {
                    this.ableSetWeakCache = true;
                    console.log('success')
                    console.log(res);

                    if (res.success) {
                        window.alert('成功~');
                    } else {
                        window.alert('失败~');
                    }
                }).catch((err) => {
                    this.ableSetWeakCache = true;
                    console.log('error');
                    console.error(err);
                });
            }
        },
    }
}
</script>
<style>
.wrapper {
    padding: 20px;
    font-size: 24px;
    line-height: 30px;
    color: #353535;
}
.build-btns {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: 20px;
    border-bottom: 1px solid #5f5f5f;
}
.btn {
    width: 200px;
    font-size: 24px;
    line-height: 60px;
    color: #353535;
    text-align: center;
    border: 1px solid #353535;
    border-radius: 12px;
}
.btn-1 {
    margin-left: 20px;
}
.cache-config {
    margin-top: 20px;
    border-bottom: 1px solid #5f5f5f;
}
.cache-config-1 {
    border: none;
}
.config {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: 20px;
}
.time-text {
    width: 224px;
}
.input {
    margin-right: 8px;
    width: 180px;
    height: 40px;
    text-align: center;
}
.time-btn {
    width: 80px;
    font-size: 24px;
    line-height: 40px;
    color: #353535;
    text-align: center;
    border: 1px solid #353535;
    border-radius: 12px;
}
.refresh-btn {
    margin-right: 16px;
    font-size: 24px;
    line-height: 40px;
    padding: 0 12px;
    color: #353535;
    text-align: center;
    border: 1px solid #353535;
    border-radius: 12px;
}
.use-weak-cache-btn {
    width: 220px;
    margin-bottom: 16px;
    font-size: 24px;
    line-height: 40px;
    color: #fff;
    text-align: center;
    background-color: #7aaf7a;
    border: 1px solid #7aaf7a;
    border-radius: 12px;
}
</style>