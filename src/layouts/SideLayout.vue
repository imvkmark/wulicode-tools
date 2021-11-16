<template>
    <div class="px--side">
        <Nav/>
    </div>
    <div class="px--top">

    </div>
    <div class="px--content content-with-menu">
        <router-view/>
    </div>

</template>

<script lang="ts" setup>
import useAuth from '@/composables/useAuth';
import useClearCache from '@/composables/useClearCache';
import useInit from '@/composables/useInit';
import useTkd from '@/composables/useTkd';
import Nav from '@/components/base/Nav.vue';

useClearCache()
useInit();
useAuth();
useTkd();
</script>