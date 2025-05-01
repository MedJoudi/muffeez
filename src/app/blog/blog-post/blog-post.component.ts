import { Component, OnInit,  ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

import { AnalyticsService } from '../../services/analytics/analytics.service';


@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
  encapsulation: ViewEncapsulation.None
  
})
export class BlogPostComponent implements OnInit {
  postId: string = '';
  postContent: SafeHtml = '';
  postMetadata: any = {};
  loading: boolean = true;
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private titleService: Title,
    private analyticsService: AnalyticsService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.postId = params['id'];
      this.loadPost();
    });
  }

// blog-post.component.ts (updated version)
loadPost() {
  this.loading = true;
  this.error = false;

  this.http.get(`/assets/blog/posts/${this.postId}.md`, { responseType: 'text' })
    .subscribe({
      next: (content) => {
        // First extract metadata
        const { metadata, cleanContent } = this.extractMetadata(content);
        this.postMetadata = metadata;
        
        // Then parse only the content part (after metadata)
        this.postContent = this.sanitizer.bypassSecurityTrustHtml(
          marked.parse(cleanContent)
        );
        
        this.loading = false;
        this.analyticsService.sendAnalyticEvent(`view_blog_${this.postId}`, 'blog', 'view');
        
        // Set document title
        if (this.postMetadata.title) {
          this.titleService.setTitle(`Marouen Kachroudi | ${this.postMetadata.title}`);
        }
      },
      error: (err) => {
        console.error('Error loading blog post:', err);
        this.error = true;
        this.loading = false;
      }
    });
}

private extractMetadata(content: string): { metadata: any, cleanContent: string } {
  const result = {
    metadata: {
      title: 'Untitled Post',
      date: new Date().toISOString(),
      tags: []
    },
    cleanContent: content
  };

  // Match YAML front matter
  const metadataMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  
  if (metadataMatch) {
    const metadataStr = metadataMatch[1];
    result.cleanContent = metadataMatch[2];
    
    // Parse metadata
    result.metadata = metadataStr.split('\n').reduce((acc, line) => {
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
          acc[key] = value.slice(1, -1)
            .split(',')
            .map(item => item.trim().replace(/^['"](.*)['"]$/, '$1'));
        } else {
          acc[key] = value.split(',')
            .map(item => item.trim());
        }
      } else {
        acc[key] = value;
      }
      
      return acc;
    }, result.metadata);
  }

  return result;
}

  navigateBack() {
    this.router.navigate(['/blog']);
  }
}