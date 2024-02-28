import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SubscribedStudentComponent } from 'app/modules/admin/subscribed-student/subscribed-student.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';;
import { SharedModule } from 'app/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

const subscribedStudentRoutes: Route[] = [
    {
        path: '',
        component: SubscribedStudentComponent
    }
];

@NgModule({
    declarations: [
        SubscribedStudentComponent
    ],
    imports: [
        RouterModule.forChild(subscribedStudentRoutes),
        MatTableModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        NgxMatTimepickerModule,
        SharedModule,
    ]
})
export class SubscribedStudentModule {
}
