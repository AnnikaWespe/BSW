import 'reflect-metadata';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

import 'web-animations-js/web-animations.min';
import 'intl';
import 'intl/locale-data/jsonp/en';

platformBrowserDynamic().bootstrapModule(AppModule);

