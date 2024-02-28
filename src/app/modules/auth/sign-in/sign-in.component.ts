import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { ApiService } from 'app/services/api.service';
import { AuthService } from '../auth.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(private _activatedRoute: ActivatedRoute, private _authService: AuthService, private apiService: ApiService, private _formBuilder: UntypedFormBuilder, private _router: Router) { }

    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
        });
    }


    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;
        this.apiService.userLogin(this.signInForm.value).subscribe((res: any) => {
            console.log(res);

            if (res?.data) {
                this._authService.user = res?.data;
                const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/dashboard';
                this._router.navigateByUrl(redirectURL);
            } else {
                this.signInForm.enable();

                this.alert = {
                    type: 'error',
                    message: 'Wrong email or password'
                };

                // Show the alert
                this.showAlert = true;
                setTimeout(() => {
                    this.showAlert = false;
                }, 3000);
            }
        }, (err) => {
            console.log(err);

            this.signInForm.enable();

            // Reset the form
            this.signInNgForm.resetForm();

            // Set the alert
            this.alert = {
                type: 'error',
                message: 'Wrong email or password'
            };

            // Show the alert
            this.showAlert = true;
            setTimeout(() => {
                this.showAlert = false;
            }, 3000);
        });

        // setTimeout(() => {
        //     let rawUser = {
        //         admin_d: "admin1233",
        //         first_name: "Super",
        //         last_name: "Admin",
        //         email: "admin@gmail.com",
        //         is_super_admin: true,
        //         photo_url: "https://statinfer.com/wp-content/uploads/dummy-user.png"
        //     }
        //     this._authService.user = rawUser;
        //     const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/dashboard';
        //     this._router.navigateByUrl(redirectURL);
        // }, 2000);
    }
}
