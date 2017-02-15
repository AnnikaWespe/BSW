import {Component} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'membership-data-form',
  template: `
<form novalidate>...</form>
`
})
export class MembershipDataFormComponent{
  user: FormGroup;

  constructor(){}
}

