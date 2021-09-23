<template>
    <div id="side">

    </div>
    <div id="top">

    </div>
    <div id="content">
        <router-view/>
    </div>

</template>

<script lang="ts" setup>
import useAuth from '@/composables/useAuth';
import useClearCache from '@/composables/useClearCache';
import 'element-plus/dist/index.css'
import useInit from '@/composables/useInit';

useInit();
useClearCache()
useAuth();
</script>
<style scoped lang="less">
#side {
    display: flex;
    align-items: center;
    background-color: #081736;
    flex-direction: column;
    grid-area: sidebar;
    height: 100vh;
    padding-top: 0;
    padding-bottom: 0;
    width: 5em;
    overflow-y: auto;
}

#top {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: end;
    justify-content: flex-end;
    background-color: #FFF;
    border-top-left-radius: 8px;
    height: 4rem;
    padding-right: 1.25rem;
    width: 100%;
    border-color: #CCC;
    grid-area: topbar;
    border-bottom: 1px solid #E1EDFF;
}

#content {
    height: calc(100vh - 4rem);
    grid-area: content;
    display: flex;
}

</style>