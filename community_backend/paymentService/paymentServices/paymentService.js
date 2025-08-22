const getPaymentUrl = async(call,callback)=>{
    console.log("this is so cooool");
    const url = "https://i-am-super-hot-today.com"
    callback(null, url);
}
module.exports = {getPaymentUrl}