

//const deleteBtn = document.getElementById('delete-btn');
const createBtn = document.getElementById('create-btn');


async function createTodo(){
try{
    const todo = document.getElementById('createtodo').value;
    const res =  await fetch('/create',{
    method:'POST',
    headers: {
        'Content-Type': 'application/json',
      },
    body: JSON.stringify({
        todo:todo
    }) 
})

if(res.ok){
    reload();
}
else{
    console.log(res.status);
}
}catch(err){
    console.log(err);
}
}
createBtn.addEventListener('click', createTodo);












const deleteBtn = document.getElementById('delete-btn');
console.log(deleteBtn);
async function deleteTodo() {
    const Dtodo = document.getElementById('todo').value;
    try{
    const delRes =  await fetch('/delete', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
        },
    body: JSON.stringify({
    todo: Dtodo
    })
    });


    if (delRes.ok) {
         reload();

    } else {
        }
    }catch(err){
    }
}

deleteBtn.addEventListener('click', deleteTodo);





function reload(){
   window.location.reload();
    console.log('reloaded');
}






