<template>
    <ElUpload :action="appUrl" name="file" :http-request="onUpload" list-type="picture-card" class="form-image"
        :file-list="trans.files" v-if="trans.files.length<=0"
        :show-file-list="false">
        <ElIcon>
            <Plus/>
        </ElIcon>
    </ElUpload>
    <ElImageViewer :url-list="fileList" v-if="trans.preview" @close="onClosePreview"/>
    <div class="form-image-list">
        <ul class="el-upload-list el-upload-list--picture-card is-disabled">
            <li class="el-upload-list__item is-success" v-for="file in trans.files" :key="file">
                <div class="image">
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt=""/>
                    <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="onPreview()">
                            <ElIcon>
                                <ZoomIn/>
                            </ElIcon>
                        </span>
                        <span class="el-upload-list__item-delete" @click="onRemove()">
                            <ElIcon>
                                <Delete/>
                            </ElIcon>
                        </span>
                    </span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script lang="ts" setup>
import { computed, defineComponent, defineProps, onMounted, reactive, ref, watch } from 'vue';
import { appUrl } from '@/utils/conf';
import { apiPySystemUploadImage } from '@/services/poppy';
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons';
import { toast } from '@/utils/utils';
import { first, get, map } from 'lodash-es';

defineComponent({
    Delete, ZoomIn, Download, Plus
})

const props = defineProps({
    name: String,
    attr: Object,
    value: {
        type: String,
        default: () => {
            return ''
        }
    }
})

const onUpload = ({ file }) => {
    apiPySystemUploadImage(file).then((resp) => {
        const { data } = resp;
        toast(resp)
        if (get(data, 'url', []).length) {
            trans.files = [{
                url: String(first(get(data, 'url', []))).toString()
            }]
        }
    })
}

const trans = reactive({
    preview: false,
    files: <any>[],
})

const fileList = computed(() => {
    return map(trans.files, function (file) {
        return get(file, 'url')
    })
})


const onRemove = () => {
    trans.files = [];
}
const onPreview = () => {
    trans.preview = true;
}
const onClosePreview = () => {
    trans.preview = false;
}

const emit = defineEmits([
    'change'
])

watch(() => trans.files, () => {
    let url = '';
    if (trans.files.length > 0) {
        url = get(first(trans.files), 'url');
    }
    emit('change', {
        name: props.name,
        value: url
    })
})

onMounted(() => {
    if (props.value) {
        trans.files = [{ url: props.value, name: '' }]
    }
})
</script>
<style scoped lang="less">
.image {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    justify-items: center;
    height: 60px;
}
</style>