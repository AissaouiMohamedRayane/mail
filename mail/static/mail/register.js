document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#button-email').onclick=register_email;
    document.querySelector('#button-username').onclick=register_username;
    register_email();
  });
  
  function register_email() {
    document.querySelector('#form-email').style.display='block';
    document.querySelector('#form-username').style.display='none';
    document.querySelector('#form-username').value='';
  }
  function register_username() {
    document.querySelector('#form-email').style.display='none'
    document.querySelector('#form-username').style.display='block'
    document.querySelector('#form-email').value='';
  }