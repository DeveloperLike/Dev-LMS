const redirecttologinpage=(navigate)=>{
    var token = localStorage.getItem('token');
    if(token){
      navigate('/dashboard');
    }
}
export {redirecttologinpage};