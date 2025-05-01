// blog-list.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AnalyticsService } from '../../services/analytics/analytics.service';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
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

  constructor(
    private titleService: Title,
    private http: HttpClient,
    private router: Router,
    public analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.loadBlogPosts();
    this.titleService.setTitle(`Marouen Kachroudi | Blog`);
  }

  loadBlogPosts(): void {
    this.http.get<BlogPost[]>('assets/blog/posts.json').subscribe(
      posts => {
        this.posts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.loading = false;
      },
      error => {
        this.error = true;
        this.loading = false;
      }
    );
  }

  goToPost(id: string) {
    this.router.navigate(['/blog', id]);
  }
}