

type TResponse={
    statusCode:number,
    success:boolean,
    message?:string,
    data?:any
}

const sendResponse=(res:any, response:TResponse)=>{
    res.status(response.statusCode).json({
        success: response.success,
        message: response.message,
        data: response.data
    })
}


export default sendResponse;