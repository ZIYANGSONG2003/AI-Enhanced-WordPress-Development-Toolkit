jQuery(document).ready(function($) {
    
// 遍历购物车页面中的每个数量输入框

console.log('来来！！！ob_start.');
// $('.woocommerce-cart .product-quantity input.qty').each(function() {  //类的选择条件太苛刻了，改成下
$('input[type="number"]').each(function() {

     console.log('钱钱钱钱钱钱ob_start.');

     var $input = $(this); // 当前的数量输入框
    // var $productRow = $input.closest('.cart_item'); // 查找最近的.cart_item祖先元素   错了！
    // var $productRow = $input.closest('.woocommerce-cart-form__cart-item'); // 查找最近的.woocommerce-cart-form__cart-item祖先元素
     
     var $productRow = $input.closest('tr'); // 查找最近的<tr>祖先元素，不知道具体名就用通用名查，避免版本更改
     

     
     if ($productRow.length === 0) {
         console.log('这是一个空的 jQuery 对象');
     } else {
         console.log('找到了元素:', $productRow);
         console.log($productRow.html()); // 输出祖先元素的内部HTML内容
     }
     if ($productRow){  console.log('钱8888$productRow:');
     console.log($productRow);  }

     var imageUrl = $productRow.data('image_url');
     console.log(imageUrl);
     
    /* $productRow.hover(
         function() {
            console.log('悬浮.');
             var $cartItem = $(this);
          //   if (imageUrl) {
                 console.log('找到了图像悬浮.');
                 var $hoverImage = $('<img class="hover-image" src="' + 'https://worthbuy.com.au/wp-content/uploads/2024/07/图片3.png' + '" alt="Hover Image" />');
                $cartItem.append($hoverImage);
              // $input.append($hoverImage);
                 console.log($cartItem.html()); // 打印插入图像后的 HTML 结构
           //  }
         },
         function() {
             // 当鼠标离开购物车项时隐藏图像
             console.log('去悬浮.');
             $(this).find('.hover-image').remove();
         }
     );*/



     // 在当前 <tr> 元素内查找包含 "Grouped Product" 文本的 <span> 元素
     $productRow.find('span').filter(function() {
         return $(this).text().includes('minor_child_of_grouped_product');//minor_child_of_grouped_product 是自己建的<span 标签里的内容
     }).each(function() {
        var $curDom = $(this); // 当前的dom

        $curDom.hover(
            function() {
               console.log('悬浮.');
                var $curItem = $(this);
             //   if (imageUrl) {
                    console.log('找到了图像悬浮.');
                    var $hoverImage = $('<img class="hover-image" src="' + 'https://worthbuy.com.au/wp-content/uploads/2024/07/图片3.png' + '" alt="Hover Image" />');
                   $curItem.append($hoverImage);
                 // $input.append($hoverImage);
                    console.log($cartItem.html()); // 打印插入图像后的 HTML 结构
              //  }
            },
            function() {
                // 当鼠标离开购物车项时隐藏图像
                console.log('去悬浮.');
                $(this).find('.hover-image').remove();
            }
        );
         // 对包含 "Grouped Product" 文本的 <span> 元素进行操作
     // /*  
     //  var $buttons = $input.siblings('button'); // 查找与输入框相邻的所有按钮
      //   $buttons.prop('disabled', true); // 禁用所有相邻按钮
         
         console.log('钱！！！！！！');
       //  $input.val(1); // 设置数量为1
       //  $input.prop('readonly', true); // 将数量输入框设为只读 
         // 按按钮上的文字查找 "Remove item" 按钮并移除
        //  $productRow.find('button:contains("Remove item")').remove();
    //*/
          // 检查设置是否生效
     //console.log('Input value after setting:', $input.val());
     //console.log('Input readonly property after setting:', $input.prop('readonly'));
     });
})

////////////////////////////////////////////////////////////////////////////////////////////////

// 发送 Ajax 请求
$.ajax({
    url: customAjax.ajax_url,
    method: 'POST',
    data: {
        action: 'syb_get_custom_cart_data' // 请求的操作
    },
    success: function(response) {
        if (response.success) {
            var customData = response.data;
            console.log('Custom Data:', customData);

            // 处理固定参数
            console.log('Fixed Param 1:', customData.fixed_param1);
            console.log('Fixed Param 2:', customData.fixed_param2);
            console.log('Fixed Param 3:', customData.fixed_param3);

        } else {
            console.log('Failed to retrieve custom data:', response.data);
        }
    },
    error: function(xhr, status, error) {
        console.error('Ajax request failed:', status, error);
    }
});
/////////////////////////////////////////////////////////////////////
console.log('AJIAX!!');
});    
