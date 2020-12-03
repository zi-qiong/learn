<template>
    <div>
        child12
        <button @click="handleClick">child12按钮</button>
    </div>
</template>
<script>
export default {
    methods: {
        handleClick() {
            this.$eventBus.$emit("getRef")
        }
    },
}
</script>