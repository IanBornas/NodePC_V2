import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class IconRegistry {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.registerCustomIcons();
  }

  private registerCustomIcons() {
    // Register custom SVG icons
    this.matIconRegistry.addSvgIcon(
      'intel',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/intel.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'amd',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/amd.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'nvidia',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/nvidia.svg')
    );
  }
}
