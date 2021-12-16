<template>
    <div class="wrapper">
        <div class="creat-branch">
            <div class="btn" @click="createBranch">创建git分支</div>
        </div>
        
        <div class="btn btn-1" @click="staging">预发布</div>
        <div class="btn btn-1" @click="production">正式发布</div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            ableCreateBranch: true,
            ableStaging: true,
            ableProduction: true,
        }
    },
    methods: {
        createBranch() {
            console.log('websocket createBranch')
        
            if (this.ableCreateBranch) {
                this.ableCreateBranch = false;
                var ws = new WebSocket("ws://localhost:10000/create");

                ws.onopen = (evt) => { 
                    console.log('创建新分支ing~~~~~~~~~~~~~~~~')
                    console.log("Connection open ..."); 
                    ws.send("创建新分支ing～");
                };

                ws.onmessage = (evt) => {
                    console.log(evt.data)
                    
                    if (evt.data === 'create end') {
                        ws.close();
                    }
                };

                ws.onclose = (evt) => {
                    console.log("Connection closed.");
                    this.ableCreateBranch = true;
                };      
            }
        },
        staging() {
            console.log('websocket staging')
            if (this.ableStaging) {
                this.ableStaging = false;
                var ws = new WebSocket("ws://localhost:10000/staging");

                ws.onopen = (evt) => { 
                    console.log('预发布ing~~~~~~~~~~~~~~~~')

                    console.log("Connection open ..."); 
                    ws.send("预发布ing～");
                };

                ws.onmessage = (evt) => {
                    console.log(evt.data)
                    
                    if (evt.data === 'staging end') {
                        ws.close();
                    }
                };

                ws.onclose = (evt) => {
                    console.log("Connection closed.");
                    this.ableStaging = true;
                };      
            }
        },
        production() {
            console.log('websocket production')
            if (this.ableProduction) {
                this.ableProduction = false;
                 var ws = new WebSocket("ws://localhost:10000/production");

                ws.onopen = (evt) => { 
                    console.log('正式发布ing~~~~~~~~~~~~~~~~')

                    console.log("Connection open ..."); 
                    ws.send("正式发布ing～");
                };

                ws.onmessage = (evt) => {
                    console.log(evt.data)
                    
                    if (evt.data === 'production end') {
                        ws.close();
                    }
                };

                ws.onclose = (evt) => {
                    console.log("Connection closed.");
                    this.ableProduction = true;
                };      
            }
        },
    }
}
</script>
<style>
.wrapper {
    padding: 20px;
}
.creat-branch {
    display: flex;
    align-items: center;
    justify-content: flex-start;
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
    margin-top: 20px;
}
.branch {
    margin-left: 20px;
}
</style>