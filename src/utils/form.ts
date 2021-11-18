import { get, set } from 'lodash-es';

export const mapModel = (item: any[]) => {
    let model = {};
    item.map(function (item: object) {
        set(model, get(item, 'field.name'), get(item, 'item.label'))
    });
    return model;
}