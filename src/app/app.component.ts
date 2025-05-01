import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { Title, Meta } from '@angular/platform-browser';
import { LanguageService } from "src/app/services/language/language.service"
//import DisableDevtool from 'disable-devtool';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'muffeez-portfolio';

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private languageService: LanguageService
  ) {
  }

  ngOnInit(): void {
    this.languageService.initLanguage();

    this.titleService.setTitle("Marouen Kachroudi");
    this.metaService.addTags([
      { name: 'keywords', content: 'Frontend, MEAN Stack Developer , MERN Stack Development , Software Engineer, software, developer' },
      { name: 'description', content: 'As a software engineer with expertise in both MEAN and MERN stacks, I have a comprehensive understanding of full-stack web development. My strong foundation in JavaScript allows me to effectively work with front-end technologies such as Angular and React, as well as back-end technologies such as Node.js and Express.' },
    ]);
    
    AOS.init();

    // Initialize disable-devtool with configuration
    //DisableDevtool({
      //url: 'https://mkachroudi.org', // Redirect URL when devtools is opened
      //tkName: 'bypassToken', // Bypass URL parameter name
      //disableMenu: false, // Disable right-click menu
      //clearLog: true, // Clear console logs
      //detectors: [0, 1, 2, 3, 4, 5, 6, 7], // All detectors enabled
      //ondevtoolopen(type, next) {
        // Custom action when devtools is opened
        //console.log('DevTools opened with type:', type);
        //next(); // This will close the window
      //},
      //ignore: [
        // Add routes or conditions where devtools should be allowed
        ///\/admin/ // Allow on admin routes
      //]
    //});
  }
}