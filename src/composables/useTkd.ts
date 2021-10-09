import { useStore } from '@/store';
import { get } from 'lodash-es';
import { useRouter } from 'vue-router';
import { onMounted, watch } from 'vue';

/**
 * 标题的监听和展示
 */
export default function useTkd() {
    const store = useStore();
    const router = useRouter();
    let title = get(router.currentRoute.value, 'meta.title');

    const setTkd = () => {
        let siteTitle = get(store.getters.core, 'py-system.title');
        if (siteTitle) {
            if (title) {
                document.title = `${title} - ${siteTitle}`;
            } else {
                document.title = siteTitle;
            }
        }
    }
    watch(() => store.getters.core, setTkd, { deep: true })
    onMounted(setTkd)
}