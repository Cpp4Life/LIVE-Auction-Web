var images = [];

function image_select() {
    var image = document.getElementById('image').files;
    for (i = 0; i < image.length; i++) {
        if (check_duplicate(image[i].name)) {
            images.push({
                "name" : image[i].name,
                "url" : URL.createObjectURL(image[i]),
                "file" : image[i],
            })
        } else
        {
            alert(image[i].name + " is already added to the list");
        }
    }

    document.getElementById('form').reset();
    document.getElementById('container').innerHTML = image_show();
}

function image_show() {
    var image = "";
    images.forEach((i) => {
        image += `<div class="image_container d-flex justify-content-center position-relative">
   	  	  	  	  <img src="`+ i.url +`" alt="Image">
   	  	  	  	  <span class="position-absolute" onclick="delete_image(`+ images.indexOf(i) +`)">&times;</span>
   	  	  	  </div>`;
    })
    return image;
}
function delete_image(e) {
    images.splice(e, 1);
    document.getElementById('container').innerHTML = image_show();
}
function check_duplicate(name) {
    var image = true;
    if (images.length > 0) {
        for (e = 0; e < images.length; e++) {
            if (images[e].name == name) {
                image = false;
                break;
            }
        }
    }
    return image;
}

function get_image_data() {
    var form = new FormData()
    for (let index = 0; index < images.length; index++) {
        form.append("file[" + index + "]", images[index]['file']);
    }
    return form;
}
// function getSelectInput(s1, s2){
//     var s1 = document.getElementById(s1);
//     var s2 = document.getElementById(s2);
//     for(var i = 0 ; i < BrandCollection.length; i++){
//         if(BrandCollection[i].brand == d){
//             var option = BrandCollection[i].subBrand.list;
//             var newOption = document.createElement("option");
//
//         }
//     }
// }
// var s1 = document.getElementById('inputState');
// var s2 = document.getElementById('inputState2');
// s1.addEventListener('change', function (){
   // var selected_option = BrandCollection[this.value];
   // while(s2.options.length >0){
   //     s2.options.remove(0);
   // }
   // Array.from(selected_option).forEach(function (el){
   //     let option = new Option(el, el);
   //     s2.appendChild(option);
   // })

// });