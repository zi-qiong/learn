<template>
    <el-container class="#app">
        <el-aside width="200px">
            <el-menu
                default-active="0-0"
                class="el-menu-vertical-demo"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
            >
                <template v-for="(item, index) in menu">
                    <el-submenu :index="'' + index" :key="index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span>{{ item.name }}</span>
                        </template>

                        <el-menu-item
                            v-for="(child, idx) in item.children"
                            :key="index + '-' + idx"
                            :index="index + '-' + idx"
							@click="handleMenu"
                            >{{ child.name }}</el-menu-item
                        >
                    </el-submenu>
                </template>
                <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">导航二</span>
                </el-menu-item>
                <el-menu-item index="3" @click="$router.push('/watch')">
                    <i class="el-icon-document"></i>
                    <span slot="title">watch</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <i class="el-icon-setting"></i>
                    <span slot="title">导航四</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header>
                <!-- <el-page-header @back="goBack" content="详情页面">
                </el-page-header> -->
            </el-header>
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
    data() {
        return {
            menu: [
                {
                    icon: "el-icon-phone-outline",
                    name: "组件通信",
                    children: [
                        {
                            name: "props/$emit",
                        },
                        {
                            name: "$children/$parent",
                        },
                        {
                            name: "provide/inject",
                        },
                        {
                            name: "ref/refs",
                        },
                        {
                            name: "eventBus",
                        },
                        {
                            name: "Vuex",
                        },
                        {
                            name: "Storage",
                        },
                        {
                            name: "$attrs/$listeners",
                        },
                    ],
                },
            ],
        };
    },
    methods: {
		handleMenu() {
			
		}
	},
};
</script>
<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
.el-header {
    padding: 24px;
}
</style>
