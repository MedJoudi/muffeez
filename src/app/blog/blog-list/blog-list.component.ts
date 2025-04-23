import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  summary: string;
}

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  posts: BlogPost[] = [];
  loading = true;
  error = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<BlogPost[]>('/assets/blog/posts.json').subscribe(
      posts => {
        this.posts = posts;
        this.loading = false;
      },
      error => {
        this.error = true;
        this.loading = false;
      }
    );
  }
}