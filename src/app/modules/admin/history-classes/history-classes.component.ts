import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'app/modules/auth/auth.service';
import { ApiService } from 'app/services/api.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'history-classes',
    templateUrl: './history-classes.component.html',
    encapsulation: ViewEncapsulation.None
})
export class HistoryClassesComponent {

    user = null;
    displayedColumns: string[] = ['index', 'student_name', 'teacher_name', 'date', 'start_time', 'end_time'];
    dataSource = [];
    isLoading: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private apiService: ApiService, private _authService: AuthService, public dialog: MatDialog) {
        this._authService.user.pipe((takeUntil(this._unsubscribeAll))).subscribe((user: any) => {
            // console.log({ user });
            this.user = user;
            this.getAllHistoryOrderFromServer();
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }



    getAllHistoryOrderFromServer() {
        this.isLoading = true;
        this.apiService.getAllHistoryOrder().subscribe(async (getAllOrdersByTeacherIdResponse: any) => {
            console.log(getAllOrdersByTeacherIdResponse);
            if (getAllOrdersByTeacherIdResponse.data) {
                let _scheduleArray = getAllOrdersByTeacherIdResponse.data;
                this.dataSource = _scheduleArray.map((m, i) => ({
                    ...m,
                    index: i + 1,
                    student_name: `${m?.student_id?.first_name || "_"} ${m?.student_id?.last_name || "_"}`,
                    teacher_name: `${m?.teacher_id?.first_name || "_"} ${m?.teacher_id?.last_name || "_"}`,
                    date: new Date(m.date).toDateString() || "__/__/____",
                    start_time: m?.start_time || '--',
                    end_time: m?.end_time || '--',
                }))
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
    //             this.getTodayAllOrdersByTeacherIdFromServer();
    //         }
    //     });

    // }
}
