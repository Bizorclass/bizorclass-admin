import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'app/services/api.service';

@Component({
    selector: 'fuse-confirmation-dialog',
    templateUrl: './details.component.html',
    styles: [
        `
            .fuse-confirmation-dialog-panel {

                @screen md {
                    @apply w-128;
                }

                .mat-mdc-dialog-container {

                    .mat-mdc-dialog-surface {
                        padding: 0 !important;
                    }
                }
            }
        `
    ],
    encapsulation: ViewEncapsulation.None
})
export class SubscriptionPlanDetailsComponent {

    subscriptionForm = this._formBuilder.group( {
        title: ["", [Validators.required]],
        duration_days: ["", [Validators.required]],
        price: ["", [Validators.required]],
        schedule_type: ["", [Validators.required]],
        subscription_type: ["", [Validators.required]],
        course_id: ["", [Validators.required]],
    });
    subscriptionData:any;
    courseList:any;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<SubscriptionPlanDetailsComponent>, private apiService: ApiService, private _formBuilder: UntypedFormBuilder) {
        this.subscriptionData = data?.subscriptionData;
        this.courseList = data?.courseList;

        console.log(this.subscriptionData);
        this.subscriptionForm.patchValue(this.subscriptionData);
    }


    saveSubscription() {
        const postObject = this.subscriptionForm.getRawValue();

        if (this.subscriptionData?.subscription_plan_id && this.subscriptionData?.subscription_plan_id !== "") {
            this.apiService.updateSubscriptionPlanById({...postObject, subscription_plan_id: this.subscriptionData?.subscription_plan_id}).subscribe(async (updateSubscriptionPlanResponse: any) => {
                console.log(updateSubscriptionPlanResponse);
                if (updateSubscriptionPlanResponse.data) {
                    this.closeModal(true);
                } else {
                    // !! error handle
                }
            }, (err) => {
                console.log(err);
            });
        } else {
            this.apiService.addSubscriptionPlan(postObject).subscribe(async (addSubscriptionPlanResponse: any) => {
                console.log(addSubscriptionPlanResponse);
                if (addSubscriptionPlanResponse.data) {
                    this.closeModal(true);
                } else {
                    // !! error handle
                }
            }, (err) => {
                console.log(err);
            });
        }
    }

    closeModal(_result) {
        this.dialogRef.close({flag: _result});
    }
}
