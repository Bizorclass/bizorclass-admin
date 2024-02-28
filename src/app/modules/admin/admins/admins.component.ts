import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'admins',
    templateUrl    : './admins.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminsComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
