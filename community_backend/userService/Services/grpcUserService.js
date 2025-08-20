const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUserById = async(call, callback)=>{
    console.log(call.request.id);
    const id = call.request.id
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
    console.log(verifiedUser)
    const user = {
        id: verifiedUser.id,
        username: verifiedUser.name,
        email: verifiedUser.email
    }
    callback(null, user);
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



module.exports = {getUserById}