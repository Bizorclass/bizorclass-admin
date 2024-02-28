import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'app/modules/auth/auth.service';
import { ApiService } from 'app/services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { SubscriptionPlanDetailsComponent } from './details/details.component';

@Component({
    selector: 'subscription-plan',
    templateUrl: './subscription-plan.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SubscriptionPlanComponent implements OnInit {

    user = null;
    displayedColumns: string[] = ['index', 'title', 'duration_days', 'schedule_type', 'subscription_type', 'price', 'course', 'actions'];
    dataSourceServer = [];
    dataSource = [];
    courseList = [];

    searchInputControl: UntypedFormControl = new UntypedFormControl();

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private apiService: ApiService, private _authService: AuthService, public dialog: MatDialog) {
        this._authService.user.pipe((takeUntil(this._unsubscribeAll))).subscribe((user: any) => {
            // console.log({ user });
            this.user = user;
            this.getAllSubscriptionsFromServer();
            this.getAllCoursesFromServer();
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    ngOnInit(): void {
        this.searchInputControl.valueChanges.subscribe(query => {
            console.log({ query });
            // console.log(this.teacherServerList.map(m => ({...m, name: m.first_name+" "+m.last_name})).filter(f => f.name.includes(query)));

            this.dataSource = this.dataSourceServer.filter(f => f.title.toLowerCase().includes(query.toLowerCase()));
        })
    }

    getAllSubscriptionsFromServer() {
        this.apiService.getAllSubscriptions().subscribe(async (getAllSubscriptionsResponse: any) => {
            // console.log(getAllSubscriptionsResponse);
            if (getAllSubscriptionsResponse.data) {
                let _scheduleArray = getAllSubscriptionsResponse.data;
                this.dataSourceServer = _scheduleArray.map((m, i) => ({ ...m, index: i + 1 }));
                this.dataSource = _scheduleArray.map((m, i) => ({ ...m, index: i + 1 }));
                console.log(this.dataSource);
            } else {
                // !! error handle
            }
        }, (err) => {
            console.log(err);
        });
    }

    getAllCoursesFromServer() {
        this.apiService.getAllActiveCourseWithSubject().subscribe(async (getAllSubjectCourseResponse: any) => {
            // console.log(getAllSubjectCourseResponse);
            //todo update Object
            if (getAllSubjectCourseResponse.data) {
                let _courseList = getAllSubjectCourseResponse.data;
                this.courseList = [..._courseList];

                console.log("this.courseList => ", this.courseList);
            }
        }, (err) => {
            console.log(err);
        });
    }

    createSchedule() {
        const dialogRef = this.dialog.open(SubscriptionPlanDetailsComponent, {
            width: 'min(350px, 90%)',
            panelClass: ['modal-min-height-90-percent'],
            data: {
                subscriptionData: {
                    title: "",
                    duration_days: "",
                    price: "",
                    schedule_type: "",
                    subscription_type: "",
                    course_id: "",
                },
                courseList: this.courseList
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            console.log({ result });
            if (result?.flag) {
                this.getAllSubscriptionsFromServer();
            }
        });

    }

    clickOnEdit(_planItem) {
        console.log(_planItem);
        const dialogRef = this.dialog.open(SubscriptionPlanDetailsComponent, {
            width: 'min(350px, 90%)',
            data: {
                subscriptionData: {
                    subscription_plan_id: _planItem.subscription_plan_id,

                    title: _planItem.title,
                    duration_days: _planItem.duration_days,
                    price: _planItem.price,
                    schedule_type: _planItem.schedule_type,
                    subscription_type: _planItem.subscription_type,
                    course_id: _planItem?.course_id?.course_id,
                },
                courseList: this.courseList
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed');
            // console.log({ result });
            if (result?.flag) {
                this.getAllSubscriptionsFromServer();
            }
        });
    }
}
