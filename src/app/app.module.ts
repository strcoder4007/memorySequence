import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './app.component';
import {Collapse} from './collapse.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    Collapse,
    SearchComponent
  ],
  imports: [
      FormsModule,
      BrowserModule, 
      ReactiveFormsModule,
      HttpModule,
      Ng2SearchPipeModule,
      RouterModule.forRoot([
          /*
        {
            path: '',
            redirectTo: '/home',
            pathMatch: 'full'
        },
        {path: 'memories', component: MemoriesComponent},
        {path: 'home', component: AppComponent}
        */
      ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
