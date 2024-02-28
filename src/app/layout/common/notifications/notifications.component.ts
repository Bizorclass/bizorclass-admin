import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { ApiService } from 'app/services/api.service';
import { AuthService } from 'app/modules/auth/auth.service';

@Component({
    selector       : 'notifications',
    templateUrl    : './notifications.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'notifications',
    styles: [
        `
            .load-more {
                text-align: center;
                padding: 20px;
                &:hover {
                    color: #4f46e5;
                }
                span {
                    cursor: pointer;
                }
            }
        `
    ]
})
export class NotificationsComponent implements OnInit, OnDestroy
{
    @ViewChild('notificationsOrigin') private _notificationsOrigin: MatButton;
    @ViewChild('notificationsPanel') private _notificationsPanel: TemplateRef<any>;

    notifications: any[];
    unreadCount: number = 0;
    hasMore:boolean = true;
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    user = null;
    pageNo:number = 1;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _notificationsService: NotificationsService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private apiService: ApiService,
        private _authService: AuthService,
    ) {
        this._authService.user.pipe((takeUntil(this._unsubscribeAll))).subscribe((user: any) => {
            // console.log({ user });
            this.user = user;
            this.getAllNotificationFromServer();
        });
    }

    ngOnInit(): void { }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlay
        if ( this._overlayRef ) {
            this._overlayRef.dispose();
        }
    }
//

    async getAllNotificationFromServer() {
        console.log(`%c Notification || page => ${this.pageNo}`, "color: red;");
        const notificationResponse:any = await this.apiService.getAdminNotificationByAdminId(this.user.admin_id, this.pageNo);
        // console.log(notificationResponse);
        if (notificationResponse?.data) {
            if (this.pageNo === 1) {
                this.notifications = notificationResponse?.data;
            } else {
                this.notifications = [...this.notifications, ...notificationResponse?.data];
            }
            this.hasMore = !Boolean(this.notifications.length === notificationResponse?.count);
            this.unreadCount = this.notifications.filter(f => !f?.is_read).length || 0;
            // console.log(this.hasMore);
        }
        this._changeDetectorRef.detectChanges();
    }

    loadMore() {
        this.pageNo = this.pageNo + 1;
        this.getAllNotificationFromServer();
    }

    openPanel(): void {
        // Return if the notifications panel or its origin is not defined
        if ( !this._notificationsPanel || !this._notificationsOrigin ) {
            return;
        }

        // Create the overlay if it doesn't exist
        if ( !this._overlayRef ) {
            this._createOverlay();
        }

        // Attach the portal to the overlay
        this._overlayRef.attach(new TemplatePortal(this._notificationsPanel, this._viewContainerRef));
    }

    closePanel(): void {
        this._overlayRef.detach();
    }

    async markAllAsRead(): Promise<void> {
        await this.apiService.markReadAllAdminNotificationByAdminId(this.user.admin_id);
        this.unreadCount = 0;
        this.notifications = [...this.notifications.map(m => ({...m, is_read: true}))];

        this._changeDetectorRef.detectChanges();
    }

    toggleRead(notification: Notification): void {
        // Toggle the read status
        notification.read = !notification.read;

        // Update the notification
        this._notificationsService.update(notification.id, notification).subscribe();
    }

    delete(notification: Notification): void {
        // Delete the notification
        this._notificationsService.delete(notification.id).subscribe();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    private _createOverlay(): void
    {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            hasBackdrop     : true,
            backdropClass   : 'fuse-backdrop-on-mobile',
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                                  .flexibleConnectedTo(this._notificationsOrigin._elementRef.nativeElement)
                                  .withLockedPosition(true)
                                  .withPush(true)
                                  .withPositions([
                                      {
                                          originX : 'start',
                                          originY : 'bottom',
                                          overlayX: 'start',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'start',
                                          originY : 'top',
                                          overlayX: 'start',
                                          overlayY: 'bottom'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'bottom',
                                          overlayX: 'end',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'top',
                                          overlayX: 'end',
                                          overlayY: 'bottom'
                                      }
                                  ])
        });

        // Detach the overlay from the portal on backdrop click
        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }

}
