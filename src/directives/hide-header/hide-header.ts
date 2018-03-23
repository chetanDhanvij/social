import { Directive, Input, ElementRef, Renderer } from '@angular/core';

/**
 * Generated class for the HideHeaderDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[hide-header]', // Attribute selector
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class HideHeaderDirective {
  @Input("header") header: HTMLElement;
  headerHeight;
  scrollContent;

  constructor(public element: ElementRef, public renderer: Renderer) {

    console.log('Hello HideHeaderDirective Directive');
  }

  ngOnInit(){
    this.headerHeight = 70// this.header.clientHeight;
    this.renderer.setElementStyle(this.header, 'webkitTransition', 'top 700ms');
    this.scrollContent = this.element.nativeElement.getElementsByClassName("scroll-content")[0];
    this.renderer.setElementStyle(this.scrollContent, 'webkitTransition', 'margin-top 700ms');
  }

  onContentScroll(event){
    console.log(event)
    if(event == null) return;
    if(event.deltaY >= 0){
      this.renderer.setElementStyle(this.header, "top", `-${this.headerHeight}px`)
      this.renderer.setElementStyle(this.scrollContent, "margin-top", "0px")
    } else {
      this.renderer.setElementStyle(this.header, "top", "0px");
      this.renderer.setElementStyle(this.scrollContent, "margin-top", `${this.headerHeight}px`)
    }
  }

}
