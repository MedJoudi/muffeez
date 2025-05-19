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
  allPosts: any[] = [];
  filteredPosts: any[] = [];
  posts: any[] = [];
  archiveData: { dateKey: string; monthYear: string; count: number }[] = [];
  activeFilter: string | null = null;
  loading = false;
  error = false;

  readonly PAGE_SIZE = 6;
  currentPage = 1;

  constructor(
    private http: HttpClient,
    private router: Router,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Marouen Kachroudi | Blog');
    this.loadPosts();
  }

  private loadPosts(): void {
    this.loading = true;
    this.error = false;

    this.http.get<any[]>('/assets/blog/posts.json').subscribe({
      next: (data) => {
        this.allPosts = data;
        this.filteredPosts = data;
        this.archiveData = this.generateArchiveData(data);
        this.resetPagination();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  filterPosts(dateKey: string | null): void {
    this.activeFilter = dateKey;

    if (!dateKey) {
      this.filteredPosts = this.allPosts;
    } else {
      this.filteredPosts = this.allPosts.filter(post => {
        const postDate = new Date(post.date);
        const postKey = `${postDate.getFullYear()}-${(postDate.getMonth() + 1).toString().padStart(2, '0')}`;
        return postKey === dateKey;
      });
    }

    this.resetPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private resetPagination(): void {
    this.currentPage = 1;
    this.posts = this.filteredPosts.slice(0, this.PAGE_SIZE);
  }

  loadMore(): void {
    this.currentPage++;
    const nextPosts = this.filteredPosts.slice(0, this.PAGE_SIZE * this.currentPage);
    this.posts = nextPosts;
  }

  hasMorePosts(): boolean {
    return this.posts.length < this.filteredPosts.length;
  }

  private generateArchiveData(posts: any[]): { dateKey: string; monthYear: string; count: number }[] {
    const archiveMap = new Map<string, number>();

    posts.forEach(post => {
      const date = new Date(post.date);
      const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      archiveMap.set(dateKey, (archiveMap.get(dateKey) || 0) + 1);
    });

    return Array.from(archiveMap.entries()).map(([dateKey, count]) => {
      const [year, month] = dateKey.split('-');
      const monthYear = new Date(+year, +month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
      return { dateKey, monthYear, count };
    }).sort((a, b) => b.dateKey.localeCompare(a.dateKey));
  }

  goToPost(postId: string): void {
    this.router.navigate(['/blog', postId]);
  }
}
