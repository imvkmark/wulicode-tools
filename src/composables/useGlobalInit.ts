import { onMounted, onUnmounted, watch } from 'vue'
import { useStore } from '@/store';
import { useRouter } from "vue-router";
import { each, get, keys, split } from "lodash-es";
import { emitter, REQUEST_EXCEPTION, REQUEST_LOADED, REQUEST_LOADING } from "../../pkg/core/bus/mitt";
import { appLocalStore } from "@/utils/util";
import { ElMessageBox } from "element-plus";
import { pyStorageDeviceIdKey } from "../../pkg/core/utils/conf";

/**
 * 初始化
 */
export default function useGlobalInit() {
    const store = useStore();


    /* 使用 clear 参数来清除缓存数据
     *---------------------------------------------------*/
    const router = useRouter();
    const clear = get(router.currentRoute.value, 'query.clear', '');

    // clear 清除缓存信息 [:app-{xxx}/:x-core]
    if (clear) {
        let lsKeys = keys(localStorage);
        each(lsKeys, function (key) {
            // 设备ID | Token 不清除
            if (key.indexOf(pyStorageDeviceIdKey()) >= 0 || key.indexOf(pyStorageDeviceIdKey()) >= 0) {
                return;
            }
            let ks = split(key, ':')
            // 清除缓存
            appLocalStore(ks[1], null);
        });
    }

    /* 设置 TKD
     * ---------------------------------------- */
    let title = get(router.currentRoute.value, 'meta.title');

    const setTkd = () => {
        let siteTitle = get(store.state.poppy.core, 'py-system.title');
        if (siteTitle) {
            if (title) {
                document.title = `${title} - ${siteTitle}`;
            } else {
                document.title = siteTitle;
            }
        }
    }
    watch(() => store.state.poppy.core, () => {
        setTkd()
    }, { deep: true })
    onMounted(setTkd)

    /* 监听 Emitter 简单事件
     * ---------------------------------------- */
    emitter.on(REQUEST_LOADING, (options) => {
        store.dispatch('poppy/Loading', options).then()
    })
    emitter.on(REQUEST_LOADED, (options) => {
        store.dispatch('poppy/Loaded', options).then()
    })
    emitter.on(REQUEST_EXCEPTION, (exception) => {
        const message = `${get(exception, 'message', '')}`;
        // 错误异常
        ElMessageBox.alert(message, `错误 ${get(exception, 'status')}`, {
            type: 'error'
        }).then()
    })


    onUnmounted(() => {
        emitter.off(REQUEST_LOADING)
        emitter.off(REQUEST_LOADED)
        emitter.off(REQUEST_EXCEPTION)
    })

    /* 项目初始化
     * ---------------------------------------- */
    onMounted(() => {
        store.dispatch('poppy/Init').then()
    })
}
