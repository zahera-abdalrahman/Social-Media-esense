import { Component,Renderer2 } from '@angular/core';
import { user } from '../DTOs/User';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { post } from '../DTOs/Post';
import { like } from '../DTOs/Like';
import { CommentService } from '../services/comment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { comment } from '../DTOs/Comment';
import { LikeService } from '../services/like.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  loggedinUser!:user
  activeUser!: any;
  userPosts!:post[]
  currentPostLikes: like[] = [];
  commentForm!: FormGroup;
  postForm!:FormGroup
  postImageUrl:any=''
  isLikedMap: { [key: number]: boolean } = {} 
  visibleComments: { [postId: string]: boolean } = {};
  likes!:like[]

  constructor(
    private activeRouter: ActivatedRoute,
    private postService:PostService,
    private router:Router,
    private renderer: Renderer2,
    private commentService:CommentService,
    private formbuilder:FormBuilder,
    private likeService:LikeService
  ){}


    ngOnInit(): void {

      const storedUserInfo = localStorage.getItem('SocialMediaUser');
      this.loggedinUser = storedUserInfo ? JSON.parse(storedUserInfo) : null;
      console.log("User"+this.loggedinUser);

      this.checkComment();
      this.checkPost();
      this.getPostByUserId();
    }


    getPostByUserId(){
      debugger
      this.postService.getPostByUserId(this.loggedinUser.id).subscribe({
        next:data=> {
          debugger
          this.userPosts=data
          console.log(this.userPosts)
          
        },
        error:()=>{
          console.log('error happened')
        }
      });
    }

    // openLikesModal(likes: like[]) {
    //   this.currentPostLikes = likes;
    //   const modalElement = document.getElementById('likesModal');
    //   if (modalElement) {
    //     this.renderer.addClass(modalElement, 'show');
    //     modalElement.setAttribute('style', 'display: block;');
    //   }
    // }
  
    // closeLikesModal() {
    //   const modalElement = document.getElementById('likesModal');
    //   if (modalElement) {
    //     this.renderer.removeClass(modalElement, 'show');
    //     modalElement.setAttribute('style', 'display: none;');
    //   }
    // }
    

  // comment actions
  checkComment(){
    this.commentForm=this.formbuilder.group({
      txtComment:['',Validators.required],
    });
  }
  createComment(postId: number) {
    if(this.commentForm.valid)
      {
        const commentContent = this.commentForm.get('txtComment')?.value;

        if (!commentContent) {
          console.log('Comment content is required.');
          return;
        }
        var newComment=new comment();
        newComment.content=this.commentForm.value['txtComment'];
        newComment.postID= postId
        newComment.user= this.loggedinUser 
        newComment.UserId=this.loggedinUser.id
        
    
        this.commentService.createComment(newComment).subscribe({
          next: () => {
            console.log('Comment added successfully');
            this.getPostByUserId(); 
            this.commentForm.reset();
          },
          error: () => {
            console.log('Error adding comment');
          }
        });
      }

  }

  toggleComments(postId: number): void {
    this.visibleComments[postId] = !this.visibleComments[postId];
  }

  isCommentsVisible(postId: number): boolean {
    return this.visibleComments[postId] || false; 
  }

  //create post


  checkPost() {
    this.postForm = this.formbuilder.group({
      txtContent: ['', Validators.required],
      txtImage: ['']
    });
  }

  createPost() {
    debugger
    const postContent = this.postForm.get('txtContent')?.value;
    const postImage = this.postForm.get('txtImage')?.value;

    if (!postContent && !postImage) {
      console.log('Either text or image is required.');
      return;
    }

    const newPost = new post();
    newPost.createdAt = new Date();
    newPost.contentText = postContent;
    newPost.contentImage = postImage;
    newPost.user = this.loggedinUser;
    newPost.UserId=this.loggedinUser.id

    this.postService.createPost(newPost).subscribe({
      next: () => {
        console.log('Post created successfully');
        this.getPostByUserId();
        this.postForm.reset(); 
      },
      error: () => {
        console.log('Error creating post');
      }
    });
  }

    goToSetting(){
      this.router.navigate(['setting'])
    }



    
  //like actions
  // getAllLikes(){
  //   var likes=this.likeService.getAllLike().subscribe({
  //      next:data=> {
  //        this.likes=data
  //      },
  //      error:()=>{
  //        console.log('error happened')
  //      }
  //    });
 
     
  //  }
 
 
   //toggle like
   getAllLikes() {
    this.likeService.getAllLike().subscribe({
      next: (data) => {
        this.likes = data;
        console.log(this.likes);
      },
      error: () => {
        console.log('Error fetching likes');
      }
    });
  }
  openLikesModal(postId:number) {
    const post = this.userPosts.find(x => x.postId === postId);
  if (post) {
    this.currentPostLikes = post.like.filter(like => like.isLiked);
  }

  // Display the modal
  const modalElement = document.getElementById('likesModal');
  if (modalElement) {
    this.renderer.addClass(modalElement, 'show');
    modalElement.setAttribute('style', 'display: block;');
  }
  }

  closeLikesModal() {
    const modalElement = document.getElementById('likesModal');
    if (modalElement) {
      this.renderer.removeClass(modalElement, 'show');
      modalElement.setAttribute('style', 'display: none;');
    }
  }


  //toggle like
  toggleLike(postId: number) {
    debugger
    this.likeService.toggleLike(postId, this.loggedinUser.id).subscribe(isLiked => {
      this.isLikedMap[postId] = isLiked;
      this.getPostByUserId()
    });
  }
   
  // checkIfLiked(postId: number): boolean {
  //   return this.isLikedMap[postId] || false;
  // }
   
  isLiked(postId: number): boolean {
    const post = this.userPosts.find(x => x.postId === postId);
    return post ? post.like.some(like => like.userId === this.loggedinUser.id && like.isLiked) : false;
  }
   
  postLikes(postId:number){
    debugger
    const post = this.userPosts.find(x => x.postId === postId);
    return post ? post.like.filter(like => like.isLiked).length : 0;
  }

  hasUserLiked(postId: number): boolean {
    const post = this.userPosts.find(x => x.postId === postId);
    return post ? post.like.some(like => like.userId === this.loggedinUser.id && like.isLiked) : false;
}


    //Image upload
  onfileSelected(file:any){
    debugger
    let reader=new FileReader();
    reader.readAsDataURL(file.target.files[0])
    reader.onload=(_event)=>{
      console.log(reader.result);
      this.postImageUrl=reader.result
      
    }
  }

}
