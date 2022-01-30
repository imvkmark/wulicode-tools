<template>
    <template v-for="item in value" :key="item">
        <template v-if="get(item, 'type') === 'request'">
            <ElPopconfirm title="确认要进行此操作?" v-if="get(item, 'confirm')" @confirm="doRequest(item)">
                <template #reference>
                    <ElButton type="danger">{{ get(item, 'title', '') }}</ElButton>
                </template>
            </ElPopconfirm>
            <ElButton v-else @click="doRequest(item)">
                {{ get(item, 'title', '') }}
            </ElButton>
        </template>
        <template v-if="get(item, 'type') === 'page'">
            <ElButton @click="doRequest(item)">
                {{ get(item, 'title', '') }}
            </ElButton>
        </template>
    </template>
</template>
<script lang="ts" setup>
import { get } from "lodash-es";
import { store } from "@/store";

const props = defineProps({
    value: {
        type: Array,
        default: () => {
            return []
        }
    }
})

const doRequest = (item: any) => {
    if (get(item, 'type') === 'request') {
        store.dispatch('grid/SetRequest', item);
    }
    if (get(item, 'type') === 'page') {
        store.dispatch('grid/SetPage', item);
    }
}


</script>
<style lang="less">
</style>
