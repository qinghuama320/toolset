// 取url参数
function getUrlParams() {
    let query = window.location.search;
    let ret = {};
    if (query) {
        let parts = query.substring(1).split('&');
        parts.forEach(line => {
            let kv = line.split('=');
            ret[kv[0]] = kv[1] || null;
        });
    }
    return ret;
}

// 将数字转换成逗号千分位，并保留至prec精度
function toThousandString(numstr, prec = 2) {
    let num = +numstr;

    if (Number.isNaN(num)) {
        return numstr;
    }

    let str = num.toLocaleString();
    let idx = str.indexOf('.');

    if (idx < 0) {
        str += '.';
    }
    for (let i = 0; i < prec; i++) {
        str += '0';
    }

    return idx < 0 ? str : str.substring(0, idx + prec + 1); // substring函数，第二个参数大于len时，返回整个字符串
}

// 计算密码的强度，密码格式应该是8-20位，并至少包含大写字母、小写字母、数字和其他字符中的三种
// 8-10（含）位，只含3种为低，含4种为中；10-20位，只含3种为中，含4种为高。
function getPwLevel(pw) {
    let getArrSum = function f(str, l) {
        let arr = [0, 0, 0, 0];
        for (let i = 0; i < l; i++) {
            let code = str.charCodeAt(i);
            if (code >= 48 && code <= 57) {
                // 数字
                arr[0] = 1;
            } else if (code >= 65 && code <= 90) {
                // 大写字母
                arr[1] = 1;
            } else if (code >= 97 && code <= 122) {
                // 小写字母
                arr[2] = 1;
            } else {
                // 其他字符
                arr[3] = 1;
            }
        }

        return arr.reduce((i, sum) => sum + i);
    };

    let len = pw.length;
    if (len >= 8 && len <= 10) {
        return getArrSum(pw, len) === 3 ? 1 : 2;
    } else if (len > 10) {
        return getArrSum(pw, len) === 3 ? 2 : 3;
    } else {
        // 小于8个字符的密码，不应该进到这里来
        return 1;
    }
}

// 判断两个数组是否相等，相等判断由用户传入，可以判定任意类型的数组
function arrayEqual(list1, list2, itemEquelFun) {
    if (list1.some(it1 => list2.every(it2 => !itemEquelFun(it1, it2)))) {
        // 若list1中有一个元素与list2中每一个元素都不相等，那么list1 != list2
        return false;
    } else {
        // list2是list1的超集
        return !list2.some(it2 => list1.every(it1 => !itemEquelFun(it2, it1)));
    }
}

// 去除toFixed后保留的末尾的0，是数据看起来更简短
function toShortFixed(num, prec = 0) {
    let numstr = (+num).toFixed(prec);

    if (!prec) {
        return numstr;
    }

    let len = numstr.length;
    let endidx;
    let pointidx = len - prec - 1;
    for (let i = len - 1; i >= pointidx; i -= 1) {
        if (numstr.charAt(i) !== '0') {
            endidx = i === pointidx ? i : i + 1; // 整数需要将小数点去掉
            break;
        }
    }

    return numstr.substring(0, endidx);
}
