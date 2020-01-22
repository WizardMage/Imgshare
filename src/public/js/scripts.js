//AJAX con Jquery
/* $('#btn-like').click(function (e){
    e.preventDefault();
    let imgId = $(this).data('id');

    $.post(`/images/${imgId}/like`)
        .done(data =>  {
            console.log(data);
            $('.likes-count').text(data.likes)
        });
}); */
const btnLike = document.getElementById('btn-like') || '';
const btnDelete = document.getElementById('btn-delete') || '';

$('#post-comment').hide();
$('#btn-toggle-comment').click(e => {
    e.preventDefault();
    $('#post-comment').slideToggle();
});

btnLike.onclick = function (e){
    e.preventDefault();
    let imgId  = this.dataset.id;
  
    let req = new XMLHttpRequest();

    req.open('POST', `/images/${imgId}/like`, true);
    
    req.addEventListener('load', function () {
        
        if (req.status >= 200 && req.status < 400) {
            
            let likes = document.getElementsByClassName('likes-count');
            res = JSON.parse(req.responseText);
            likes[0].innerHTML = res.likes;     
        }
    });
    
    req.send();
    
};

btnDelete.onclick = function (e){
    e.preventDefault();
    
    const response = confirm('Are you sure you want to delete this image?');
    
    if (response) {
        let imgId  = this.dataset.id;
        
        let req = new XMLHttpRequest();
    
        req.open('DELETE', `/image/${imgId}`, true);
        
        req.addEventListener('load', function (){

            if (req.status >= 200 && req.status < 400) {
                let iTag = btnDelete.getElementsByClassName('fa-times');
                
                btnDelete.classList.remove('btn-danger');
                btnDelete.classList.add('btn-success');
                
                iTag[0].classList.add('fa-check');
                iTag[0].classList.remove('fa-times');
                
                btnDelete.querySelector('span').innerHTML = 'Deleted!';
                btnDelete.style.pointerEvents = 'none';
            }

        });
        
        req.send();
    
    }
    
    
};