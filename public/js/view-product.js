function promptMe(){
    var price = parseInt(prompt("Hãy nhập giá cao nhất mà bạn có thể trả (Hệ thống sẽ tự động đấu giá giúp bạn:"));
    if(isNaN(price)){
        alert("Vui lòng chỉ nhập chữ số. Xin hãy thực hiện lại thao tác.");
        return;
    }
    var currentPrice = document.getElementById('currentprice').value;
    if(price < currentPrice){
        alert("Vui lòng nhập cao hơn giá hiện tại. Xin hãy thực hiện lại thao tác.");
        return;
    }
    document.getElementById('currentprice').value = price;
}