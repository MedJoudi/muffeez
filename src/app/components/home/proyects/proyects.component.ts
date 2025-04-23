import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.scss']
})
export class ProyectsComponent implements OnInit {

  recentPosts: any[] = [];

  customOptions: any = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: { items: 1 },
      400: { items: 1 },
      740: { items: 1 },
      940: { items: 1 }
    },
    nav: true
  };

  @ViewChild('imgContainer') imgContainer: ElementRef;


  constructor(
    public analyticsService: AnalyticsService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRecentBlogPosts();
  }

  goToPost(id: string) {
    this.router.navigate(['/blog', id]);
  }

  goToBlog(): void {
    this.router.navigate(['/blog']);
  }

  loadRecentBlogPosts(): void {
    this.http.get<any[]>('assets/blog/posts.json').subscribe(posts => {
      const sorted = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      this.recentPosts = sorted.slice(0, 2).map(post => ({
        id: post.id,
        Title: post.title,
        Description: post.summary,
        imgs: post.image,
        Technologies: post.tags,
        Date: post.date
      }));
    });
  }

debug(){

  this.imgContainer.nativeElement.scroll({
    top: this.imgContainer.nativeElement.scrollHeight,
    left: 0,
    behavior: 'smooth',    
  });
}

}
