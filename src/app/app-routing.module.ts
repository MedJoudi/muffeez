import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BlogListComponent } from './blog/blog-list/blog-list.component';
import { BlogPostComponent } from './blog/blog-post/blog-post.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'blog',
    children: [
      { path: '', component: BlogListComponent }, // matches /blog
      { path: ':id', component: BlogPostComponent } // matches /blog/:id
    ]
  },
  { path: '**', redirectTo: '' } // Keep this last
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    relativeLinkResolution: 'legacy',
    initialNavigation: 'enabledBlocking' // Add this for better SSR-like behavior
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
