<template>
    <div>
        child21
        <p>$attrs: {{ $attrs }}</p>
        <button @click="handleClick">child21按钮</button>
    </div>
</template>
<script>
export default {
    props: {
        name: String
    },
    methods: {
        handleClick() {
            this.$emit('test2')
        }
    },
}
</script>