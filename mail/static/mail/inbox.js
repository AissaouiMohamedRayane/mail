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
      if(!data.message){
        alert(data.error);
        
        return false;
      }
      alert(data.message);
    })
  }
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      if (emails){
        const ul=document.createElement('ul');
        ul.id='emails-ul';
        document.querySelector('#emails-view').append(ul);
        emails.forEach((email) => {
            const li=document.createElement('li');
            li.className='emails-ul-li';
            const button=document.createElement('button');
            button.className='emails-button';
            button.innerHTML=`<span class='first-span'><p>${email.sender}</p><p>${email.subject}</p></span><span class='second-span'><p>${email.timestamp}</p></span>`;
            li.appendChild(button);
            document.querySelector('#emails-ul').append(li);
          //print email
            button.onclick=()=>{
              if(mailbox==='inbox' && email.read===false){
                fetch(`emails/${email.id}`,{
                method:'PUT',
                  body:JSON.stringify({
                    read:true,
                  })
              })
              .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Handle successful response
                console.log('Email updated successfully');
            })
              }

              document.querySelector('#emails-ul').style.display='none';
              document.querySelector('#emails-view').innerHTML='';
              const div=document.createElement('div');
              div.id='email-div';
              const ul=document.createElement('ul');
              ul.className='email-ul';
              div.appendChild(ul);
              const li=[];
              for(let i=0;i<=3;i++){
                li[i]=document.createElement('li');
                ul.appendChild(li[i]);
              }
              li[0].innerHTML='From:';
              li[1].innerHTML='TO:';
              li[2].innerHTML='Subject:';
              li[3].innerHTML='timestamp:';
              if (mailbox!=='sent'){
                const button=document.createElement('button');
                li[4]=document.createElement('li');
                li[4].id='li-button';
                ul.appendChild(li[4]);
                button.innerHTML='Reply'
                button.classList='btn btn-sm btn-outline-primary'
                li[4].appendChild(button);
                button.onclick=()=>{
                  compose_email();
                  document.querySelector('#compose-recipients').value = email.sender;
                  document.querySelector('#compose-recipients').setAttribute('disabled', '');
                }
                if(mailbox==='inbox'){
                  const button2=document.createElement('button');
                  button2.classList='btn btn-sm btn-outline-primary'
                  button2.innerHTML='archive';
                  li[4].appendChild(button2);
                  button2.onclick=()=>{
                    fetch(`emails/${email.id}`,{
                      method:'PUT',
                      body:JSON.stringify({
                        archived:true
                      })
                    })
                    .then(response=> {
                      if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    // Handle successful response
                    alert('Email updated successfully');
                  })
                  }
                }
                if (mailbox==='archive'){
                  const button3=document.createElement('button');
                  button3.classList='btn btn-sm btn-outline-primary'
                  button3.innerHTML='unarchive';
                  li[4].appendChild(button3);
                  button3.onclick=()=>{
                    fetch(`emails/${email.id}`,{
                      method:'PUT',
                      body:JSON.stringify({
                        archived:false
                      })
                    })
                    .then(response=> {
                      if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    // Handle successful response
                    alert('Email updated successfully');
                    
                  })
                  }
                }
                load_mailbox(mailbox)
              }
              
              const ul2=document.createElement('ul');
              ul2.className='email-ul';
              div.appendChild(ul2);
              document.querySelector('#emails-view').append(div);
              const li2=[];
              for(let i=0;i<=3;i++){
                li2[i]=document.createElement('li');
                ul2.appendChild(li2[i]);
              }
              li2[0].innerHTML=`${email.sender}`;
              li2[1].innerHTML=`${email.recipients}`;
              if(email.subject){
                li2[2].innerHTML=`${email.subject}`;
              }
              else{
                li2[2].innerHTML=`Null`;
              }
              li2[3].innerHTML=`${email.timestamp}`;
              const hr=document.createElement('hr');
              document.querySelector('#emails-view').append(hr);
              const div2=document.createElement('div');
              div2.innerHTML=`<p>${email.body}</p>`;
              document.querySelector('#emails-view').append(div2);

            }
        });
      }
  });

}
