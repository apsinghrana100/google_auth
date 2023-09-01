const submit=document.getElementById("submit-btn");
const message=document.getElementById("msg");

submit.addEventListener('click',signup);

function goToPage() {
    window.location.href = "loginPage.htm";
  }
 async function signup(event)
{
    try {
        
       
        const username=document.getElementById('user-name').value.trim();
        const emailid=document.getElementById("user-email").value.trim();
        const password=document.getElementById("user-password").value.trim();
        console.log(username+" "+emailid+" "+password); 
        event.preventDefault();
        if(username!=="" && username!==undefined && emailid!=="" && emailid!==undefined && password!=="" && password!==undefined)
        {
        
            const userdetail={
                username,
                emailid,
                password
            }

            const promise= await axios.post("http://localhost:4000/signuppage",userdetail);
            if(promise.data===true)
            {
                console.log("email id exists");
                message.style.backgroundColor="red";
                message.innerHTML="<h1>email id exits</h1>";
                setTimeout(() => {
                    message.style.display = "none";
                }, 3000);
                message.style.display = "block";

            }else{
                console.log("Data Add Successfully");
                message.style.backgroundColor="green";
                message.innerText="Data Add Successfully";
                setTimeout(() => {
                    message.style.display="none";
                }, 3000);
                message.style.display = "block";
                window.location.href='loginPage.htm';
                cleardata();
            }

        }else{
            console.log("some Field are might be empty");
            message.style.backgroundColor="red";
                message.innerText="some Field are might be empty";
                setTimeout(() => {
                    message.style.display="none";
                }, 3000);
                message.style.display = "block";
        }
    }catch (error) {
        console.log(error);
    }
    
}

function cleardata()
{
    const username=document.getElementById('user-name').value="";
    const emailid=document.getElementById("user-email").value="";
    const password=document.getElementById("user-password").value="";
};


async function goTogoogle(event)
{
    console.log("i am here ")
    try {
        await axios.get("http://localhost:4000/auth/google")
    } catch (error) {
        console.log(error);
    }
    
}