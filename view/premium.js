//  const message1=document.getElementById('PremiumMsg');
document.getElementById("premiusm-btn1").onclick=async function(event){
    console.log("i am calling");
    try {
        const token=localStorage.getItem("user");
        const response=await axios.get("http://localhost:4000/purchasepremium", {headers:{'Authorization':token}});
        console.log(response);
        console.log(response.data.key_id);
        console.log(response.data.order.id);
        console.log(response.ragitzorpay_payment_id);
        console.log("dd");
        if(response)
        {
            console.log("dd");
        }
        
        var options={
            "key":response.data.key_id,
            "order_id":response.data.order.id,

            "handler": async function(response){
             const resp=await axios.put("http://localhost:4000/updatepremium",
                {
                    order_id:options.order_id,
                    payment_id:response.razorpay_payment_id,

                },{headers:{'Authorization':token}})

                // console.log(resp);
                
                    // localStorage.setItem('ispremium',1);
                    localStorage.setItem('user',resp.data.userdetail)
                    document.getElementById('PremiumMsg').hidden=false;
                    premiumbtn.style.display='none'; 
                    document.getElementById('leaderboard-btn').hidden=false;
                    document.getElementById("download").hidden = false;
                    document.getElementById("downloadfile").hidden = false;
                   alert("you are a premium user");

                
               
            }
            

        };
        const rzpl=new Razorpay(options);
        rzpl.open();
        event.preventDefault();
        
        
        rzpl.on('payment.failed',async function(response){
            // console.log(res);
            console.log(options.order_id);
            console.log(response.razorpay_payment_id);
            try {
                await axios.put("http://localhost:4000/premiumstatus",
                {
                    order_id:options.order_id,
                    payment_id:response.razorpay_payment_id,

                },{headers:{'Authorization':token}})
               alert("payment failed");
               document.getElementById('PremiumMsg').hidden=true;
            } catch (error) {
                console.log(error);
            }
           
        })
        
    } catch (error) {
        alert("you are a not premium user");
       
        document.getElementById('PremiumMsg').hidden=true;

    }
};