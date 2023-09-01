
const submit=document.getElementById("expense-add");
const table=document.getElementById("table-body");
const leaderboardtbl=document.getElementById("myTableShowLeaderBoard");
const downloadListtbl=document.getElementById("download-table");

const ActionMessage=document.getElementById('ActionMessage');
const message=document.getElementById('datamsg');
 const message1=document.getElementById('PremiumMsg');
const premiumbtn=document.getElementById('premiusm-btn1');
const leaderboardbtn=document.getElementById('leaderboard-btn');
const pagination=document.getElementById('pagination');


submit.addEventListener('click',addexpense);
 leaderboardbtn.addEventListener('click',showleaderboard);


 logoutbutton
 document.getElementById('logoutbutton').onclick=function(){
    location.href='signinpage.htm';
    localStorage.clear();
 }




// Prevent the default behavior of the click event on the select element
const selectElement = document.getElementById("rowPerPage");
console.log(selectElement.value); 

selectElement.addEventListener("change", async () => {
  const selectedOption = selectElement.selectedOptions[0];
  console.log(`Selected option: ${selectedOption.value}`);  
  const rowsize=selectedOption.value;
  localStorage.setItem('pagesize',rowsize);
  const token=localStorage.getItem("user");

  const pageno=localStorage.getItem('pageno');
  const expensedata=await axios.get(`http://localhost:4000/getexpensedata?param1=${pageno}&param2=${rowsize}`,{headers: {"Authorization":token}});
        showPagination(
            expensedata.data.currentPage,
            expensedata.data.hasNextPage,
            expensedata.data.nextPage,
            expensedata.data.hasPreviousPage,
            expensedata.data.previousPage,
            expensedata.data.lastPage)
            table.innerHTML="";
            localStorage.setItem('pagesize',expensedata.data.limit_per_page);
        // for (let index = 0; index < expensedata.data.expensedata.length; index++) {
        // display(expensedata.data.expensedata[index]);
        // }
        display(expensedata);
          console.log(expensedata);

});



function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


async function addexpense(event)
{
    try {
         event.preventDefault();
        const expense=document.getElementById("expens-money").value;
        const description=document.getElementById("expense-des").value;
        const choice=document.getElementById("drop-choice").value;

        if(expense!=='' && expense!==undefined && description!=='' && description!==undefined && choice!=='' && choice!==undefined)
        {
            const expensedata={
                expense,
                description,
                choice
            }
            const token=localStorage.getItem("user");
                const adddata= await axios.post("http://localhost:4000/addexpense",expensedata,{headers: {"Authorization":token}});
                if(adddata.data.success)
                {
                    console.log(adddata.data.msg);
                  //  display(expensedata);
                  ActionMessage.style.backgroundColor="green";
                  ActionMessage.innerHTML="Data Insert Successfully";
                  disappermessage();
                    addOnScreen(expensedata,adddata.data.userid);
                    
                    // location.reload();
                }
            
        }else{
            console.log("something went wrong or Field might be empty");
            ActionMessage.style.backgroundColor="Red";
            ActionMessage.innerHTML="<b>Something went wrong or Field might be Empty</b>";
            disappermessage();
        }
        
    } catch (error) {
         console.log(error);
         if(error.response)
         {
            console.log(error.response.data);
            ActionMessage.style.backgroundColor="Red";
            ActionMessage.innerHTML="<b>Something went wrong</b>";
            disappermessage();
         }
    }
}

window.addEventListener('DOMContentLoaded',async(event)=>{
    try {

        
        const userdata=parseJwt (localStorage.getItem('user'));
        console.log(userdata); 
        checkispremium(userdata.isuserpremium);
        const LoginUser=userdata.username
        document.getElementById('username').innerText='WELCOME'; 


        const pageno=1;   
        localStorage.setItem('pageno',pageno);
        // localStorage.setItem('pagesize',(selectElement.value || 5))
        const token=localStorage.getItem("user");
        const pageSize = localStorage.getItem('pagesize') || 5;
        console.log('pageziekkkkkk'+pageSize);
        // var pageno = localStorage.getItem('pageno') || 1;
        console.log("token"+token);
        console.log("i am window listner");
       const expensedata=await axios.get(`http://localhost:4000/getexpensedata?param1=${pageno}&param2=${pageSize}`,{headers: {"Authorization":token}});
        console.log(expensedata);
        console.log(expensedata.data.ispremiumuser);
        // checkispremium(expensedata.data.ispremiumuser);

       console.log("limitoer"+expensedata.data.limit_per_page);
       localStorage.setItem('pagesize',expensedata.data.limit_per_page)
        if(expensedata.data.expensedata.length<=0)
        {
            message.innerHTML='<h5>No record found</h5>';
            document.getElementById("pagination").style.display='none';
            selectElement.style.display='none';
        }else
        {
            message.innerHTML='';
            display(expensedata);
            
        
        showPagination(
            expensedata.data.currentPage,
            expensedata.data.hasNextPage,
            expensedata.data.nextPage,
            expensedata.data.hasPreviousPage,
            expensedata.data.previousPage,
            expensedata.data.lastPage)
        }
             document.getElementById("pagination").style.display='block';
            selectElement.style.display='block';
       
    } catch (error) {
        console.log(error);
        if(error.response)
        {
           console.error(error.response.data.msg);
            ActionMessage.style.backgroundColor="Red";
            ActionMessage.innerHTML=`<b>${error.response}</b>`;
            disappermessage();
        }
    }
    
})




function display(expensedata)
{
    for (var index = 0; index < expensedata.data.expensedata.length; index++) {
        console.log(expensedata.data.expensedata[index].description);
              const tbl=` 
              <tr id=${expensedata.data.expensedata[index].id}>   
              <td hidden>${expensedata.data.expensedata[index].id}</td>
              <td>${expensedata.data.expensedata[index].expense}</td>
              <td>${expensedata.data.expensedata[index].choice}</td>
              <td>${expensedata.data.expensedata[index].description}</td>
              <td><button type="button" onclick=editexpense('${expensedata.data.expensedata[index].id}','${expensedata.data.expensedata[index].expense}','${expensedata.data.expensedata[index].expense}','${expensedata.data.expensedata[index].description}')>Edit</button></td>
              <td><button type="button" onclick=deletexpense('${expensedata.data.expensedata[index].id}')>Delete</button></td>

            </tr>`
            document.getElementById("table-body").innerHTML += tbl;

            
        // table.innerHTML+=tbl;
    }
    const numRows=table.rows.length;
  console.log(`There are ${numRows} rows in the table.`);
}


function addOnScreen(expensedata,userid)
{
    const numRows=table.rows.length;
    console.log(numRows);
    const pageno=parseInt(localStorage.getItem('pageno'));
    const pagesize=parseInt(localStorage.getItem('pagesize'));
    console.log(numRows,pagesize,pageno);
    const hasNextPage=pagesize<(pagesize*(pageno-1))+numRows+1;
    const nextPage=pageno+1;
    const hasPreviousPage=pageno>1;
    const previousPage=pageno-1;
    const lastPage=Math.ceil((numRows+1)/pagesize);
    console.log(pageno,
        hasNextPage,
        nextPage,
        hasPreviousPage,
        previousPage,
        lastPage);
        showPagination(
            pageno,
            hasNextPage,
            nextPage,
            hasPreviousPage,
            previousPage,
            lastPage
          )
    
    console.log(pageno,pagesize);
    if((pagesize)>numRows){
            const tbl=` 
            <tr id=${userid}>   
            <td hidden>${userid}</td>
            <td>${expensedata.expense}</td>
            <td>${expensedata.choice}</td>
            <td>${expensedata.description}</td>
            <td><button type="button" onclick=editexpense('${userid}','${expensedata.expense}','${expensedata.expense}','${expensedata.description}')>Edit</button></td>
            <td><button type="button" onclick=deletexpense('${userid}')>Delete</button></td>

        </tr>`
         document.getElementById("table-body").innerHTML += tbl;
         
     }
    //  ActionMessage.innerText=""
  console.log(`There are ${numRows} rows in the table.`);

}

async function deletexpense(expenseid)
{
    try {
        const token=localStorage.getItem("user");
        const deletestatus= await axios.delete(`http://localhost:4000/deleteExpenseData/${expenseid}`,{headers: {"Authorization":token}});
        if(deletestatus.data.success)  
        {
            console.log(deletestatus.data.msg);
            // ActionMessage.innerText="Delete Successfully";
            ActionMessage.style.backgroundColor="Green";
            ActionMessage.innerHTML=`<b>Delete Successfully</b>`;
            disappermessage();
            
            deleteRow(expenseid);
        //     location.reload();
        }
    } catch (error) {
        console.log(error);
        if(error.response)
        {
            console.error(error.response.data.msg)
            ActionMessage.style.backgroundColor="Red";
            ActionMessage.innerHTML=`<b>${error.response.data.msg}</b>`;
            disappermessage();
        }
    }
}

function deleteRow(id) {
    var table = document.getElementById("myTable");
    var row = document.getElementById(id);
    table.deleteRow(row.rowIndex);
    
  }


function checkispremium(isuserpremium)
{
    // const isp=localStorage.getItem('ispremium');
    if(isuserpremium===1)
    {

        console.log("i am premium button"+localStorage.getItem('ispremium'))
        document.getElementById("premiusm-btn1").hidden = true;
        
        document.getElementById("leaderboard-btn").hidden = false;
        document.getElementById("download").hidden = false;
        document.getElementById("downloadfile").hidden = false;
        message1.hidden=false;
    }
    else
    {
        message1.hidden=true;
        document.getElementById("premiusm-btn1").hidden = false;

        
        document.getElementById("leaderboard-btn").hidden = true;
        document.getElementById("download").hidden = true;
        document.getElementById("downloadfile").hidden = true;
    }
 }



let buttonclick=0;
let buttonclick1=0;

async function showleaderboard()
{ 
    leaderboardtbl.style.display='block';
    try {
        document.getElementById('table-body1').innerHTML='';
        if(buttonclick===0)
        {
            const token=localStorage.getItem("user");
            const expensedata=await axios.get("http://localhost:4000/getleaderboarddata",{headers: {"Authorization":token}});
            console.log("leaderboard data+"+expensedata.data.leaderedata[0].username);
            for (let index = 0; index < expensedata.data.leaderedata.length; index++) {
                tbleleadboard(expensedata.data.leaderedata[index])
                
            }
            buttonclick=1;
            
        }else{
            buttonclick=0;
            leaderboardtbl.style.display='none'
            document.getElementById('table-body1').innerHTML='';

        }
    } catch (error) {
        console.log(error);
    }
    
}



function tbleleadboard(data)
{
    const tbl=`<tr> 
                <td>${data.username}</td>
                <td>${data.totalexpense}</td>
              </tr>`
          document.getElementById('table-body1').innerHTML+=tbl;
}



  function download()
        {
            const token=localStorage.getItem("user");
            console.log(" i am download calling");
            axios.get("http://localhost:4000/downloaddata",{headers: {"Authorization":token}})
            .then((response)=>{
                if(response.status===200){
                    console.log(response.data.fileurl);
                    var a =document.createElement("a");  
                    a.href=response.data.fileurl;
                    a.download='expense.txt';
                    a.click();
                }else{
                    throw new Error(response.data.message);
                }
            })
            .catch(error=>{
                console.log(error)
            }) 
        
        }

async function downloadAllFile()
{
    try {
        document.getElementById('downloadAllExpenseTable').style.display='block'
        document.getElementById('expenseFile').innerHTML='';
        if(buttonclick1===0)
        {
                const token=localStorage.getItem("user");
            const DownloadFilelist= await axios.get("http://localhost:4000/downloaddataAllFile",{headers: {"Authorization":token}})
            .then((response)=>{
                    if(response.status===200){
                        console.log(response);
                        for (let index = 0; index < response.data.downloadFileData.length; index++) {
                            console.log('i am download data11');
                            downloadfiledata(response.data.downloadFileData[index]);
                        }
                    }
            })
            buttonclick1=1;
            
        }else{
            buttonclick1=0;
            document.getElementById('downloadAllExpenseTable').style.display='none'

        }

    } catch (error) {
        console.log(error);
    }
}

function downloadfiledata(data)
{
    const tbl=`<tr> 
                <td>${data.downloaddate}</td>
                <td>ExpenseFile</td>
                <td><button type="button" onclick=downloadFile('${data.filename}')>Download</button></td>
              </tr>`
            //   downloadListtbl.innerHTML+=tbl;
              document.getElementById('expenseFile').innerHTML+=tbl;
}

function downloadFile(fileUrl) {
    var url = fileUrl; // replace with your file URL
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Expense.pdf'; // replace with your desired file name
    a.click();
  }


  function showPagination(
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
  )
  {
    //  table.innerHTML="";
    pagination.innerHTML='';
   if(hasPreviousPage){

    const btn2 =document.createElement('button')
    btn2.innerHTML = previousPage
    // btn2.addEventListener('click', () => getProducts(previousPage))
    btn2.addEventListener('click', function(event) {
        event.preventDefault();
        getProducts(previousPage);
      });
    
    pagination.appendChild(btn2)
    
    }
    
    const btn1 = document.createElement('button');
    btn1.innerHTML = `<h3>${currentPage}</h3>`
    
    // btn1.addEventListener('click', ()=>getProducts(currentPage))
    btn1.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.setItem('pageno',currentPage);
        getProducts(currentPage);
      });
    //    localStorage.setItem('pageno',currentPage);
    
    pagination.appendChild(btn1)


    if (hasNextPage) {

        const btn3= document.createElement('button')
        btn3.innerHTML = nextPage
        //  localStorage.setItem('pageno',nextPage);
        console.log('i am next page');
        // btn3.addEventListener('click', ()=>getProducts(nextPage))
        btn3.addEventListener('click', function(event) {
            event.preventDefault();
            getProducts(nextPage);
          });
          
        
        pagination.appendChild(btn3)
    
    }
}
    

async function getProducts (page){
    // page.preventDefault();
    var pageSize = localStorage.getItem('pagesize') || 5;
    localStorage.setItem('pageno',page);
    table.innerHTML="";
    const token=localStorage.getItem("user");
    console.log("hey i am page callin");
    const expensedata=await axios.get(`http://localhost:4000/getexpensedata?param1=${page}&param2=${pageSize}`,{headers: {"Authorization":token}})
        console.log(expensedata.data+"dddd");
        // for (let index = 0; index <expensedata.data.expensedata.length; index++) {
        //     display(expensedata.data.expensedata[index]);
        //    }
        display(expensedata);
        localStorage.setItem('pagesize',expensedata.data.limit_per_page);
         showPagination(
            expensedata.data.currentPage,
            expensedata.data.hasNextPage,
            expensedata.data.nextPage,
            expensedata.data.hasPreviousPage,
            expensedata.data.previousPage,
             expensedata.data.lastPage)
    

 }

    
 function disappermessage()
 {
    setTimeout(function() {
        ActionMessage.innerHTML = "";
      }, 5000);


    //   message.style.backgroundColor="green";
    //   message.innerText="Data Add Successfully";
    //   setTimeout(() => {
    //       message.style.display="none";
    //   }, 3000);
    //   message.style.display = "block";
 }


 