import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BlogListComponent } from './blog/blog-list/blog-list.component';
import { BlogPostComponent } from './blog/blog-post/blog-post.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'blog', component: BlogListComponent },
  { path: 'blog/:id', component: BlogPostComponent },
  { path: '**', pathMatch: 'full', redirectTo: '/' } // This should be LAST
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'corrected' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
