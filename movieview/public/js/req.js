function onRet(str) {
    var obj = JSON.parse(str);

    if (obj.hasOwnProperty('err')) {
        $('#htmlinfo').val(obj.err);

        return ;
    }

    if (obj.hasOwnProperty('htmlinfo')) {
        $('#htmlinfo').val(obj.htmlinfo);
        
        return ;
    }
}

function login() {
    var name = $("#inputName").val();
    var password = $("#inputPassword").val();

    $.post('/ctrl/login/', {name: name, password: password}, function (data, status) {
        onRet(data);
    });
}

function download2xiaomi(url) {
    window.open("http://d.miwifi.com/d2r/?url=" + Base64.encodeURI(href));
}