import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { MemoryComponent } from './memory/memory.component';
import { LoginComponent } from './login/login.component';
import { MemoriesComponent } from './memories/memories.component';
import { BooksComponent } from './books/books.component';

const appRoutes: Routes = [
    { path: '', component: MemoriesComponent},
    { path: 'memory/:id', component: MemoryComponent},
    { path: 'memseq/memory/:id', component: MemoryComponent},
    {   path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    MemoryComponent,
    LoginComponent,
    MemoriesComponent,
    BooksComponent
  ],
  imports: [
      FormsModule,
      BrowserModule,
      ReactiveFormsModule,
      HttpModule,
      RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
