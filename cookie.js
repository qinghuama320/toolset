const cookie = {
    set(key, val, option) {
        // 设置cookie方法
        if (!key || !val || typeof key !== 'string') {
            return;
        }

        option = option || {};
        let cookieStr = `${key}=${escape(JSON.stringify(val))}`; // val可以是对象

        if (typeof option.expires === 'number') {
            let date = new Date(); // 获取当前时间
            let expiresDays = option.expires; // 将date设置为n天以后的时间
            date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000); // 格式化为cookie识别的时间

            cookieStr += `; expires=${date.toGMTString()}`;
        }

        if (typeof option.domain === 'string') {
            cookieStr += `; domain=${option.domain}`;
        }

        if (typeof option.path === 'string') {
            cookieStr += `; path=${option.path}`;
        }

        document.cookie = cookieStr; // 设置cookie
    },

    get(key) {
        // 获取cookie方法
        /* 获取cookie参数 */
        let cookieStr = document.cookie;
        let start = cookieStr.indexOf(key + '=');

        if (start >= 0) {
            start += key.length + 1; // 1是=号
            let end = cookieStr.indexOf(';', start);
            if (end === -1) {
                end = document.cookie.length;
            }

            let valStr = unescape(document.cookie.substring(start, end));
            let val;
            try {
                val = JSON.parse(valStr);
            } catch (error) {
                val = '';
            }

            return val;
        }

        return '';
    },

    remove(key, option) {
        // 删除cookie，其实就是设置一个过期的时间
        option = option || {};

        let date = new Date(); // 获取当前时间
        date.setTime(date.getTime() - 10000); // 将date设置为过去的时间
        let cookieStr = `${key}=v; expires=${date.toGMTString()}`;

        if (typeof option.domain === 'string') {
            cookieStr += `; domain=${option.domain}`;
        }

        if (typeof option.path === 'string') {
            cookieStr += `; path=${option.path}`;
        }

        document.cookie = cookieStr; // 设置cookie
    },
};

export default cookie;
