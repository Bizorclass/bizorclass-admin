import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { studentsComponent } from './students.component';
import { SharedModule } from 'app/shared/shared.module';
import { FuseCardModule } from '@fuse/components/card';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

const studentsRoutes: Route[] = [
    {
        path: '',
        component: studentsComponent
    },
    {
        path: ':studentId',
        component: StudentDetailsComponent
    }
];

@NgModule({
    declarations: [
        studentsComponent,
        StudentDetailsComponent
    ],
    imports: [
        RouterModule.forChild(studentsRoutes),
        FuseCardModule,
        InfiniteScrollModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatTooltipModule,
        MatSelectModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        SharedModule
    ]
})
export class StudentsModule {
}
