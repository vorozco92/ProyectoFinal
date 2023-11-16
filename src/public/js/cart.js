const form =document.getElementsByClassName('removeForm')
const cartId = document.getElementById('cartId').value;

for (var i = 0; i <form.length; i++) {
form[i].addEventListener('submit', e =>{
    e.preventDefault();
   
    const formO =document.getElementById(e.target.id);
    console.log(e.target.id);
    const data= new FormData(formO);
    const obj={}
    data.forEach((value,key)=>obj[key]=value);

    console.log('/api/carts/'+cartId+'/products/'+obj.product_id)
    fetch('/api/carts/'+cartId+'/products/'+obj.product_id,{
        method:'DELETE',
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>{
        if(result.status===200){
            document.getElementById("rowNo"+obj.product_id).style.display = 'none';
            Swal.fire({
                'title': 'El producto se elimino existosamente.',
                'icon' : 'success'
            });
            //window.location.replace('/api/products/')
        }
        else{
            Swal.fire({
                'title': 'Ocurrio un error en la eliminación.',
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