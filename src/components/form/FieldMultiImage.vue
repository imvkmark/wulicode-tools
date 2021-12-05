<template>
    <ElImageViewer :url-list="fileList" v-if="trans.preview" @close="trans.preview=false"/>
    <div class="form-image-list">
        <ElUpload action="#" name="file" :http-request="onUpload" list-type="picture-card" class="form-image" multiple :limit="get(attr, 'limit', 0)"
            :show-file-list="false">
            <ElIcon>
                <Plus/>
            </ElIcon>
        </ElUpload>
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
                        <span class="el-upload-list__item-delete" @click="onRemove(file)">
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
import { computed, defineComponent, defineProps, onMounted, reactive, watch } from 'vue';
import { apiPySystemUploadImage } from '@/services/poppy';
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons';
import { toast } from '@/utils/utils';
import { each, first, get, map, union } from 'lodash-es';

defineComponent({
    Delete, ZoomIn, Download, Plus
})

const props = defineProps({
    name: String,
    attr: Object,
    value: {
        type: Array,
        default: () => {
            return []
        }
    }
})
const trans = reactive({
    disabled: false,
    files: <any>[],
    preview: false
})


const onUpload = ({ file }) => {
    apiPySystemUploadImage(file).then((resp) => {
        const { data } = resp;
        toast(resp)
        if (data) {
            trans.files = union([{
                url: String(first(get(data, 'url', []))).toString()
            }], trans.files)
        }
    })
}

const onPreview = () => {
    trans.preview = true;
}

const onRemove = (file: object) => {
    let url = get(file, 'url');
    let newFiles = <any>[];
    each(trans.files, function (file) {
        if (get(file, 'url') === url) {
            return;
        }
        newFiles.push(file);
    })
    trans.files = newFiles;

}
const fileList = computed(() => {
    return map(trans.files, function (file) {
        return get(file, 'url')
    })
})


const emit = defineEmits([
    'change'
])


watch(() => trans.files, () => {
    let urls = [];
    if (trans.files.length > 0) {
        urls = map(trans.files, (item) => {
            return get(item, 'url')
        })
    }
    emit('change', {
        name: props.name,
        value: urls
    })
})

onMounted(() => {
    console.log(props.attr);
    if (props.value.length) {
        trans.files = map(props.value, (url) => {
            return {
                name: '',
                url
            }
        })
    }
})
</script>