import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AdminsListComponent } from 'app/modules/admin/admins/list/list.component';
import { AdminsService } from 'app/modules/admin/admins/admins.service';
import { passwordValidator } from 'app/shared/password.validator';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from 'app/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector       : 'admins-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminsDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;

    editMode: boolean = false;

    admin_id = null;
    adminObject: any;
    adminForm: UntypedFormGroup;
    avatarObject = null;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _adminsListComponent: AdminsListComponent,
        private apiService: ApiService,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private domSanitizer: DomSanitizer,
        private toastr: ToastrService
    ) {
        this._activatedRoute.params.subscribe(params => {
            this.admin_id = params["id"];
            if (this.admin_id === "createAdmin") {
                this.toggleEditMode(true);
            } else {
                this.getAdminFromServer();
            }
        });
    }

    ngOnInit(): void {
        // Open the drawer
        this._adminsListComponent.matDrawer.open();

        // Create the adminObject form
        this.adminForm = this._formBuilder.group({
            first_name : ["", Validators.required],
            last_name  : ["", Validators.required],
            email      : ["", [Validators.required, Validators.email]],
            password   : ["", passwordValidator()]
        });


    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    getAdminFromServer() {
        //todo get Admin From server query (this.admin_id)

        // let obj = {
        //     admin_id: "abc",
        //     first_name: "Pankaj",
        //     last_name: "Agade",
        //     email: "pankaj@gmail.com",
        //     photo_url: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"
        // }
        // this.adminObject = {...obj};
        this.apiService.getAdminById(this.admin_id).subscribe(async (getAdminByIdResponse: any) => {
            console.log(getAdminByIdResponse);
            //todo update Object
            if (getAdminByIdResponse.data) {
                this.adminObject = {...getAdminByIdResponse.data};
                this._changeDetectorRef.markForCheck();
            }
        }, (err) => {
            console.log(err);
        });
    }

    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._adminsListComponent.matDrawer.close();
    }

    toggleEditMode(editMode: boolean | null = null): void
    {
        if ( editMode === null ) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
            if (this.adminObject) {
                this.adminForm.patchValue({...this.adminObject});
                this.adminForm.get('email')?.disable();
                this.adminForm.removeControl("password");
            }
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    async updateContact(): Promise<void> {
        // Get the adminObject object
        const adminObject = this.adminForm.getRawValue();

        if (this.admin_id === "createAdmin" && adminObject) { //* for Add Admin
            console.log(adminObject);
            //todo add Admin query
            this.apiService.registrationAdmin({email: adminObject.email, password: adminObject.password}).subscribe((res: any) => {
                console.log(res);
                //todo update Object
                if (res.data) {
                    let postObject = {
                        admin_id: res.data.admin_id,
                        first_name: this.capitalizeFirstLetter(adminObject.first_name),
                        last_name: this.capitalizeFirstLetter(adminObject.last_name),
                    };
                    this.updateAdminQuery(postObject, true);
                } else {
                    // alert(res?.error?.message);
                    if (res?.error?.message === "Email address already registered by another user") {
                        this.adminForm.get("email").setErrors({serverError: res?.error?.message});
                        this._changeDetectorRef.markForCheck();
                    }
                }
            }, (err) => {
                console.log(err);
            });


        } else {  //* for update admin

            let postObject = {
                admin_id: this.admin_id,
                first_name: this.capitalizeFirstLetter(adminObject.first_name),
                last_name: this.capitalizeFirstLetter(adminObject.last_name),
            };
            this.updateAdminQuery(postObject, false);
        }

        // this.toggleEditMode(false);
    }

    updateAdminQuery(postObject: any, isNewAdmin:boolean) {
        this.apiService.updateAdmin(postObject).subscribe(async (res: any) => {
            console.log(res);
            //todo update Object
            if (res.data) {
                if (this.avatarObject) {
                    //todo add photo Admin query
                    const file:any = await this.convertImageFileToWebpFile(this.avatarObject);
                    let bodyForUploadImage = new FormData();
                    bodyForUploadImage.append('photo', file, `${res.data.admin_id}.webp`);
                    bodyForUploadImage.append('id', res.data.admin_id);
                    this.apiService.adminUploadImage(bodyForUploadImage).subscribe(async (updateAdminResponse: any) => {
                        console.log(updateAdminResponse);
                        //todo update Object
                        if (updateAdminResponse.data) {
                            this.toggleEditMode(false);
                            this._router.navigate(['../', res.data.admin_id], {relativeTo: this._activatedRoute});
                            this._changeDetectorRef.markForCheck();
                        }
                    }, (err) => {
                        console.log(err);
                    });
                }
            }

            if (isNewAdmin) {
                this.toastr.success('Admin created successfully!', '', { timeOut: 3000, positionClass: 'toast-top-center' });
            } else {
                this.toastr.success('Admin update successfully!', '', { timeOut: 3000, positionClass: 'toast-top-center' });
            }


        }, (err) => {
            console.log(err);
        });
    }

    deleteContact(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete adminObject',
            message: 'Are you sure you want to delete this adminObject? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {
                // // Get the current adminObject's id
                // const id = this.adminObject.id;

                // // Get the next/previous adminObject's id
                // const currentContactIndex = this.admins.findIndex(item => item.id === id);
                // const nextContactIndex = currentContactIndex + ((currentContactIndex === (this.admins.length - 1)) ? -1 : 1);
                // const nextContactId = (this.admins.length === 1 && this.admins[0].id === id) ? null : this.admins[nextContactIndex].id;

                // // Delete the adminObject
                // this._adminsService.deleteContact(id)
                //     .subscribe((isDeleted) => {

                //         // Return if the adminObject wasn't deleted...
                //         if ( !isDeleted )
                //         {
                //             return;
                //         }

                //         // Navigate to the next adminObject if available
                //         if ( nextContactId )
                //         {
                //             this._router.navigate(['../', nextContactId], {relativeTo: this._activatedRoute});
                //         }
                //         // Otherwise, navigate to the parent
                //         else
                //         {
                //             this._router.navigate(['../'], {relativeTo: this._activatedRoute});
                //         }

                //         // Toggle the edit mode off
                //         this.toggleEditMode(false);
                //     });

                // // Mark for check
                // this._changeDetectorRef.markForCheck();
            }
        });

    }

    goBack() {
        this._router.navigate(['../'], {relativeTo: this._activatedRoute});
    }

    uploadAvatar(fileList: FileList): void {
        // Return if canceled
        if ( !fileList.length ) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        if ( !allowedTypes.includes(file.type) ) {
            return;
        }

        console.log("file -> ", file);
        this.avatarObject = file;
    }


    removeAvatar(): void {

    }

    imageFileTOString(_fileObj) {
        if (typeof _fileObj === "string") {
          return _fileObj;
        } else {
          let _str: any = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(_fileObj));
        //   console.log(_str);
          return _str;
        }
    }

    capitalizeFirstLetter(str: string) {
        return str[0].toUpperCase() + str.slice(1).toLowerCase();
    }

    convertImageFileToWebpFile(file) {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            canvas.getContext('2d').drawImage(image, 0, 0);
            canvas.toBlob((blob) => {
              let myFile = new File([blob], 'my-new-group-image.webp', {
                type: blob.type,
              });
              resolve(myFile);
            }, 'image/webp');
          };
          image.crossOrigin = 'anonymous';
          image.src = URL.createObjectURL(file);
        });
      }
}
