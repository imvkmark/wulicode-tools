<template>
    <div class="px--side">
        <side/>
    </div>
    <div class="px--top">

    </div>
    <div class="px--content">
        <router-view/>
    </div>

</template>

<script lang="ts" setup>
import useAuth from '@/composables/useAuth';
import useClearCache from '@/composables/useClearCache';
import useInit from '@/composables/useInit';
import Side from '@/components/base/Side.vue';
import useTkd from '@/composables/useTkd';

useClearCache()
useInit();
useAuth();
useTkd();
</script>