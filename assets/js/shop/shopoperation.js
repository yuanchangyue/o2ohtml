var shopId = getQueryString("shopId");
var shopInfoUrl = 'http://localhost:8080/shopping/shopadmin/getshopbyid?shopId=';
var initUrl = 'http://localhost:8080/shopping/shopadmin/getshopinitinfo';
var registerShopUrl = 'http://localhost:8080/shopping/shopadmin/registershop';
var upidateShopUrl = "http://localhost:8080/shopping/shopadmin/modifyshop";
var saveCurrentShop = 'http://localhost:8080/shopping/shopadmin/getshopmanagementinfo';
var shopoperationurl = "";

/**
 * 判断当前是注册还是编辑
 * @param shopId
 */
function judgeOperation(shopId) {
    if (shopId) {
        $("#page-title").text("o2o商铺管理后台 - 商铺编辑");
        $(".form-title").text("商铺编辑");
        $(".form-des").text("请修改以下信息,点击保存进行商铺编辑！");
        $(".form-header").text("商铺编辑表单");
        $("#submit").text("保存");
        transferCurrentShop(shopId);
        shopoperationurl = upidateShopUrl;
        showEditShopInfo(shopId);
    } else {
        $("#page-title").text("o2o商铺管理后台 - 商铺注册");
        $(".form-title").text("商铺注册");
        $(".form-des").text("请填写以下信息,点击注册进行商铺注册！");
        $(".form-header").text("商铺注册表单");
        $("#submit").text("注册");
        shopoperationurl = registerShopUrl;
        getInfo();
    }
}

/**
 * 将需要修改的shopId传递到后台
 * @param shopId
 */
function transferCurrentShop(shopId) {
    console.info(shopId);
    $.ajax({
        url: saveCurrentShop,
        type: 'POST',
        data: {
            shopId: shopId
        },
        success: function (data) {
            console.info("传递成功！");
        }
    });
}

/**
 * 显示需要修改的商品信息
 * @param shopId 商品id
 */
function showEditShopInfo(shopId) {
    $.getJSON(shopInfoUrl + shopId, function (data) {
        if (data.success) {
            var shop = data.shop;
            $('#shop-name').val(shop.shopName);
            $('#shop-desc').val(shop.shopDesc);
            $('#shop-phone').val(shop.phone);
            $('#shop-addr').val(shop.shopAddr);

            var shopCategory = '<option selected="selected" data-id='
                + shop.shopCategory.shopCategoryId + '>'
                + shop.shopCategory.shopCategoryName + '</option>';

            var tampAreaHtml = '';

            data.areaList.map(function (value, index) {
                tampAreaHtml += '<option data-id="' + value.areaId + '">' +
                    value.areaName + '</option>';
            });

            $('#shop-category').html(shopCategory);
            $('#shop-category').attr('disabled', 'disabled');
            $('#area').html(tampAreaHtml);
            $("#area option[data-id='" + shop.area.areaId + "']").attr('selected', 'selected');
            $("#submit").attr("data-id", shopId);
        }
    });
}

//获得后台传来的JSON数据
function getInfo() {
    $.getJSON(initUrl, function (data) {
        if (data.success) {
            var tempHtml = '';
            var tempAreaHtml = '';
            data.shopCategoryList.map(function (value, index) {
                tempHtml += '<option id=' + value.shopCategoryId + '>'
                    + value.shopCategoryName + '</option>';
            });

            data.areaList.map(function (value, index) {
                tempAreaHtml += '<option id=' + value.areaId + '>'
                    + value.areaName + '</option>';
            });

            $("#shop-category").html(tempHtml);
            $('#area').html(tempAreaHtml);
        }
    });
}

//提交表单数据
$('#submit').click(function () {

    var shop = {};
    shop.shopId = shopId;
    shop.shopName = $('#shop-name').val();
    shop.shopDesc = $('#shop-desc').val();
    shop.phone = $('#shop-phone').val();
    shop.shopAddr = $('#shop-addr').val();

    shop.shopCategory = {
        shopCategoryId: shopId ? $('#shop-category option:checked').attr('id') : $('#shop-category option:checked').data('id')
    };

    shop.area = {
        areaId: shopId ? $('#area option:checked').attr('id') : $('#shop-category option:checked').data('id')
    };

    var shopImg = $('#shop-img')[0].files[0];

    var formData = new FormData();
    formData.append("shopImg", shopImg);
    formData.append("shopStr", JSON.stringify(shop));
    var verifyCodeActual = $('#j_captcha').val();
    if (!verifyCodeActual) {
        alert("请输入验证码！");
        return;
    }

    formData.append("verifyCodeActual", verifyCodeActual);

    $.ajax({
        url: shopoperationurl,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        cache: false,
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            if (data.success) {
                alert('提交成功');
                window.location.href = "shoplist.html";
            } else {
                alert("提交失败" + data.errMsg);
                $('#captcha_img').click();
            }
        }
    })
});

judgeOperation(shopId);


