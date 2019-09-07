$(function () {

    getList();

    function getList(e) {
        $.ajax({
            url: "http://localhost:8080/shopping/shopadmin/getshoplist",
            type: "get",
            dataType: "json",
            success: function (data) {
                console.info(data);
                if (data.success) {
                    console.info(data);
                    handleList(data.shopList);
                    handleUser(data.user);
                }
            }
        });
    }

    function handleUser(data) {
        $("#user-name").text(data.name);
    }

    function handleList(data) {
        var html = "";

        data.map(function (value, index) {
            var number = index + 1;
            html += '<tr>'
                + '<th >' + number + '</th>'
                + '<td class="align-middle"><div><a href="#" class="weight-700">' + value.shopName + '</a></div></td>'
                + '<td class="align-middle"><div class="weight-400">' + shopStatus(value.enableStatus) + '</div></td>'
                + '<td class="data-label Actions" class="text-md-center dropdown dropleft"">' + goShop(value.enableStatus, value.shopId) + '</td>'
                + '</tr>';
        });

        $('.shop-table-body').html(html);

    }

    function shopStatus(status) {
        if (status === 0) {
            return '审核中';
        } else if (status === -1) {
            return '商铺非法';
        } else {
            return '审核通过';
        }
    }

    function goShop(status, id) {
        if (status === 1) {
            return '<a href="shopoperation.html?shopId=' + id + '" class="btn btn-primary btn-sm shop-edit-btn">商铺编辑</a>&nbsp;&nbsp;' +
                '<a href="#" class="btn btn-primary btn-sm" id="actionDropdown" data-toggle="dropdown" aria-expanded="false">商品管理' +
                '<span class="material-icons align-middle" style="font-size: 15px;">arrow_drop_down</span></a>' +
                '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="actionDropdown" x-placement="left-start" style="position: absolute; transform: translate3d(24px, 13px, 0px); top: 0px; left: 0px; will-change: transform;">' +
                '    <a class="dropdown-item" href="productlist.html?shopId=' + id + '" > 商品管理 </a>' +
                '    <a class="dropdown-item" href="#">商品类别管理</a>' +
                '</div>';
        } else {
            return "";
        }
    }
});