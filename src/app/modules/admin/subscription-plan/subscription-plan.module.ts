import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SubscriptionPlanComponent } from 'app/modules/admin/subscription-plan/subscription-plan.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SubscriptionPlanDetailsComponent } from './details/details.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatSelectModule } from '@angular/material/select';

const subscriptionPlanRoutes: Route[] = [
    {
        path: '',
        component: SubscriptionPlanComponent
    }
];

@NgModule({
    declarations: [
        SubscriptionPlanComponent,
        SubscriptionPlanDetailsComponent
    ],
    imports: [
        RouterModule.forChild(subscriptionPlanRoutes),
        MatTableModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        NgxMatTimepickerModule,
        SharedModule,
        MatSelectModule,
    ]
})
export class SubscriptionPlanModule {
}
