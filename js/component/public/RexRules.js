
//用户名
export const checkUname=(rule,value,callback) =>{
    if(!(/[a-zA-Z0-9_@-]$/.test(value))){
        callback('只能输入英文字母,数字,合法字符')
    }else{
        callback();
    }
};
//密码 暂时无用
export const password=/[A-Z]|[a-z]|[0-9]|[`~!@#$%^&*()+=]$/;
//手机号码
export const checkPhone =(rule, value, callback) =>{
    if(!(/^(\d{7,8})(-(\d{3,}))?|(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}|1(3|4|5|7|8)\d{9}$/.test(value))){
        callback("手机或电话号码有误，请重填");
    }else{
        callback();
    }
}

//只能输入中文和英文
export const checkInput=(rule,value,callback) =>{
    if(!(/^[a-zA-Z\u4e00-\u9fa5]+$/).test(value)){
        callback("只能输入中文或英文");
    }else{
        callback();
    }
}

//只能输入中文
export const checkChinese=(rule,value,callback) =>{
    if(!(/^[\u2E80-\u9FFF]+$/).test(value)){
        callback("只能输入中文");
    }else{
        callback();
    }
}

//只能输入英文
export const checkEnglish=(rule,value,callback) =>{
    if(!(/^[A-Za-z]+$/).test(value)){
        callback("只能输入字母");
    }else{
        callback();
    }
}

//只能输入大写字母
export const checkUppercase=(rule,value,callback) =>{
    if(!(/^[A-Z]+$/).test(value)){
        callback("只能输入大写字母");
    }else{
        callback();
    }
}
//只能输入小写字母
export const checkLetter=(rule,value,callback) =>{
    if(!(/^[a-z]+$/).test(value)){
        callback("只能输入小写字母");
    }else{
        callback();
    }
}

//只能输入数字
export const checkNumber=(rule,value,callback) =>{
    if(!(/^\d+$/).test(value)){
        callback("只能输入数字");
    }else{
        callback();
    }
}


