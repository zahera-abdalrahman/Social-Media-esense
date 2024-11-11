import { comment } from "./Comment";
import { like } from "./Like"
import { user } from "./User"

export class post{
    postId!:number
    createdAt!: Date;
    contentText!: string;
    contentImage!: string;
    UserId!:string
    // IFormFile!: File;
    user!: user;
    like!: like[];
    comments!: comment[];
}