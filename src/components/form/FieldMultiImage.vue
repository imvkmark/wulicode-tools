<template>
    <ElImageViewer :url-list="trans.fileList" :initial-index="trans.index" v-if="trans.preview" @close="trans.preview=false"/>
    <div class="form-image-list">
        <ElUpload action="#" name="file" :http-request="onUpload" list-type="picture-card" class="form-image" multiple
            :limit="get(attr, 'limit', 0)"
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
                        <span class="el-upload-list__item-preview" @click="onPreview(file)">
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
import { defineComponent, defineProps, onMounted, shallowReactive, watch } from 'vue';
import { apiPySystemUploadImage } from '@/services/poppy';
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons';
import { toast } from '@/utils/utils';
import { each, first, get, indexOf, map, union } from 'lodash-es';

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
const trans = shallowReactive({
    disabled: false,
    files: <any>[],
    fileList: <any>[],
    preview: false,
    index: 0
})


const onUpload = ({ file }) => {
    apiPySystemUploadImage(file).then((resp) => {
        const { data } = resp;
        toast(resp);
        if (data) {
            let url  = first(get(data, 'url', []));
            if(url) {
                trans.files = union([{
                    url: String(url).toString()
                }], trans.files)
            }
        }
    })
}

const onPreview = (file) => {
    let url = get(file, 'url');
    trans.fileList = map(trans.files, function (file) {
        return get(file, 'url')
    })
    trans.index = indexOf(trans.fileList, url);
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
<style scoped lang="less">
.image {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    img {
        flex: 0;
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
    }
}
</style>