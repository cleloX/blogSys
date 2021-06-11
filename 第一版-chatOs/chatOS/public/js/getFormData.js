function serializeToJson(form) {  //将serializeArray(); 得到的数组 转化为json对象形式
    var result = {};
    // [{name: 'email', value: '用户输入的内容'}]
    var f =  form.serializeArray();  
    f.forEach(function (item) {
        // result.email
        result[item.name] = item.value;
    });
    return result;
}