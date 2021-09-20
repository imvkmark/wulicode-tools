import { onMounted } from 'vue'
import { useStore } from '@/store';

/**
 * 初始化
 */
export default function useInit() {
    const store = useStore();

    onMounted(() => {
        store.dispatch('poppy/Init').then()
    })
}