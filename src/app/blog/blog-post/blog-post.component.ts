import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { AnalyticsService } from '../../services/analytics/analytics.service';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent implements OnInit {
  postId: string = '';
  postContent: string = '';
  postMetadata: any = {};
  loading: boolean = true;
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private titleService: Title,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.postId = params['id'];
      this.loadPost();
    });
  }

  loadPost() {
    this.loading = true;
    this.error = false;

    // Load post content
    this.http.get(`/assets/blog/posts/${this.postId}.md`, { responseType: 'text' })
      .subscribe({
        next: (content) => {
          this.postContent = content;
          this.extractMetadata(content);
          this.loading = false;
          this.analyticsService.sendAnalyticEvent(`view_blog_${this.postId}`, 'blog', 'view');
        },
        error: (err) => {
          console.error('Error loading blog post:', err);
          this.error = true;
          this.loading = false;
        }
      });
  }

  private extractMetadata(content: string) {
    // This regex matches the YAML front matter and captures both metadata and content separately
    const metadataMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    
    if (metadataMatch) {
      const metadataStr = metadataMatch[1];
      // This is the critical fix - we only use the content AFTER the metadata
      this.postContent = metadataMatch[2]; 
      
      // Parse metadata
      this.postMetadata = metadataStr.split('\n').reduce((acc, line) => {
        if (!line.trim()) return acc;
        
        const separatorIndex = line.indexOf(':');
        if (separatorIndex === -1) return acc;
        
        const key = line.slice(0, separatorIndex).trim();
        let value = line.slice(separatorIndex + 1).trim();
        
        // Remove surrounding quotes while preserving internal ones
        value = value.replace(/^['"](.*)['"]$/, '$1');
        
        // Handle tags array
        if (key === 'tags') {
          if (value.startsWith('[') && value.endsWith(']')) {
            // Array format: ["tag1", "tag2"]
            acc[key] = value.slice(1, -1)
              .split(',')
              .map(item => item.trim().replace(/^['"](.*)['"]$/, '$1'));
          } else {
            // String format: tag1, tag2
            acc[key] = value.split(',')
              .map(item => item.trim());
          }
        } else {
          acc[key] = value;
        }
        
        return acc;
      }, {} as any);
      
      // Set document title
      if (this.postMetadata.title) {
        this.titleService.setTitle(`${this.postMetadata.title} | Your Site Name`);
      }
    } else {
      // If no metadata found, use entire content and set defaults
      this.postContent = content;
      this.postMetadata = {
        title: 'Untitled Post',
        date: new Date().toISOString(),
        tags: []
      };
    }
  }

  navigateBack() {
    this.router.navigate(['/blog']);
  }
}