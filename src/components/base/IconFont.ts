import {createFromIconfontCN} from '@ant-design/icons-vue'

/**
 * 封装 IconFont Url
 * https://2x.antdv.com/components/icon-cn/#components-icon-demo-iconfont
 */

let iconUrl = import.meta.env.VITE_ICON_URL;
const IconFont = createFromIconfontCN({
    scriptUrl: String(iconUrl),
});
export default IconFont;

