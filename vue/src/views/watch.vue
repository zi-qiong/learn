<template>
    
</template>
<script>
export default {
    data() {
        return {
            firstName: 'Foo',
            lastName: 'Bar'
        }
    },
    mounted() {
        this.$watch()
    },
    watch: {
        // firstName: function(val) {
        //     console.log("第一次没有执行")
        //     this.fullName = val + '' + this.lastName
        // },
        // firstName: {
        //     handler(val) {
        //         console.log('第一次执行了')
        //         this.fullName = val + '' + this.lastName
        //     },
        //     immediate: true
        // }
        firstName: {
            handler(val) {
                console.log('第一次执行了')
            },
            deep
        }
    }
}
</script>
<style scoped>

</style>>