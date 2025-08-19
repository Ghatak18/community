const getUserById1 = async(id)=>{
    return{
        id: 1,
        username: "Supratik",
        email: "2@2.com"
    }
}

const getUserById = async(callErrorFromStatus, callback)=>{
    try{
        const userData= await getUserById1(callErrorFromStatus.request.id);
        if(!userData) return callback(null,{});
        callback(null, userData);
    } catch(err){
        callback(err,null);
    }
}



module.exports = {getUserById}