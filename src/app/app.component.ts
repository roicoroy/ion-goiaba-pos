import { Component, inject } from '@angular/core';
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
export class AppComponent {

  private medusaApi = inject(MedusaService);
  private readonly store = inject(Store);
  private icons = inject(IconsService);
  private navigation = inject(NavigationService);
  private startService = inject(MedusaStartService);
  private language = inject(LanguageService);

  constructor() { }


  async ngOnInit(): Promise<void> {
    this.startService.medusaInit();
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
