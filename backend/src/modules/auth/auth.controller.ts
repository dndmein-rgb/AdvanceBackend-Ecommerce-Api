import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { authService } from "./auth.container.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { destroyCookies, setCookies } from "../../utils/auth.helper.js";

export const registerUserController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await authService.registerUser(req.body);
    setCookies(res,result.accessToken,result.refreshToken);
    sendResponse(res, 201, {
      success: true,
      message: "User created successfully",
      data: result,
    });
  },
);

export const loginUserController=catchAsync(async(req:Request,res:Response)=>{
  const result=await authService.loginUser(req.body)
 setCookies(res, result.accessToken, result.refreshToken);

    sendResponse(res, 200, {
      success: true,
      message: "Logged in successfully",
      data: result,
    });
  },
);

export const getloggedInUserController=catchAsync(async(req:Request,res:Response)=>{
  const result=await authService.getCurrentUser(req.user!.id)

  sendResponse(res,200,{
    success:true,
    message:"User data fetched successfully",
    data:result
  })
})

export const logoutUserController=catchAsync(async(req:Request,res:Response)=>{
  const refreshToken=req.cookies?.refreshToken
  if(refreshToken){
    await authService.logoutUser(refreshToken)
  }
  destroyCookies(res)
  sendResponse(res,200,{
    success:true,
    message:"User logged out successfully",
  })
})

export const logoutFromAllDevicesController=catchAsync(async (req:Request,res:Response)=>{
  const result=await authService.logoutFromAllDevices(req.user!.id)
  sendResponse(res,200,{
    success:true,
    message:"Logged out from all devices successfully"
  })
})
