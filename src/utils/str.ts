export const sprintf = (...args: string[]) => {
    let replace = Array.prototype.slice.call(args, 1);
    let format = args[0];
    return format.replace(/{(\d+)}/g, function (match: string, number: number) {
        return typeof replace[number] != 'undefined'
            ? replace[number]
            : match
            ;
    });
}