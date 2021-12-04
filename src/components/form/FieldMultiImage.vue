<template>
    <ElUpload :action="`${appUrl}/api_v1/system/upload/image`" name="file" :http-request="onUpload" list-type="picture-card"
        :show-file-list="false">
        <ElImage fit="scale-down" :src="val" v-if="val" :alt="val"/>
        <template #default>
            <ElIcon>
                <Plus/>
            </ElIcon>
        </template>
        <template #file="{ file }">
            <div>
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt=""/>
                <span class="el-upload-list__item-actions">
                    <span
                        class="el-upload-list__item-preview"
                        @click="onPictureCardPreview(file)"
                    >
                        <ElIcon>
                            <zoom-in/>
                        </ElIcon>
                    </span>
                    <span
                        v-if="!trans.disabled"
                        class="el-upload-list__item-delete"
                        @click="onDownload(file)"
                    >
                        <ElIcon>
                            <download/>
                        </ElIcon>
                    </span>
                    <span
                        v-if="!trans.disabled"
                        class="el-upload-list__item-delete"
                        @click="onRemove(file)"
                    >
                        <ElIcon>
                            <Delete/>
                        </ElIcon>
                    </span>
                </span>
            </div>
        </template>
    </ElUpload>
</template>
<script lang="ts" setup>
import { defineComponent, defineProps, onMounted, reactive, ref, watch } from 'vue';
import { appUrl } from '@/utils/conf';
import { apiPySystemUploadImage } from '@/services/poppy';
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons';
import { toast } from '@/utils/utils';

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
        if (data) {

        }
        console.log(message);
    })
}

const trans = reactive({
    dialogImageUrl: '',
    dialogVisible: false,
    disabled: false
})

const onRemove = (file) => {
    console.log(file)
}
const onPictureCardPreview = (file) => {
    trans.dialogImageUrl = file.url
    trans.dialogVisible = true
}
const onDownload = (file) => {
    console.log(file)
}

const emit = defineEmits([
    'change'
])

const val = ref('');

watch(() => val.value, (newVal) => {
    emit('change', {
        name: props.name,
        value: newVal
    })
})

onMounted(() => {
    val.value = props.value;
})
</script>