import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'app/modules/auth/auth.service';
import { ApiService } from 'app/services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { TransferStudentComponent } from './trasfer-student/transfer-student.component';
import { UntypedFormControl } from '@angular/forms';

@Component({
    selector: 'classes',
    templateUrl: './classes.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ClassesComponent implements OnInit {

    user = null;
    // displayedColumns: string[] = ['index', 'student_name', 'teacher_name', 'start_date', 'end_date','start_time', 'end_time', 'actions'];
    displayedColumns: string[] = ['index', 'student_name', 'student_email','teacher_name', 'start_date', 'end_date','start_time', 'end_time', 'actions'];
    dataSourceServer = [];
    dataSource = [];
    isLoading: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(private apiService: ApiService, private _authService: AuthService, public dialog: MatDialog) {
        this._authService.user.pipe((takeUntil(this._unsubscribeAll))).subscribe((user: any) => {
            // console.log({ user });
            this.user = user;
            this.getAllOrdersFromServer();
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



    getAllOrdersFromServer() {
        this.isLoading = true;
        this.apiService.getAllOngoingOrder().subscribe(async (getAllOrdersByTeacherIdResponse: any) => {
            console.log(getAllOrdersByTeacherIdResponse);
            if (getAllOrdersByTeacherIdResponse.data) {
                let _scheduleArray = getAllOrdersByTeacherIdResponse.data;
                const _dataSource = _scheduleArray.map((m, i) => ({
                    ...m,
                    index: i + 1,
                    student_name: `${m?.student_id?.first_name} ${m?.student_id?.last_name}`,
                    student_email: m?.student_id?.email,
                    teacher_name: `${m?.teacher_id?.first_name || "_"} ${m?.teacher_id?.last_name || "_"}`,
                    date: new Date(m.date).toDateString() || "__/__/____",
                    start_date: new Date(m.start_date).toDateString() || "__/__/____",
                    end_date: new Date(m.end_date).toDateString() || "__/__/____",
                }))
                this.dataSourceServer = _dataSource;
                this.dataSource = _dataSource;
                console.log(this.dataSource);
            } else {
                // !! error handle
            }
            this.isLoading = false;
        }, (err) => {
            console.log(err);
            this.isLoading = false;
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
    //             this.getAllOrdersFromServer();
    //         }
    //     });

    // }

    clickOnChangeTeacher(_order) {
        console.log(_order);

        const dialogRef = this.dialog.open(TransferStudentComponent, {
            // width: 'min(400px, 90%)',
            width: '100%',
            data: _order
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            console.log({ result });
            if (result?.flag) {
                this.getAllOrdersFromServer();
            }
        });
    }
}
