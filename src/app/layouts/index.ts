export { LoadLayoutComponent } from './components';
export {
  LayoutDefaultComponent
} from './layout-default/layout-default.component';
export { NavbarDefaultComponent } from './layout-default';
export {
  LayoutCorpayandeComponent
} from './layout-corpayande/layout-corpayande.component';
export {
  LayoutTeatroJueteComponent
} from './layout-teatro-juete/layout-teatro-juete.component';
export {
  LayoutPijaosCaciquesComponent
} from './layout-pijaoscaciques/layout-pijaoscaciques.component';
export {
  LayoutDisabledComponent
} from './layout-disabled/layout-disabled.component';
export {
  NavbarCorpayandeComponent,
  FooterCorpayandeComponent
} from './layout-corpayande';
export {
  NavbarTeatroJueteComponent,
  FooterTeatroJueteComponent
} from './layout-teatro-juete';
export {
  NavbarPijaosCaciquesComponent,
  FooterPijaosCaciquesComponent
} from './layout-pijaoscaciques';

export const LAYOUTS: object = {
  default: true,
  disabled: true,
  corpayande: true,
  teatroJuete: true,
  pijaoscaciques: true
};
