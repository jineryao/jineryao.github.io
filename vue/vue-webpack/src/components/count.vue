<template>
    <ul>
        <li v-for="(index,task) in tasks" @dblclick="changeCount">
            <span>{{ task.count }}</span>
            <button @click="addCount(this)">+</button>
            <button @click="reCount(this)">-</button>
            <button @click="remove(task)">X</button>
        </li>
    </ul>
</template>

<script>
    export default {
        props:['tasks'],
        methods:{
            addCount(obj){
                obj.task.count += 1;
            },
            reCount(obj){
                let num = obj.task.count;
                num -= 1;
                obj.task.count = num < 0 ? 0 : num;
            },
            remove(obj){
                //抛出事件
                this.$dispatch('child-remove',obj);
            },
            changeCount(ev){
                let tag = ev.tagget || ev.srcElement;
                if(tag.nodeName !="BUTTON"){
                    this.tasks.push( {count:1} );
                }
            }
        }
    }
</script>