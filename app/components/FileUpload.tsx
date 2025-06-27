"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";

import React, { useState } from "react";


interface FileUploadsProps{
    onSuccess: (res:any) => void,
    onProgress:(res:number)=> void,
    FileType? : "image" | "video"
}

const FileUpload = ({ onSuccess,onProgress,FileType}: FileUploadsProps) => {
  
const [error, setError] = useState<string | null>(null)
const [uploading, setUploading] = useState(false) 

   
  const validateFile = (file: File) =>{

    // check valid file type
    if(!file.type.startsWith("video/")){
        setError("Please Uploads a valid video file ")
    }
    
    // check file size less thsn 100 MB
    if(file.size > 100 * 1024 * 1024){
        setError("Please Uploads video file less than 100 MB ")
    }
    return true;


  }

  const handleFileUploads = async(e: React.ChangeEvent<HTMLInputElement>)=>{

     // Get the first selected file from the input event (or undefined if none selected)
        const file = e.target.files?.[0]

        if(!file || !validateFile(file))return

        setUploading(true)
        setError(null)
    
        try {
            const authRes = await fetch("/api/auth/imagekit-auth")
            const auth =  await authRes.json();

             const uploadResponse = await upload({
                
                 file,
                 fileName: file.name,
                 publicKey:process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                expire:auth.expire,
                token:auth.token,
                signature:auth.signature,
       
                onProgress: (event) => {
                    if(event.lengthComputable && onProgress){
                        const percent = (event.loaded / event.total) * 100

                        onProgress(Math.round(percent))
                    }
                },
                
            });

            onSuccess(uploadResponse)

        } catch (error) {
            console.error("upload Failed ", error)
        }finally{
            setUploading(false)
        }
  }


  return (
    <>
      <input
       type="file"
       accept={FileType === "video" ? "video/*" : "image/*"}
       onChange={handleFileUploads}
       />
       (setUploading && (<span>Loading</span>) )
      
    </>
  );
}
export default FileUpload;