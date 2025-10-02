import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { MedusaService } from './shared';
import { IconsService } from './shared/icons/icons.service';
import { LanguageService } from './shared/language/language.service';
import { NavigationService } from './shared/navigation/navigation.service';
import { MedusaStartService } from './shared/start/medusa-start.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  private medusaApi = inject(MedusaService);
  private readonly store = inject(Store);
  private icons = inject(IconsService);
  private navigation = inject(NavigationService);
  private startService = inject(MedusaStartService);
  private language = inject(LanguageService);

  constructor() {
    this.startService.medusaInit();
  }

  async ngOnInit(): Promise<void> {
    await this.initializeApp();
  }

  async initializeApp() {
    try {
      this.icons.initIcons();
      this.language.initTranslate();
    } catch (err) {
      console.log('This is normal in a browser', err);
    }
  }
}
