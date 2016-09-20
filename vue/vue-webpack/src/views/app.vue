<style>
    body{
        background-color:#eee
    }
    h1{
        color: red;
        transform: translate(10%, 10%);/*测试自动添加前缀*/
    }
    h2{
        background-color: #bbbbbb;
    }
    .img1{ width:225px; height:318px; background-image: url("../img/1.PNG"); }
</style>

<template>
    <div>
        <h2>app内容区</h2>
        <p>结构分割清晰,很喜欢</p>
        <div class="img1"></div>
        <!--<button @click="golist">list</button>-->
        <a v-link="{ name: 'list' }">list页</a>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                name:"Test",
                age:"0"
            }
        },
        methods :{
            golist () {//方法，定义路由跳转，注意这里必须使用this，不然报错
                this.$route.router.go({name:"list"});
            }
        }
    }
</script>