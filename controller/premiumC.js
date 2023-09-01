 const { json } = require('body-parser');
const Razorpay=require('razorpay');
const ordertbl=require('../module/ordertbl');
const usertbl=require('../module/usertable');
const jwt=require('jsonwebtoken');
const sequelize=require('../util/connection');


function detailencry(id,premium)// this function through we are encryption aur data with some special keys(secret key)
{
    return jwt.sign({userid:id,isuserpremium:premium},'sekreteky');
}

exports.premiumcontroller=async(req,res)=>{
    try {
        console.log("i am not calling1"+req.user.id);
        var razp=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET,
        })
        const amount=2500;

        razp.orders.create({amount,currency:'INR'},(err,order)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            console.log(order.id);
            ordertbl.create({
                orderid:order.id,
                status:'Pending',
                tbluserdetailId:req.user.id
            }).then(()=>{
                    console.log("success");
                    return res.status(201).json({order,key_id:razp.key_id});
                }).catch(err=>{
                    console.log("eroor"+err)
                });
    
        });

    } catch (error) {
        console.log(error);
        return res.status(403),json({message:"something went worng",error:error});
    }
};

exports.updatepremiumcontroller=async(req,res)=>{
    const t = await sequelize.transaction();
    console.log(req.body.order_id);
     console.log(req.body.payment_id);
    try {

       const data= await ordertbl.findAll({where:{tbluserdetailId:req.user.id,orderid:req.body.order_id}});
       console.log("data"+data.length);
       if(data.length>0)
       {
        
                 await ordertbl.update({
                    paymentid: req.body.payment_id,
                    status:'success'
                }, {
                    where: {
                        orderid:req.body.order_id
                    }
                },{transaction:t});
               
                        const updateuser= await usertbl.update({
                            ispremium: 1
                        }, {
                            where: {
                                id:req.user.id
                            }
                        },{transaction:t})
                        .then(async()=>{
                            await  t.commit();
                            return res.status(200).json({success:true,userdetail:detailencry(req.user.id,1),message:"su22ccessfull"});
                        }).catch(async()=>{
                            await  t.rollback();
                            return res.status(400).json({success:false,message:"Unsuc22cessfull"});
                        })              
            
       }else {
        //    throw new Error("Not a premium user");
           return res.status(400).json({success:false,message:"Transaction fail"});
       }

    } catch (error) {
        console.log(error);
        return res.status(400).json({success:false,message:"Uns33uccessfull"});
    }

}

exports.paymentfailed=async(req,res)=>{
try {
    console.log("payment faild"+req.body.payment_id);
    const updatedata= await ordertbl.update({
        //  paymentid: req.body.payment_id,
         status:'failed'
    }, {
        where: {
            orderid:req.body.order_id,
            tbluserdetailId:req.user.id
        }
    });
    return res.status(200).json({message:"update successfully"});
} catch (error) {
    return res.status(400).json({message:"update failed"});
}
   
};