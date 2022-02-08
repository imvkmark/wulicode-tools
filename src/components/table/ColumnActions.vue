<template>
    <!--  分组  -->
    <template v-if="get(value, 'style') === 'group'">
        <ElButtonGroup>
            <template v-for="item in get(value, 'items')" :key="item">
                <ElPopconfirm title="确认要进行此操作?" v-if="get(item, 'confirm')" @confirm="doRequest(item)">
                    <template #reference>
                        <ElButton :plain="get(item, 'plain', false)"
                            :type="get(item, 'type', 'default')"
                            :size="get(item, 'size', 'default')"
                            :circle="get(item, 'circle', false)"
                            :icon="get(item, 'icon', '') ? get(icon, upperCamelCase(get(item, 'icon'))) : null"
                            :disabled="get(item, 'disabled', false)">
                            <template #default v-if="!get(item, 'only', false)">
                                {{ get(item, 'title', '') }}
                            </template>
                        </ElButton>
                    </template>
                </ElPopconfirm>
                <ElButton v-else @click="doRequest(item)" :plain="get(item, 'plain', false)"
                    :type="get(item, 'type', 'default')"
                    :size="get(item, 'size', 'default')"
                    :circle="get(item, 'circle', false)"
                    :icon="get(item, 'icon', '') ? get(icon, upperCamelCase(get(item, 'icon'))) : null"
                    :disabled="get(item, 'disabled', false)">
                    <template #default v-if="!get(item, 'only', false)">
                        {{ get(item, 'title', '') }}
                    </template>
                </ElButton>
            </template>
        </ElButtonGroup>
    </template>
    <!--  下拉  -->
    <template v-else-if="get(value, 'style') === 'dropdown'">
        <template v-for="(item, key) in get(value, 'items')" :key="item">
            <template v-if="key < get(value, 'length', 5)">
                <ElPopconfirm title="确认要进行此操作?" v-if="get(item, 'confirm')" @confirm="doRequest(item)">
                    <template #reference>
                        <ElButton :plain="get(item, 'plain', false)"
                            :type="get(item, 'type', 'default')"
                            :size="get(item, 'size', 'default')"
                            :circle="get(item, 'circle', false)"
                            :icon="get(item, 'icon', '') ? get(icon, upperCamelCase(get(item, 'icon'))) : null"
                            :disabled="get(item, 'disabled', false)">
                            <template #default v-if="!get(item, 'only', false)">
                                {{ get(item, 'title', '') }}
                            </template>
                        </ElButton>
                    </template>
                </ElPopconfirm>
                <ElButton v-else @click="doRequest(item)"
                    :plain="get(item, 'plain', false)"
                    :type="get(item, 'type', 'default')"
                    :size="get(item, 'size', 'default')"
                    :circle="get(item, 'circle', false)"
                    :icon="get(item, 'icon', '') ? get(icon, upperCamelCase(get(item, 'icon'))) : null"
                    :disabled="get(item, 'disabled', false)">
                    <template #default v-if="!get(item, 'only', false)">
                        {{ get(item, 'title', '') }}
                    </template>
                </ElButton>
            </template>
        </template>
        <template v-if=" get(value, 'items').length >= get(value, 'length', 5)">
            <ElDropdown split-button type="default" trigger="click" :hide-on-click="false">
                更多
                <template #dropdown>
                    <ElDropdownMenu>
                        <template v-for="(item, key) in get(value, 'items')" :key="item">
                            <template v-if="key >= get(value, 'length', 5)">
                                <ElDropdownItem v-if="get(item, 'confirm')">
                                    <ElPopconfirm title="确认要进行此操作?"
                                        @confirm="doRequest(item)">
                                        {{ get(item, 'icon', '') ? get(icon, upperCamelCase(get(item, 'icon'))) : '' }}
                                        <template v-if="!get(item, 'only', false)" #reference>
                                            {{ get(item, 'title', '') }}
                                        </template>
                                    </ElPopconfirm>
                                </ElDropdownItem>
                                <ElDropdownItem v-else @click="doRequest(item)">
                                    {{ get(item, 'icon', '') ? get(icon, upperCamelCase(get(item, 'icon'))) : '' }}
                                    <template v-if="!get(item, 'only', false)">
                                        {{ get(item, 'title', '') }}
                                    </template>
                                </ElDropdownItem>
                            </template>
                        </template>
                    </ElDropdownMenu>
                </template>
            </ElDropdown>
        </template>
    </template>
    <template v-else>
        <template v-for="item in get(value, 'items')" :key="item">
            <ElPopconfirm title="确认要进行此操作?" v-if="get(item, 'confirm')" @confirm="doRequest(item)">
                <template #reference>
                    <ElButton :plain="get(item, 'plain', false)"
                        :type="get(item, 'type', 'default')"
                        :size="get(item, 'size', 'default')"
                        :circle="get(item, 'circle', false)"
                        :icon="get(item, 'icon', '') ? get(icon, upperCamelCase(get(item, 'icon'))) : null"
                        :disabled="get(item, 'disabled', false)">
                        <template #default v-if="!get(item, 'only', false)">
                            {{ get(item, 'title', '') }}
                        </template>
                    </ElButton>
                </template>
            </ElPopconfirm>
            <ElButton v-else @click="doRequest(item)" :plain="get(item, 'plain', false)"
                :type="get(item, 'type', 'default')"
                :size="get(item, 'size', 'default')"
                :circle="get(item, 'circle', false)"
                :icon="get(item, 'icon', '') ? get(icon, upperCamelCase(get(item, 'icon'))) : null"
                :disabled="get(item, 'disabled', false)">
                <template #default v-if="!get(item, 'only', false)">
                    {{ get(item, 'title', '') }}
                </template>
            </ElButton>
        </template>
    </template>
</template>
<script lang="ts" setup>
import { get } from "lodash-es";
import { store } from "@/store";
import { icon } from "@/utils/icon";
import { upperCamelCase } from "@/utils/utils";

const props = defineProps({
    value: {
        type: Object,
        default: () => {
            return {}
        }
    }
})

const doRequest = (item: any) => {
    if (get(item, 'method') === 'request') {
        store.dispatch('grid/SetRequest', item);
    }
    if (get(item, 'method') === 'page') {
        store.dispatch('grid/SetPage', item);
    }
}


</script>
<style lang="less">
</style>
