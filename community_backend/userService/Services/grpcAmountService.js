const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAmountById = async(call, callback)=>{
    console.log(call.request.id);
    const id = call.request.id
    const amount = call.request.amount
    const verifiedUser = await prisma.user.findUnique({
        where: {
            id: call.request.id, // Replace 'userId' with the actual ID you are looking for
        },
    });
    if (!verifiedUser) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: `User with ID ${id} not found`
      });
    }
    console.log("this is calling from amount")
    if(verifiedUser.amount>amount){

        const finalAmount = verifiedUser.amount - amount;
        const updatedUser = await prisma.user.update({
        where: {
            id: id, // Unique identifier for the user to update
        },
        data: {
            amount: finalAmount
        },
    });
    }
    else{
       return callback(null, {
        isSuccess:false,
        message:"Amount update failed"
    }); 
    }
    const user = {
        id: verifiedUser.id,
        username: verifiedUser.name,
        email: verifiedUser.email
    }
    callback(null, {
        isSuccess:true,
        message:"Amount update successfull"
    });
}

// const getUserById = async(callErrorFromStatus, callback)=>{
//     try{
//         const userData= await getUserById1(callErrorFromStatus.request.id);
//         if(!userData) return callback(null,{});
//         callback(null, userData);
//     } catch(err){
//         callback(err,null);
//     }
// }



module.exports = {getAmountById}