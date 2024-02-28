import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'app/modules/auth/auth.service';
import { ApiService } from 'app/services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';

@Component({
    selector: 'subscribed-student',
    templateUrl: './subscribed-student.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SubscribedStudentComponent implements OnInit {

    user = null;
    displayedColumns: string[] = ['index', 'student_name', 'student_email', 'teacher_name', 'subscription', 'schedule_type', 'subscription_type', 'view_details'];
    dataSourceServer = [];
    dataSource = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(private apiService: ApiService, private _authService: AuthService, public dialog: MatDialog) {
        this._authService.user.pipe((takeUntil(this._unsubscribeAll))).subscribe((user: any) => {
            // console.log({ user });
            this.user = user;
                this.getAllScheduleFromServer();
        });
    }

    ngOnInit(): void {
        this.searchInputControl.valueChanges.subscribe(query => {
            // console.log({query});
            // console.log(this.teacherServerList.map(m => ({...m, name: m.first_name+" "+m.last_name})).filter(f => f.name.includes(query)));

            this.dataSource = this.dataSourceServer.map(m => ({...m, name: `${m?.student_id?.first_name} ${m?.student_id?.last_name}`.toLowerCase()})).filter(f => f.name.includes(query.toLowerCase()));
        })
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    getAllScheduleFromServer() {
        this.apiService.getAllTeacherSubscribersStudent().subscribe(async (getAllScheduleByTeacherIdResponse: any) => {
            console.log(getAllScheduleByTeacherIdResponse);
            if (getAllScheduleByTeacherIdResponse.data) {
                let _scheduleArray = getAllScheduleByTeacherIdResponse.data;
                const _dataSource = _scheduleArray.map((m, i) => ({
                    ...m,
                    index: i+1,
                    student_name: `${m?.student_id?.first_name} ${m?.student_id?.last_name}`,
                    student_email: m?.student_id?.email,
                    subscription: m.subscription_plan_id.title,
                    schedule_type: m.subscription_plan_id.schedule_type || "-",
                    subscription_type: m.subscription_plan_id.subscription_type || "-",
                    teacher_name: `${m?.teacher_id?.first_name || "_"} ${m?.teacher_id?.last_name || "_"}`,
                    start_time: m?.schedule_id?.start_time || '--',
                    end_time: m?.schedule_id?.end_time || '--',
                }))
                this.dataSourceServer = _dataSource;
                this.dataSource = _dataSource;
                console.log(this.dataSource);
            } else {
                // !! error handle
            }
        }, (err) => {
            console.log(err);
        });
    }

    // createSchedule() {
    //     const dialogRef = this.dialog.open(ScheduleDetailsComponent, {
    //         width: '250px',
    //         data: { start_time: "", end_time: "", teacher_id: this.user.teacher_id }
    //     });

    //     dialogRef.afterClosed().subscribe(result => {
    //         console.log('The dialog was closed');
    //         console.log({ result });
    //         if (result?.flag) {
    //             this.getAllScheduleFromServer();
    //         }
    //     });

    // }
}
