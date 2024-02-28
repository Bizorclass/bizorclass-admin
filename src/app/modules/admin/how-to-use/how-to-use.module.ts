import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { HowToUseComponent } from './how-to-use.component';

const howToUseRoutes: Route[] = [
    {
        path: '',
        component: HowToUseComponent
    }
];

@NgModule({
    declarations: [
        HowToUseComponent
    ],
    imports: [
        RouterModule.forChild(howToUseRoutes),
        SharedModule,
        MatButtonModule,
        MatIconModule
    ]
})
export class HowToUseModule {
}
