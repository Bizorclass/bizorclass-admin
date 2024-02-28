import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { TermsConditionsComponent } from './terms-conditions.component';

const termsConditionsRoutes: Route[] = [
    {
        path: '',
        component: TermsConditionsComponent
    }
];

@NgModule({
    declarations: [
        TermsConditionsComponent
    ],
    imports: [
        RouterModule.forChild(termsConditionsRoutes),
        SharedModule,
        MatButtonModule,
        MatIconModule
    ]
})
export class TermsConditionsModule {
}
