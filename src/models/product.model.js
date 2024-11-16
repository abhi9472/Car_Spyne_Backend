import mongoose  from "mongoose";
import { User } from "./user.model.js";
import { userdetail } from "../controllers/user.controller.js";

const {Schema}=mongoose

// import jwt from 'jsonwebtoken'
// import bycrpyt from 'bcrypt'

const productSchema=new Schema(
    {
        title:
        {
            type:String,
            required:true,
            lowercase:true,
            trim:true

        },
        description:{
            type:String,
            required:true,
            lowercase:true,
            trim:true

        },
        tags:{
            type:String,
            required:true,
            lowercase:true,
            trim:true

        },
        image:
        {
            type:[String],
            required:true
        },
        
        uploader: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }
    ,{
        timestamps:true
    }
)

// userSchema.pre('save',async function(next){
//     if(!this.password=password)
// })

export const Products=mongoose.model("Products",productSchema)

export const Uploader=mongoose.model("Uploader",productSchema);



