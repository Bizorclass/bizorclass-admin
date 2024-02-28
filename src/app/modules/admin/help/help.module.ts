import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { HelpComponent } from './help.component';

const helpRoutes: Route[] = [
    {
        path: '',
        component: HelpComponent
    }
];

@NgModule({
    declarations: [
        HelpComponent
    ],
    imports: [
        RouterModule.forChild(helpRoutes),
        SharedModule,
        MatButtonModule,
        MatIconModule
    ]
})
export class HelpModule {
}
