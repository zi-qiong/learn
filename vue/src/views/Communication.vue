<template>
    <div class="communication">
        <ul>
            <li>props、$emit</li>
            <li>eventBus--新建个vue实例，然后$on监听，$emit发送</li>
            <li>href</li>
            <li>
                vuex--state, getter(对state的封装),
                mutatiins(唯一能改变state的地方),
                action(函数，可以和mutation搭配使用), modules (mapMutations,
                mapGetters, mapActions)
            </li>
            <li>
                window.localStorage.getItem(key)获取数据
                通过window.localStorage.setItem(key,value)存储数据
            </li>
            <li>
                $children、$parent($children
                的值是数组，而$parent是个对象)主要作用于应急，更推荐props,event
            </li>
            <li>provide、inject</li>
            <li>inheritAttrs、$attrs、$listeners</li>
        </ul>

        <button @click="getRef">child按钮</button>
        <Child1
            ref="child"
            :articleList="articleList"
            @alertArtical="alertArtical"
        ></Child1>

        <Child2
            :name="name"
            :age="age"
            :gender="gender"
            :height="height"
            title="程序员成长指北"
            @test1="test1"
            @test2="test2"
        ></Child2>
    </div>
</template>
<script>
import Child1 from "@/components/Communication/child1.vue";
import Child2 from "@/components/Communication/child2.vue";
export default {
    data() {
        return {
            articleList: ["红楼梦", "西游记", "三国演义"],
            name: "zhang",
            age: "18",
            gender: "女",
            height: "158",
        };
    },
    provide: {
        msg: "父元素",
    },
    components: { Child1, Child2 },
    mounted() {
        this.$eventBus.$on("getRef", this.getRef);
        // EventBus.$off('addition', {}) 移除事件监听
        console.log(this.$children[0].name);
    },
    methods: {
        alertArtical(name) {
            alert(name);
        },
        getRef() {
            let child = this.$refs.child;
            console.log(child);
            alert(child.name);
            setTimeout(() => {
                child.handleRef();
            }, 1000);
        },
        test1() {
            alert("test1")
        },
        test2() {
            alert("test2")
        }
    },
};
</script>
<style lang="scss">
.communication {
    ul {
        padding: 10px;
        list-style: none;
        background: mix(#545c64, #ffffff, 30%);
        li {
            min-height: 36px;
            line-height: 36px;
        }
        li + li {
            border-top: 1px solid #fff;
        }
    }
}
</style>