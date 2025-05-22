import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as AOS from 'aos';
import { Title, Meta } from '@angular/platform-browser';
import { LanguageService } from "src/app/services/language/language.service";
import DisableDevtool from 'disable-devtool';
import { ProtectionModalComponent } from './protection-modal/protection-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'marouen-portfolio';

  @ViewChild(ProtectionModalComponent) protectionModal!: ProtectionModalComponent;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.languageService.initLanguage();

    this.titleService.setTitle("Marouen Kachroudi");
    this.metaService.addTags([
      { name: 'keywords', content: 'Frontend, MEAN Stack Developer , MERN Stack Development , Software Engineer, software, developer' },
      { name: 'description', content: 'As a software engineer with expertise in both MEAN and MERN stacks, I have a comprehensive understanding of full-stack web development. My strong foundation in JavaScript allows me to effectively work with front-end technologies such as Angular and React, as well as back-end technologies such as Node.js and Express.' },
    ]);

    AOS.init();

    DisableDevtool({
      url: 'https://mkachroudi.org',
      tkName: 'bypassToken',
      disableMenu: true,
      clearLog: true,
      detectors: [0, 1, 2, 3, 4, 5, 6, 7],
      ondevtoolopen(type, next) {
        console.log('DevTools opened with type:', type);
        next();
      },
      ignore: [/\/admin/]
    });
  }

  ngAfterViewInit(): void {
  // Delay to ensure modal is initialized by child component
    setTimeout(() => {
      // Right-click
      window.addEventListener('contextmenu', (e: MouseEvent) => {
        e.preventDefault();
        this.protectionModal?.show();
      });

      // Ctrl + C
      window.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'c') {
          e.preventDefault();
          this.protectionModal?.show();
        }
      });
    }, 100); // small delay to allow modal initialization
  }
}
