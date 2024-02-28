import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { filter, fromEvent, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { AdminsService } from 'app/modules/admin/admins/admins.service';
import { ApiService } from 'app/services/api.service';

@Component({
    selector       : 'admins-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminsListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    adminServerList: any[] = null;
    // [
    //     {
    //         admin_id: "abc",
    //         first_name: "Pankaj",
    //         last_name: "Agade",
    //         email: "pankaj@gmail.com",
    //         photo_url: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"
    //     },
    //     {
    //         admin_id: "abc 2",
    //         first_name: "Siddharth",
    //         last_name: "Changede",
    //         email: "sid@gmail.com",
    //         photo_url: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"
    //     },
    //     {
    //         admin_id: "abc 3",
    //         first_name: "Vedeshree",
    //         last_name: "Lagad",
    //         email: "vedshree@gmail.com",
    //         photo_url: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"
    //     },
    //     {
    //         admin_id: "abc 4",
    //         first_name: "Yashaswi",
    //         last_name: "Patil",
    //         email: "yashaswi@gmail.com",
    //         photo_url: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"
    //     },
    // ];

    isLoading:boolean = true;
    adminList: any[] = null;



    drawerMode: 'side' | 'over';
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedContact: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private apiService: ApiService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    )
    {
    }


    ngOnInit(): void
    {

        this.getAdminListFromServer();


        //todo Search [done]
        this.searchInputControl.valueChanges.subscribe(query => {
            // console.log({query});
            // console.log(this.adminServerList.map(m => ({...m, name: m.first_name+" "+m.last_name})).filter(f => f.name.includes(query)));

            this.adminList = this.adminServerList.map(m => ({...m, name: `${m.first_name} ${m.last_name}`.toLowerCase()})).filter(f => f.name.includes(query.toLowerCase()));
        })

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if ( !opened )
            {
                // Remove the selected contact when drawer closed
                this.selectedContact = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(({matchingAliases}) => {

            // Set the drawerMode if the given breakpoint is active
            if ( matchingAliases.includes('lg') )
            {
                this.drawerMode = 'side';
            }
            else
            {
                this.drawerMode = 'over';
            }

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // Listen for shortcuts
        fromEvent(this._document, 'keydown').pipe(
            takeUntil(this._unsubscribeAll),
            filter<KeyboardEvent>(event =>
                (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
                && (event.key === '/') // '/'
            )
        ).subscribe(() => {
            this.createContact();
        });
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    getAdminListFromServer() {
        //todo get admins from server
        //* --> [adminServerList, adminList]
        this.isLoading = true;
        this.apiService.getAdmins().subscribe((res: any) => {
            console.log(res);

            if (res.data) {
                this.adminList = [...res.data];
                this.adminServerList = [...res.data];
                this._changeDetectorRef.markForCheck();
            }
            this.isLoading = false;

        }, (err) => {
            console.log(err);
            this.isLoading = false;
        });

    }


    onBackdropClicked(): void
    {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Create contact
     */
    createContact(): void
    {
        // Create the contact
        // this._adminsService.createContact().subscribe((newContact) => {

        //     // Go to the new contact
        //     this._router.navigate(['./', newContact.id], {relativeTo: this._activatedRoute});

        //     // Mark for check
        //     this._changeDetectorRef.markForCheck();
        // });


        this._router.navigate(['./', "createAdmin"], {relativeTo: this._activatedRoute});

    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
