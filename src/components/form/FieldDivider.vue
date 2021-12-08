<template>
    <div class="form-divider">
        <span>{{ label }}</span>
    </div>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps({
    label: String
})
</script>