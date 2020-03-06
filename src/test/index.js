const ele = document.querySelector('h1');
ele.onclick = function() {
    console.log('文字是：' + this.innerText);
};