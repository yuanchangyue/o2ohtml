$(function () {

        var initUrl = 'http://localhost:8080/shopping/shopadmin/getshopinitinfo';
        var registerShopUrl = 'http://localhost:8080/shopping/shopadmin/registershop';

        getInfo();

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

            shop.shopName = $('#shop-name').val();
            shop.shopDesc = $('#shop-desc').val();
            shop.phone = $('#shop-phone').val();
            shop.shopAddr = $('#shop-addr').val();
            shop.shopCategory = {
                shopCategoryId: $('#shop-category option:checked').attr('id')
            };

            shop.area = {
                areaId: $('#area option:checked').attr('id')
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
                url: registerShopUrl,
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                cache: false,
                success: function (data) {
                    if (data.success) {
                        alert('商铺提交成功');
                        window.location.href = "/shopping/shopadmin/shoplist";
                    } else {
                        alert("提交失败" + data.errMsg);
                    }
                    $('#captcha_img').click();
                }
            })
        });

    }
);