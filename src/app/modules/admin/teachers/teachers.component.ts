import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'teachers',
    templateUrl    : './teachers.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeachersComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
