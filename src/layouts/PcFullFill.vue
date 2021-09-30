<template>
    <div class="px--side">
        <side/>
    </div>
    <div class="px--content content-full-fill">
        <router-view/>
    </div>
</template>

<script lang="ts" setup>
import useAuth from '@/composables/useAuth';
import useClearCache from '@/composables/useClearCache';
import 'element-plus/dist/index.css'
import useInit from '@/composables/useInit';
import Side from '@/components/base/Side.vue';

useClearCache()
useInit();
useAuth();
</script>