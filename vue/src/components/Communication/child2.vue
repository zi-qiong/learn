<template>
    <div>
        child2
        <p>$attrs: {{ $attrs }}</p>
        <p>{{$attrs.age}}</p>
        <button @click="handleClick">child2按钮</button>
        <Child21 v-bind="$attrs" v-on="$listeners" />
        <Child22 />
    </div>
</template>
<script>
import Child21 from "./child2-1.vue";
import Child22 from "./child2-2.vue";
export default {
    name: "Child2",
    inheritAttrs: false,
    components: {Child21, Child22},
    methods: {
        handleClick() {
            this.$emit('test1')
        }
    },
};
</script>