document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));

  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);



  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  document.querySelector('#emails-ul').innerHTML='';

  document.querySelector('#compose-form').onsubmit=()=>{
    fetch('/emails',{
      method:'POST',
      body:JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value})
    })
    .then(response=>response.json())
    .then(data=>{
      console.log(data)
    })
  }
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  document.querySelector('#emails-ul').innerHTML='';
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      if (emails){
        emails.forEach((email) => {
          console.log(email.sender)
          const li=document.createElement('li');
          const button=document.createElement('button');
          const a=document.createElement('a');
          const p=document.createElement('p');
          const p2=document.createElement('p');

          a.href='';
          let span=document.createElement('span');
          span.id='first-span'
          let span2=document.createElement('span');

          p.innerHTML=`${email.recipients} `;
          p2.innerHTML=`${email.subject}`;
          span.appendChild(p);
          span.appendChild(p2);
          span2.innerHTML=`${email.timestamp}`;     
          button.appendChild(span);
          button.appendChild(span2);

          console.log(button)
          a.appendChild(button);
          li.appendChild(a);
          console.log(li)
          document.querySelector('#emails-ul').append(li);
        });
      }
  });

}
