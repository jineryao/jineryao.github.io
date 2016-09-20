<template>
    <h2>{{title}}</h2>
    <div>
        <h3>捕获[组件删除事件]交给实例方法处理,双击添加是组件内部实现</h3>
        <demo-child :tasks="tasks" @child-remove="removeCount"></demo-child>
        <span>总数:{{ counts }}</span>
        <p>已删除数:{{ arr | json }}</p>
    </div>
    <a v-link="{name:'index'}">返回</a>
</template>

<script>
    export default {
        data(){
            return {
                title:'list内容区',
                tasks : [
                    {count : 1},
                    {count : 2},
                    {count : 3}
                ],
                arr : []
            }
        },
        computed : {
            counts : function(){
                let len = this.len ? this.len : this.tasks.length;
                let num = 0;
                for(var i=0 ; i<len; i++){
                    num += this.tasks[i].count;
                }
                return num;
            }
        },
        components:{
          'demo-child':require('../components/count.vue')
        },
        methods:{
            removeCount : function(obj){
                this.arr.push(obj.count);
                this.tasks.$remove(obj);
            }
        },
        events:{
            'child-remove' : function(obj){
                removeCount(obj);
            }
        }
    }
</script>