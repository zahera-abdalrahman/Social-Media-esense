import { Component, OnInit, Renderer2 } from '@angular/core';
import { PostService } from '../services/post.service';
import { post } from '../DTOs/Post';
import { like } from '../DTOs/Like';
import { user } from '../DTOs/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../services/comment.service';
import { comment } from '../DTOs/Comment';
import { LikeService } from '../services/like.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { login } from '../DTOs/Login';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  posts!:post[]
  currentPostLikes: like[] = [];
  loggedinUser!:any
  postForm!:FormGroup
  commentForm!: FormGroup;
  likedPosts = new Set<number>();
  activeUser!: string;
  likes!:like[]
  isLikedMap: { [key: number]: boolean } = {}
  postImageUrl:any=''


  likePost!:number
  visibleComments: { [postId: string]: boolean } = {};

  constructor(private postService:PostService,
              private accountService:AccountService,
              private commentService:CommentService,
              private likeService:LikeService,
              private renderer: Renderer2,
              private formbuilder:FormBuilder,
              private activeRouter: ActivatedRoute,
              private router:Router
  ){}


  ngOnInit(): void {
    
    debugger
    this.checkPost();
    this.checkComment();

    const storedUserInfo = localStorage.getItem('SocialMediaUser');
    this.loggedinUser = storedUserInfo ? JSON.parse(storedUserInfo) : null;
    console.log("User"+this.loggedinUser);

    this.getAllPosts(); 
    this.getAllLikes()
  }

// show all posts and likes and comments

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
    newPost.contentImage = this.postImageUrl;
    newPost.user = this.loggedinUser;
    newPost.UserId=this.loggedinUser.id

    this.postService.createPost(newPost).subscribe({
      next: (data) => {
        console.log('Post created successfully');
        this.posts.unshift(data);  
        this.getAllPosts();
        this.postForm.reset(); 
      },
      error: () => {
        console.log('Error creating post');
      }
    });
  }

  
  getAllPosts(){
    debugger
   this.postService.getAllPost().subscribe({
      next:data=> {
        this.posts=data
        console.log(this.posts)
        
      },
      error:()=>{
        console.log('error happened')
      }
    });
  }






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
            this.getAllPosts(); 
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


  //like actions
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
    const post = this.posts.find(x => x.postId === postId);
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
      this.getAllPosts()
    });
  }
   
  // checkIfLiked(postId: number): boolean {
  //   return this.isLikedMap[postId] || false;
  // }
   
  isLiked(postId: number): boolean {
    const post = this.posts.find(x => x.postId === postId);
    return post ? post.like.some(like => like.userId === this.loggedinUser.id && like.isLiked) : false;
  }
   
  postLikes(postId:number){
    const post = this.posts.find(x => x.postId === postId);
    return post ? post.like.filter(like => like.isLiked).length : 0;
  }

  hasUserLiked(postId: number): boolean {
    const post = this.posts.find(x => x.postId === postId);
    return post ? post.like.some(like => like.userId === this.loggedinUser.id && like.isLiked) : false;
}



//Image upload
onFileSelected(file: any) {
  if (file.target.files && file.target.files[0]) {
    let reader = new FileReader();
    reader.readAsDataURL(file.target.files[0]);
    reader.onload = (_event) => {
      this.postImageUrl = reader.result;
    };
  }
}

}
