const form =document.getElementsByClassName('addForm')
const cartId = document.getElementById('cartId').value;

for (var i = 0; i <form.length; i++) {
form[i].addEventListener('submit', e =>{
    e.preventDefault();

    const data= new FormData(form[i]);
    const obj={}
    data.forEach((value,key)=>obj[key]=value);


    fetch('/api/carts/'+cartId,{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>{
        if(result.status===200){
            console.log(result)
            Swal.fire({
                'title': 'El producto se agrego existosamente.',
                'icon' : 'success'
            });
            //window.location.replace('/api/products/')
        }
        else{
            Swal.fire({
                'title': 'El correo y/o la contraseña son incorrectos.',
                'icon' : 'error'
            });
        }

        
    }).catch(error => {

        console.error('Error en la solicitud:', error.message);
    
        Swal.fire({
    
          title: 'Ocurrió un error al procesar la solicitud.',
    
          icon: 'error'
    
        });
    
      });


})
}