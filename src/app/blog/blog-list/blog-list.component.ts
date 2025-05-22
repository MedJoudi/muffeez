import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  posts: any[] = [];
  archiveData: any[] = [];
  activeFilter: string | null = null;
  loading = true;
  error = false;
  postsPerPage = 6;
  currentPage = 1;

  // ➕ Added for Categories section
  uniqueTags: string[] = [];
  tagCounts: { [tag: string]: number } = {};

  constructor(private http: HttpClient, private titleService: Title, private router: Router) {}

  ngOnInit(): void {
    this.titleService.setTitle('Marouen Kachroudi | Blog');
    this.loadPosts();
  }

  loadPosts(): void {
    this.http.get<any[]>('/assets/blog/posts.json').subscribe({
      next: (data) => {
        this.posts = data;

        const archiveMap: { [key: string]: { monthYear: string; count: number } } = {};

        data.forEach(post => {
          const date = new Date(post.date);
          const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
          const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

          if (!archiveMap[dateKey]) {
            archiveMap[dateKey] = { monthYear, count: 0 };
          }

          archiveMap[dateKey].count++;
        });

        this.archiveData = Object.entries(archiveMap).map(([dateKey, { monthYear, count }]) => ({
          dateKey,
          monthYear,
          count
        }));

        // ➕ Extract unique tags and counts for Categories section
        const tagSet = new Set<string>();
        const tagMap: { [tag: string]: number } = {};

        data.forEach(post => {
          if (Array.isArray(post.tags)) {
            post.tags.forEach(tag => {
              tagSet.add(tag);
              tagMap[tag] = (tagMap[tag] || 0) + 1;
            });
          }
        });

        this.uniqueTags = Array.from(tagSet).sort();
        this.tagCounts = tagMap;

        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  filterPosts(filter: string | null): void {
    this.activeFilter = filter;
    this.currentPage = 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

hasMorePosts(): boolean {
  const filtered = !this.activeFilter
    ? this.posts
    : this.posts.filter(post => {
        const date = new Date(post.date);
        const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        return dateKey === this.activeFilter || (post.tags && post.tags.includes(this.activeFilter));
      });

  return filtered.length > this.currentPage * this.postsPerPage;
}


  loadMore(): void {
    this.currentPage++;
  }

  goToPost(postId: string): void {
    this.router.navigate(['/blog', postId]);
  }

  getFilteredPosts(): any[] {
    const filtered = !this.activeFilter
      ? this.posts
      : this.posts.filter(post => {
          const date = new Date(post.date);
          const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          return dateKey === this.activeFilter || (post.tags && post.tags.includes(this.activeFilter));
        });

    return filtered.slice(0, this.currentPage * this.postsPerPage);
  }
}
