import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  searchControl: FormControl = new FormControl();
  subscription: Subscription;
  @Output() searchValueEmitter = new EventEmitter<string>();

  ngOnInit(): void {
    this.subscribeToSearchChanges();
  }

  subscribeToSearchChanges() {
    this.subscription = this.searchControl.valueChanges.pipe(distinctUntilChanged(),
      debounceTime(500)).subscribe((searchValue) => {
      this.searchValueEmitter.emit(searchValue.trim());
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


}
