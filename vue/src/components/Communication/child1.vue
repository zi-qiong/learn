<template>
    <div>
        <div
            v-for="(article, index) in articleList"
            :key="index"
            @click="handleClick(article)"
        >
            {{ article }}
        </div>
        {{msg}}
        <Child11 />
        <Child12 />
    </div>
</template>
<script>
import Child11 from "./child1-1.vue";
import Child12 from "./child1-2.vue";
export default {
    name: "Child1",
    props: {
        articleList: Array,
    },
    inject: ['msg'],
    data() {
        return {
            name: 'child1'
        }
    },
    components: {Child11, Child12},
    beforeCreate () {
        console.log('beforeCreate2')
    },
    created() {
        console.log('created2')
    },
    beforeMount() {
        console.log('beforeMount2')
    },
    mounted() {
        console.log('mounted2')
        console.log(this.$parent.articleList, 'parent')
    },
    methods: {
        handleClick(article) {
            this.$emit("alertArtical", article);
        },
        handleRef() {
            alert("href调用成功")
        }
    },
};
</script>