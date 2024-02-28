import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { DashboardService } from 'app/modules/admin/dashboard/dashboard.service';
import { AuthService } from 'app/modules/auth/auth.service';
import { ApiService } from 'app/services/api.service';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {

    user: any;
    adminCount = "...";
    teacherCount = "...";
    studentCount = "...";
    revenue = "...";

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private _authService: AuthService, private _router: Router, private apiService: ApiService, private _changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this._authService.user.pipe((takeUntil(this._unsubscribeAll))).subscribe((user: any) => {
            // console.log({ user });
            this.user = user;
        });

        this.apiService.dashboardApiForAnalytics().subscribe(async (dashboardApiForAnalyticsResponse: any) => {
            console.log(dashboardApiForAnalyticsResponse);
            //todo update Object
            if (dashboardApiForAnalyticsResponse) {
                this.adminCount = dashboardApiForAnalyticsResponse?.adminCount;
                this.teacherCount = dashboardApiForAnalyticsResponse?.teacherCount;
                this.studentCount = dashboardApiForAnalyticsResponse?.studentCount;
                this.revenue = dashboardApiForAnalyticsResponse?.revenue;
                this._changeDetectorRef.markForCheck();
            }
        }, (err) => {
            console.log(err);
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
