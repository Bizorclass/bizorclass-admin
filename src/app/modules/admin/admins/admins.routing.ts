import { Route } from '@angular/router';
import { CanDeactivateAdminsDetails } from 'app/modules/admin/admins/admins.guards';
import { AdminsComponent } from 'app/modules/admin/admins/admins.component';
import { AdminsListComponent } from 'app/modules/admin/admins/list/list.component';
import { AdminsDetailsComponent } from 'app/modules/admin/admins/details/details.component';

export const adminsRoutes: Route[] = [
    {
        path     : '',
        component: AdminsComponent,
        // resolve  : {
        //     tags: AdminsTagsResolver
        // },
        children : [
            {
                path     : '',
                component: AdminsListComponent,
                // resolve  : {
                //     admins : AdminsResolver,
                //     countries: AdminsCountriesResolver
                // },
                children : [
                    {
                        path         : ':id',
                        component    : AdminsDetailsComponent,
                        // resolve      : {
                        //     contact  : AdminsContactResolver,
                        //     countries: AdminsCountriesResolver
                        // },
                        canDeactivate: [CanDeactivateAdminsDetails]
                    }
                ]
            }
        ]
    }
];
